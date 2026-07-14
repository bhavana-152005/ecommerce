public class SeirraaModelTester {
    public static void main(String[] args) {
        String[] prompts = new String[] {
            "Brunch with friends, pastel palette, casual chic",
            "Evening date: navy dress with gold accents",
            "Office interview: polished classic, neutral tones",
            "Festival outfit: boho free-spirited layers, colorful"
        };

        for (String prompt : prompts) {
            System.out.println("\n=== PROMPT: " + prompt + " ===\n");
            String reply = SeirraaModel.generateReply(prompt, null, null);
            System.out.println(reply + "\n");

            int sectionsFound = 0;
            String[] checks = new String[]{"Color analysis:", "Styling advice:", "What to wear", "Shopping recommendation:"};
            for (String c : checks) {
                if (reply.contains(c)) {
                    System.out.println("FOUND: " + c);
                    sectionsFound++;
                } else {
                    System.out.println("MISSING: " + c);
                }
            }
            System.out.println("Sections found: " + sectionsFound + "/" + checks.length);
            System.out.println("Reply length: " + reply.length() + " chars");
        }
    }
}
