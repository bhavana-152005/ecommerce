/*
 * Seirraa — client-side fashion colour assistant.
 * Runs fully in the browser (no Java, no backend required):
 *   - extracts dominant colours from an uploaded/captured photo via canvas + median-cut
 *   - derives undertone, seasonal colour type and harmony palettes (colour theory)
 *   - turns all of that into concrete outfit suggestions
 * Text-only requests use the same colour engine plus keyword styling guidance.
 */

const seirraaState = {
  reportText: '',
  messages: []
};

function shouldSkipSeirraa() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/login') || path.includes('/signup') || path.includes('/logout');
}

/* ------------------------------------------------------------------ */
/* Colour maths                                                        */
/* ------------------------------------------------------------------ */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

const NAMED_COLORS = [
  { name: 'black', r: 20, g: 20, b: 20 },
  { name: 'charcoal', r: 60, g: 63, b: 68 },
  { name: 'grey', r: 140, g: 140, b: 140 },
  { name: 'silver', r: 200, g: 200, b: 205 },
  { name: 'white', r: 245, g: 245, b: 245 },
  { name: 'cream', r: 240, g: 232, b: 210 },
  { name: 'beige', r: 214, g: 196, b: 165 },
  { name: 'tan', r: 190, g: 150, b: 110 },
  { name: 'brown', r: 120, g: 80, b: 50 },
  { name: 'camel', r: 175, g: 135, b: 90 },
  { name: 'red', r: 200, g: 40, b: 45 },
  { name: 'maroon', r: 120, g: 30, b: 40 },
  { name: 'coral', r: 240, g: 110, b: 100 },
  { name: 'peach', r: 245, g: 190, b: 160 },
  { name: 'orange', r: 235, g: 140, b: 50 },
  { name: 'mustard', r: 210, g: 170, b: 60 },
  { name: 'gold', r: 205, g: 165, b: 70 },
  { name: 'yellow', r: 240, g: 215, b: 80 },
  { name: 'olive', r: 120, g: 120, b: 60 },
  { name: 'green', r: 60, g: 150, b: 80 },
  { name: 'emerald', r: 40, g: 140, b: 100 },
  { name: 'mint', r: 170, g: 220, b: 190 },
  { name: 'teal', r: 40, g: 130, b: 130 },
  { name: 'sky blue', r: 135, g: 190, b: 230 },
  { name: 'blue', r: 45, g: 90, b: 190 },
  { name: 'navy', r: 30, g: 45, b: 90 },
  { name: 'denim', r: 70, g: 100, b: 150 },
  { name: 'lavender', r: 190, g: 175, b: 225 },
  { name: 'purple', r: 130, g: 70, b: 170 },
  { name: 'plum', r: 100, g: 55, b: 95 },
  { name: 'magenta', r: 200, g: 60, b: 150 },
  { name: 'pink', r: 235, g: 150, b: 185 },
  { name: 'blush', r: 240, g: 200, b: 205 },
  { name: 'burgundy', r: 110, g: 30, b: 55 }
];

function nearestColorName(r, g, b) {
  let best = NAMED_COLORS[0];
  let bestDist = Infinity;
  for (const c of NAMED_COLORS) {
    // weighted euclidean distance (approx. perceptual)
    const dr = (r - c.r) * 0.3;
    const dg = (g - c.g) * 0.59;
    const db = (b - c.b) * 0.11;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return best.name;
}

/* ------------------------------------------------------------------ */
/* Image palette extraction (median-cut quantization)                 */
/* ------------------------------------------------------------------ */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unable to load image'));
    img.src = src;
  });
}

function getPixels(img, maxDim = 160) {
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 125) continue; // skip transparent
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  return pixels;
}

function medianCut(pixels, targetColors) {
  if (!pixels.length) return [];
  let buckets = [pixels];

  const rangeOf = (bucket) => {
    const min = [255, 255, 255];
    const max = [0, 0, 0];
    for (const p of bucket) {
      for (let c = 0; c < 3; c++) {
        if (p[c] < min[c]) min[c] = p[c];
        if (p[c] > max[c]) max[c] = p[c];
      }
    }
    return [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  };

  while (buckets.length < targetColors) {
    // pick the bucket with the largest channel range
    let idx = -1;
    let bestRange = -1;
    let bestChannel = 0;
    buckets.forEach((bucket, i) => {
      if (bucket.length < 2) return;
      const range = rangeOf(bucket);
      const channel = range.indexOf(Math.max(...range));
      if (range[channel] > bestRange) {
        bestRange = range[channel];
        idx = i;
        bestChannel = channel;
      }
    });
    if (idx === -1) break;
    const bucket = buckets[idx].slice().sort((a, b) => a[bestChannel] - b[bestChannel]);
    const mid = Math.floor(bucket.length / 2);
    buckets.splice(idx, 1, bucket.slice(0, mid), bucket.slice(mid));
  }

  return buckets
    .filter((bucket) => bucket.length)
    .map((bucket) => {
      const sum = bucket.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
      const n = bucket.length;
      const r = sum[0] / n, g = sum[1] / n, b = sum[2] / n;
      return { r, g, b, count: n, hex: rgbToHex(r, g, b), ...rgbToHsl(r, g, b), name: nearestColorName(r, g, b) };
    })
    .sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------------ */
/* Colour theory analysis                                             */
/* ------------------------------------------------------------------ */

function analyzeUndertone(colors) {
  // consider only reasonably saturated colours for undertone
  const chromatic = colors.filter((c) => c.s > 0.15 && c.l > 0.12 && c.l < 0.9);
  const pool = chromatic.length ? chromatic : colors;
  let warm = 0;
  let cool = 0;
  let weight = 0;
  for (const c of pool) {
    const w = c.count * (0.4 + c.s);
    weight += w;
    // warm hues: reds/oranges/yellows (<70) and magentas (>300)
    if (c.h < 70 || c.h >= 300) warm += w;
    else if (c.h >= 120 && c.h < 300) cool += w;
    else warm += w * 0.4, cool += w * 0.6; // yellow-green transition
  }
  const ratio = warm / (warm + cool || 1);
  if (ratio > 0.62) return 'warm';
  if (ratio < 0.4) return 'cool';
  return 'neutral';
}

function seasonalType(undertone, colors) {
  const chromatic = colors.filter((c) => c.s > 0.12);
  const pool = chromatic.length ? chromatic : colors;
  const avgL = pool.reduce((a, c) => a + c.l, 0) / pool.length;
  const avgS = pool.reduce((a, c) => a + c.s, 0) / pool.length;
  const light = avgL >= 0.5;
  if (undertone === 'warm') {
    return light || avgS >= 0.5 ? 'Warm Spring' : 'Warm Autumn';
  }
  if (undertone === 'cool') {
    return light ? 'Cool Summer' : 'Cool Winter';
  }
  return light ? 'Soft Summer' : 'Deep Neutral';
}

function harmonyPalette(baseHue) {
  const s = 0.62;
  const l = 0.52;
  const mk = (h) => ({ hex: hslToHex(h, s, l), name: nearestColorName(...Object.values(hslToRgb(h, s, l))), hue: ((h % 360) + 360) % 360 });
  return {
    complementary: mk(baseHue + 180),
    analogous: [mk(baseHue + 30), mk(baseHue - 30)],
    triadic: [mk(baseHue + 120), mk(baseHue + 240)],
    splitComplement: [mk(baseHue + 150), mk(baseHue + 210)]
  };
}

const SEASON_NEUTRALS = {
  'Warm Spring': ['ivory', 'camel', 'warm beige', 'golden brown'],
  'Warm Autumn': ['chocolate', 'olive', 'rust', 'cream'],
  'Cool Summer': ['soft white', 'grey', 'slate blue', 'rose taupe'],
  'Cool Winter': ['pure white', 'charcoal', 'navy', 'black'],
  'Soft Summer': ['stone', 'dove grey', 'muted navy', 'off-white'],
  'Deep Neutral': ['black', 'charcoal', 'espresso', 'ivory']
};

function pickBaseColor(colors) {
  // most dominant colour that still has real chroma; else the most dominant
  const chromatic = colors.filter((c) => c.s > 0.22 && c.l > 0.15 && c.l < 0.88);
  return (chromatic[0] || colors[0]);
}

/* ------------------------------------------------------------------ */
/* Outfit suggestions                                                 */
/* ------------------------------------------------------------------ */

function outfitSuggestions(base, harmony, undertone) {
  const dominant = base.name;
  const comp = harmony.complementary.name;
  const accentA = harmony.analogous[0].name;
  const metal = undertone === 'cool' ? 'silver / white-gold' : undertone === 'warm' ? 'gold / brass' : 'rose-gold';
  return [
    `Anchor the look in ${dominant} and pair it with a ${comp} accent piece for a high-contrast, balanced outfit.`,
    `For an easy everyday version, keep ${dominant} with a nearby ${accentA} layer (analogous pairing) and a neutral bottom.`,
    `Finish with ${metal} jewellery/accessories — it flatters your ${undertone} undertone.`
  ];
}

/* ------------------------------------------------------------------ */
/* Report building + rendering                                        */
/* ------------------------------------------------------------------ */

function buildImageReport(colors) {
  const palette = colors.slice(0, 6);
  const base = pickBaseColor(palette);
  const undertone = analyzeUndertone(palette);
  const season = seasonalType(undertone, palette);
  const harmony = harmonyPalette(base.h);
  const suggestions = outfitSuggestions(base, harmony, undertone);
  const neutrals = SEASON_NEUTRALS[season] || ['ivory', 'charcoal'];

  const paletteText = palette.map((c) => `${c.name} (${c.hex})`).join(', ');
  const reportText = [
    'SEIRRAA COLOUR REPORT',
    '',
    `Dominant palette: ${paletteText}`,
    `Undertone: ${undertone}`,
    `Seasonal colour type: ${season}`,
    `Best neutrals for you: ${neutrals.join(', ')}`,
    '',
    'Colour theory pairings:',
    `- Complementary: ${harmony.complementary.name} (${harmony.complementary.hex})`,
    `- Analogous: ${harmony.analogous.map((h) => `${h.name} (${h.hex})`).join(', ')}`,
    `- Triadic: ${harmony.triadic.map((h) => `${h.name} (${h.hex})`).join(', ')}`,
    `- Split-complementary: ${harmony.splitComplement.map((h) => `${h.name} (${h.hex})`).join(', ')}`,
    '',
    'Outfit suggestions:',
    ...suggestions.map((s) => `- ${s}`)
  ].join('\n');

  return { palette, base, undertone, season, harmony, suggestions, neutrals, reportText };
}

function swatchRow(colors) {
  const row = document.createElement('div');
  row.className = 'seirraa-swatch-row';
  colors.forEach((c) => {
    const chip = document.createElement('span');
    chip.className = 'seirraa-swatch';
    chip.style.backgroundColor = c.hex;
    chip.title = `${c.name} ${c.hex}`;
    const label = document.createElement('span');
    label.className = 'seirraa-swatch-label';
    label.textContent = c.name;
    const wrap = document.createElement('span');
    wrap.className = 'seirraa-swatch-wrap';
    wrap.appendChild(chip);
    wrap.appendChild(label);
    row.appendChild(wrap);
  });
  return row;
}

function renderImageReport(report, chatElement) {
  const chat = chatElement || document.getElementById('assistantChat');
  if (!chat) return;

  const card = document.createElement('div');
  card.className = 'assistant-message assistant-message-bot seirraa-report';

  const heading = document.createElement('strong');
  heading.textContent = `Your undertone reads ${report.undertone} — ${report.season}.`;
  card.appendChild(heading);

  const addSection = (title, colors, note) => {
    const t = document.createElement('div');
    t.className = 'seirraa-section-title';
    t.textContent = note ? `${title}: ${note}` : title;
    card.appendChild(t);
    card.appendChild(swatchRow(colors));
  };

  addSection('Detected palette', report.palette);
  addSection('Complementary', [report.harmony.complementary]);
  addSection('Analogous', report.harmony.analogous);
  addSection('Triadic', report.harmony.triadic);

  const neutrals = document.createElement('div');
  neutrals.className = 'seirraa-section-title';
  neutrals.textContent = `Best neutrals: ${report.neutrals.join(', ')}`;
  card.appendChild(neutrals);

  const ideas = document.createElement('ul');
  ideas.className = 'seirraa-suggestions';
  report.suggestions.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s;
    ideas.appendChild(li);
  });
  card.appendChild(ideas);

  const download = document.createElement('button');
  download.className = 'seirraa-download-btn';
  download.type = 'button';
  download.textContent = 'Download report';
  download.addEventListener('click', () => downloadSeirraaReport(report.reportText));
  card.appendChild(download);

  chat.appendChild(card);
  chat.scrollTop = chat.scrollHeight;
}

async function analyzeImageData(imageData, chatElement) {
  const img = await loadImage(imageData);
  const pixels = getPixels(img);
  const colors = medianCut(pixels, 6);
  if (!colors.length) {
    appendAssistantMessage('I could not read colours from that image. Please try a clearer, well-lit photo.', 'bot', { chatElement });
    return;
  }
  const report = buildImageReport(colors);
  seirraaState.reportText = report.reportText;
  renderImageReport(report, chatElement);
}

/* ------------------------------------------------------------------ */
/* Text styling engine (colour theory from named colours + keywords)  */
/* ------------------------------------------------------------------ */

function findNamedColorInText(text) {
  const match = NAMED_COLORS.find((c) => text.includes(c.name));
  return match || null;
}

function buildStyleReply(userText) {
  const text = (userText || '').toLowerCase();
  const parts = [];

  const named = findNamedColorInText(text);
  if (named) {
    const hsl = rgbToHsl(named.r, named.g, named.b);
    const harmony = harmonyPalette(hsl.h);
    const undertone = hsl.h < 70 || hsl.h >= 300 ? 'warm' : (hsl.h >= 120 && hsl.h < 300 ? 'cool' : 'neutral');
    parts.push(
      `Building around ${named.name}: try a ${harmony.complementary.name} accent (complementary), ` +
      `or keep it soft with ${harmony.analogous[0].name} / ${harmony.analogous[1].name} (analogous). ` +
      `A ${undertone === 'cool' ? 'silver' : undertone === 'warm' ? 'gold' : 'rose-gold'} finish suits it best.`
    );
  }

  if (text.includes('goth') || text.includes('dark')) {
    parts.push('For a bold gothic edge: black mesh or satin top, charcoal tailored blazer, and silver hardware.');
  }
  if (text.includes('brunch') || text.includes('casual')) {
    parts.push('For relaxed brunch: a linen shirt, soft pastel trousers, and a lightweight tote.');
  }
  if (text.includes('date') || text.includes('dinner')) {
    parts.push('For a dinner date: deep navy or emerald, add gold jewellery, and finish with sleek heels or loafers.');
  }
  if (text.includes('office') || text.includes('work') || text.includes('interview')) {
    parts.push('For work: a neutral base (navy, grey, camel) with one confident accent colour keeps it polished.');
  }
  if (text.includes('festival') || text.includes('party')) {
    parts.push('For festivals/parties: play a triadic mix — one vivid lead colour and two supporting accents.');
  }

  if (!parts.length) {
    parts.push('Tell me a colour, mood or occasion — or upload a photo and I will read its palette and undertone, then suggest colour-theory pairings and outfits.');
  }

  return `Seirraa: ${parts.join(' ')} Balance comfort with confidence — your best look starts with how you feel.`;
}

function appendAssistantMessage(text, role = 'bot', options = {}) {
  const chat = options.chatElement || document.getElementById('assistantChat');
  if (!chat) return;

  const message = document.createElement('div');
  message.className = `assistant-message ${role === 'user' ? 'assistant-message-user' : 'assistant-message-bot'}`;
  message.textContent = text;
  chat.appendChild(message);

  if (options.downloadable) {
    const button = document.createElement('button');
    button.className = 'seirraa-download-btn';
    button.textContent = 'Download report';
    button.type = 'button';
    button.addEventListener('click', () => downloadSeirraaReport(text));
    chat.appendChild(button);
  }

  chat.scrollTop = chat.scrollHeight;
}

function downloadSeirraaReport(text) {
  const report = text || seirraaState.reportText || 'Seirraa report';
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'seirraa-colour-report.txt';
  link.click();
  URL.revokeObjectURL(link.href);
}

async function askSeirraa(value, description = '', imageData = '', imageMimeType = '', chatElement = null) {
  // Image → always analysed locally (colour theory, no backend/Java needed).
  if (imageData) {
    try {
      await analyzeImageData(imageData, chatElement);
      return;
    } catch (error) {
      console.warn('Seirraa local image analysis failed.', error);
      appendAssistantMessage('I had trouble analysing that image. Please try another photo.', 'bot', { chatElement });
      return;
    }
  }

  // Text → local styling engine.
  seirraaState.reportText = buildStyleReply(value || description);
  appendAssistantMessage(seirraaState.reportText, 'bot', { chatElement, downloadable: true });
}

function bindHomepageAssistant() {
  const form = document.getElementById('assistantForm');
  const input = document.getElementById('assistantInput');
  const chat = document.getElementById('assistantChat');

  if (!form || !input || !chat) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    appendAssistantMessage(value, 'user');
    input.value = '';
    window.setTimeout(() => askSeirraa(value), 200);
  });
}

function createFloatingSeirraaWidget() {
  if (shouldSkipSeirraa() || document.getElementById('seirraaFloatingWidget')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'seirraaFloatingWidget';
  wrapper.className = 'seirraa-widget';
  wrapper.innerHTML = `
    <button type="button" class="seirraa-toggle" id="seirraaToggle">Seirraa</button>
    <div class="seirraa-panel" id="seirraaPanel">
      <div class="seirraa-panel-header">
        <div>
          <h3>Seirraa</h3>
          <p>Upload or capture a photo for a precise colour-theory report and outfit recommendation.</p>
        </div>
        <button type="button" class="seirraa-close" id="seirraaClose">×</button>
      </div>
      <div class="seirraa-chat" id="seirraaWidgetChat"></div>
      <div class="seirraa-file-row">
        <button type="button" class="seirraa-file-button" id="seirraaUploadBtn">Upload image</button>
        <button type="button" class="seirraa-file-button secondary" id="seirraaCaptureBtn">Capture photo</button>
        <input type="file" id="seirraaFileInput" accept="image/*" style="display:none;" />
        <input type="file" id="seirraaCaptureInput" accept="image/*" capture="environment" style="display:none;" />
      </div>
      <p class="seirraa-helper">Best results: a clear, well-lit photo. You can also just describe the look you want.</p>
      <form class="assistant-form seirraa-form" id="seirraaForm">
        <input id="seirraaInput" type="text" placeholder="Enter a short request for Seirraa" />
        <textarea id="seirraaDescription" rows="4" placeholder="Provide more detail: mood, occasion, colour palette or outfit preference"></textarea>
        <button type="submit">Send to Seirraa</button>
      </form>
      <button type="button" class="seirraa-download-btn seirraa-download-btn-inline" id="seirraaDownloadBtn">Download report</button>
    </div>
  `;

  document.body.appendChild(wrapper);

  const toggle = document.getElementById('seirraaToggle');
  const panel = document.getElementById('seirraaPanel');
  const close = document.getElementById('seirraaClose');
  const form = document.getElementById('seirraaForm');
  const input = document.getElementById('seirraaInput');
  const fileInput = document.getElementById('seirraaFileInput');
  const captureInput = document.getElementById('seirraaCaptureInput');
  const downloadBtn = document.getElementById('seirraaDownloadBtn');
  const widgetChat = document.getElementById('seirraaWidgetChat');
  const descriptionInput = document.getElementById('seirraaDescription');

  toggle.addEventListener('click', () => wrapper.classList.toggle('open'));
  close.addEventListener('click', () => wrapper.classList.remove('open'));
  downloadBtn.addEventListener('click', () => {
    if (!seirraaState.reportText) return;
    downloadSeirraaReport(seirraaState.reportText);
  });

  const uploadBtn = document.getElementById('seirraaUploadBtn');
  const captureBtn = document.getElementById('seirraaCaptureBtn');
  let pendingImage = { data: '', type: '' };

  const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });

  const handleSelectedFile = async (fileList) => {
    const file = fileList && fileList[0];
    if (!file) return;
    try {
      pendingImage = { data: await readFile(file), type: file.type || 'image/jpeg' };
      appendAssistantMessage('Photo added. Press "Send to Seirraa" (add an occasion for tailored ideas).', 'bot', { chatElement: widgetChat });
    } catch (error) {
      appendAssistantMessage('Could not read that file. Please try another image.', 'bot', { chatElement: widgetChat });
    }
  };

  if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput.click());
  if (captureBtn) captureBtn.addEventListener('click', () => captureInput.click());
  fileInput.addEventListener('change', () => handleSelectedFile(fileInput.files));
  captureInput.addEventListener('change', () => handleSelectedFile(captureInput.files));

  [input, descriptionInput].forEach((field) => {
    if (!field) return;
    field.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && field.tagName !== 'TEXTAREA') {
        event.preventDefault();
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = input.value.trim();
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const hasImage = Boolean(pendingImage.data);

    if (!value && !description && !hasImage) {
      appendAssistantMessage('Please upload a photo or enter a request with details to begin.', 'bot', { chatElement: widgetChat });
      return;
    }

    const userMessage = [value, description].filter(Boolean).join(' | ') || 'Please analyse this photo for me.';
    appendAssistantMessage(userMessage, 'user', { chatElement: widgetChat });

    input.value = '';
    if (descriptionInput) descriptionInput.value = '';
    fileInput.value = '';
    captureInput.value = '';

    const image = pendingImage;
    pendingImage = { data: '', type: '' };

    await askSeirraa(value, description, image.data, image.type, widgetChat);
  });
}

function injectSeirraaStyles() {
  if (document.getElementById('seirraaInlineStyles')) return;
  const style = document.createElement('style');
  style.id = 'seirraaInlineStyles';
  style.textContent = `
    .seirraa-report { display: flex; flex-direction: column; gap: 8px; }
    .seirraa-section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.75; margin-top: 4px; }
    .seirraa-swatch-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .seirraa-swatch-wrap { display: flex; flex-direction: column; align-items: center; gap: 3px; width: 54px; }
    .seirraa-swatch { width: 40px; height: 40px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
    .seirraa-swatch-label { font-size: 10px; text-align: center; line-height: 1.1; word-break: break-word; }
    .seirraa-suggestions { margin: 4px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
  `;
  document.head.appendChild(style);
}

function initSeirraa() {
  injectSeirraaStyles();
  bindHomepageAssistant();
  createFloatingSeirraaWidget();
}

document.addEventListener('DOMContentLoaded', initSeirraa);
