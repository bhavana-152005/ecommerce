const seirraaState = {
  reportText: '',
  messages: []
};

function shouldSkipSeirraa() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/login') || path.includes('/signup') || path.includes('/logout');
}

function buildStyleReply(userText) {
  const text = userText.toLowerCase();
  const suggestions = [];

  if (text.includes('goth') || text.includes('dark')) {
    suggestions.push('Try a black mesh top, silver accessories, and a tailored blazer for a bold gothic edge.');
  }
  if (text.includes('brunch') || text.includes('casual')) {
    suggestions.push('A linen shirt, soft pastel trousers, and a lightweight tote will feel polished but relaxed.');
  }
  if (text.includes('date') || text.includes('dinner')) {
    suggestions.push('Choose a deep navy dress or shirt, add gold jewellery, and finish with sleek heels or loafers.');
  }
  if (text.includes('color') || text.includes('palette') || text.includes('pink') || text.includes('blue') || text.includes('gold')) {
    suggestions.push('For a cohesive palette, pair one dominant shade with one accent and one neutral.');
  }
  if (suggestions.length === 0) {
    suggestions.push('I can suggest a look around your mood, occasion, and color palette. Try describing your outfit goal.');
  }

  return `Seirraa says: ${suggestions.join(' ')} Also, remember to balance comfort with confidence—your best look always starts with how you feel.`;
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
  const messageText = [value, description].filter(Boolean).join('\n\n').trim();
  try {
    if (typeof BelleApi !== 'undefined' && BelleApi.seirraa) {
      const payload = { message: messageText };
      if (imageData) {
        payload.imageData = imageData;
        payload.imageMimeType = imageMimeType;
      }
      const data = await BelleApi.seirraa(payload);
      if (data && data.reply) {
        seirraaState.reportText = data.reply;
        appendAssistantMessage(data.reply, 'bot', { downloadable: true, chatElement });
        return;
      }
    }
  } catch (error) {
    console.warn('Seirraa LLM request failed, using local fallback.', error);
  }

  seirraaState.reportText = buildStyleReply(value);
  appendAssistantMessage(seirraaState.reportText, 'bot', { chatElement });
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
    window.setTimeout(() => askSeirraa(value), 250);
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
          <p>Upload or capture a photo now for a precise colour theory report and outfit recommendation.</p>
        </div>
        <button type="button" class="seirraa-close" id="seirraaClose">×</button>
      </div>
      <div class="seirraa-chat" id="seirraaWidgetChat"></div>
      <div class="seirraa-file-row">
        <button type="button" class="seirraa-file-button" id="seirraaUploadBtn">Upload image</button>
        <button type="button" class="seirraa-file-button secondary" id="seirraaCaptureBtn">Capture photo</button>
        <input type="file" id="seirraaFileInput" accept="image/*,*/*" capture="environment" style="display:none;" />
      </div>
      <p class="seirraa-helper">For best results, use a high-quality photo or describe the look you want.</p>
      <form class="assistant-form seirraa-form" id="seirraaForm">
        <input id="seirraaInput" type="text" placeholder="Enter a short request for Seirraa" />
        <textarea id="seirraaDescription" rows="4" placeholder="Provide more detail, mood, occasion, color palette or outfit preference"></textarea>
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
  const downloadBtn = document.getElementById('seirraaDownloadBtn');
  const widgetChat = document.getElementById('seirraaWidgetChat');

  toggle.addEventListener('click', () => wrapper.classList.toggle('open'));
  close.addEventListener('click', () => wrapper.classList.remove('open'));
  downloadBtn.addEventListener('click', () => {
    if (!seirraaState.reportText) return;
    downloadSeirraaReport(seirraaState.reportText);
  });

  const uploadBtn = document.getElementById('seirraaUploadBtn');
  const captureBtn = document.getElementById('seirraaCaptureBtn');

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => fileInput.click());
  }
  if (captureBtn) {
    captureBtn.addEventListener('click', () => fileInput.click());
  }

  const descriptionInput = document.getElementById('seirraaDescription');
  [input, descriptionInput].forEach((field) => {
    if (!field) return;
    field.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = input.value.trim();
    const description = descriptionInput?.value.trim() || '';
    const file = fileInput.files && fileInput.files[0];
    if (!value && !description && !file) {
      appendAssistantMessage('Please upload a photo or enter a request with details to begin.', 'bot', { chatElement: widgetChat });
      return;
    }

    const userMessage = [value, description].filter(Boolean).join(' | ');
    appendAssistantMessage(userMessage || 'Please review this image for a colour analysis.', 'user', { chatElement: widgetChat });
    input.value = '';
    if (descriptionInput) {
      descriptionInput.value = '';
    }
    fileInput.value = '';

    let imageData = '';
    let imageMimeType = '';

    if (file) {
      const reader = new FileReader();
      imageMimeType = file.type || 'image/jpeg';
      imageData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result || '');
        reader.onerror = () => reject(new Error('Unable to read image'));
        reader.readAsDataURL(file);
      });
    }

    await askSeirraa(value, description, imageData, imageMimeType, widgetChat);
  });
}

function initSeirraa() {
  bindHomepageAssistant();
  createFloatingSeirraaWidget();
}

document.addEventListener('DOMContentLoaded', initSeirraa);
