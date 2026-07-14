import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class SeirraaModel {
    private SeirraaModel() {
        // utility class
    }

    public static String generateReply(String message, String imageData, String imageMimeType) {
        String userText = message == null ? "" : message.trim();
        String normalized = userText.toLowerCase(Locale.ROOT);
        String occasion = detect(normalized, OCCASION_KEYWORDS, "everyday wear");
        String palette = detect(normalized, PALETTE_KEYWORDS, "modern neutrals");
        String style = detect(normalized, STYLE_KEYWORDS, "clean and tailored");
        String body = detect(normalized, BODY_SHAPE_KEYWORDS, "balanced silhouette");
        String focus = detect(normalized, FOCUS_KEYWORDS, "smart styling details");
        boolean hasImage = imageData != null && !imageData.isBlank();

        String imageSummary = hasImage
                ? "I also reviewed the image you uploaded, and it adds depth to my color and fit suggestions."
                : "";

        List<String> sections = new ArrayList<>();
        sections.add("Color analysis: " + buildColorAnalysis(palette, style, occasion, imageSummary));
        sections.add("Styling advice: " + buildStylingAdvice(style, palette, body, occasion));
        sections.add("What to wear and avoid: " + buildWearAvoidAdvice(style, palette, body, focus));
        sections.add("Shopping recommendation: " + buildRecommendation(style, palette, occasion));

        return String.join("\n\n", sections).trim();
    }

    private static String buildColorAnalysis(String palette, String style, String occasion, String imageSummary) {
        return String.format("For %s, %s is a strong choice. %s Stick to %s tones layered with one contrasting accent for a modern, polished outcome.",
                occasion, palette, imageSummary, palette);
    }

    private static String buildStylingAdvice(String style, String palette, String body, String occasion) {
        return String.format("Lean into %s silhouettes with texture and proportion tailored to %s. Mix %s accents with clean basics so the outfit reads intentional rather than busy.",
                style, body, palette);
    }

    private static String buildWearAvoidAdvice(String style, String palette, String body, String focus) {
        String avoid = "Avoid too many competing prints or overly loose layers that hide your shape.";
        if (body.contains("petite") || body.contains("tall")) {
            avoid = "Avoid oversized pieces that swamp your frame; instead choose sharper tailoring or defined waistlines.";
        } else if (body.contains("curvy") || body.contains("hourglass")) {
            avoid = "Avoid stiff boxy shapes; instead favour pieces that highlight your waist with soft support.";
        }
        return String.format("Choose refined pieces with one standout detail and keep the rest understated. %s %s.", avoid, focus);
    }

    private static String buildRecommendation(String style, String palette, String occasion) {
        return String.format("A %s statement layer in %s paired with minimalist accessories will elevate %s while staying versatile for future looks.",
                style, palette, occasion);
    }

    private static String detect(String text, String[][] options, String fallback) {
        for (String[] option : options) {
            for (String token : option) {
                if (text.contains(token)) {
                    return option[0];
                }
            }
        }
        return fallback;
    }

    private static final String[][] OCCASION_KEYWORDS = new String[][]{
            {"day-to-day", "casual", "brunch", "errand", "everyday"},
            {"dinner", "date", "evening", "night out", "restaurant"},
            {"office", "work", "meeting", "presentation", "interview"},
            {"party", "festival", "celebration", "club", "event"},
            {"travel", "vacation", "beach", "holiday", "airport"},
            {"formal", "wedding", "ceremony", "gala", "ball"}
    };

    private static final String[][] PALETTE_KEYWORDS = new String[][]{
            {"warm earth tones", "warm", "earth", "mustard", "terracotta", "brown"},
            {"cool jewel tones", "cool", "emerald", "sapphire", "deep blue", "purple"},
            {"soft pastels", "pastel", "lavender", "baby blue", "blush", "mint"},
            {"high contrast black and white", "black", "white", "monochrome", "graphic"},
            {"neutral beige and cream", "beige", "cream", "tan", "nude", "champagne"},
            {"bold reds and golds", "red", "gold", "ruby", "coral", "maroon"}
    };

    private static final String[][] STYLE_KEYWORDS = new String[][]{
            {"modern minimal", "minimal", "clean", "streamlined", "scandi"},
            {"vintage-inspired", "vintage", "retro", "nostalgic", "old school"},
            {"streetwear edge", "street", "urban", "athleisure", "edgy"},
            {"glam evening", "glam", "glitter", "sparkle", "luxury"},
            {"boho chic", "boho", "bohemian", "free spirit", "festival"},
            {"polished classic", "classic", "timeless", "tailored", "refined"}
    };

    private static final String[][] BODY_SHAPE_KEYWORDS = new String[][]{
            {"hourglass", "hourglass"},
            {"pear-shaped", "pear", "hips"},
            {"apple-shaped", "apple", "midsection"},
            {"petite", "petite"},
            {"tall", "tall", "long"},
            {"curvy", "curvy", "curves"},
            {"athletic", "athletic", "toned", "muscular"}
    };

    private static final String[][] FOCUS_KEYWORDS = new String[][]{
            {"emphasis on tailoring", "tailor", "fitted", "structured"},
            {"layering with texture", "layer", "texture", "knit", "suede"},
            {"accent pieces for polish", "accessory", "bag", "jewellery", "belt"},
            {"easy day-to-night transition", "day to night", "transition", "versatile"}
    };
}
