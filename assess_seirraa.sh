#!/usr/bin/env bash
set -euo pipefail

BASE=${1:-http://localhost:8080}

PROMPTS=(
  "Brunch with friends, pastel palette, casual chic"
  "Evening date: navy dress with gold accents"
  "Office interview: polished classic, neutral tones"
  "Festival outfit: boho free-spirited layers, colorful"
)

echo "Running Seirraa assessment against $BASE"

# Ensure jq is available
if ! command -v jq >/dev/null 2>&1; then
  echo "Please install jq to run this script (brew/apt).
" >&2
  exit 1
fi

# Call backend API for each prompt
for p in "${PROMPTS[@]}"; do
  echo "\n--- Prompt: $p ---\n"
  echo "API response:"
  curl -sS -X POST "$BASE/api/seirraa" -H "Content-Type: application/json" -d "{\"message\":\"$p\"}" | jq -r '.reply'
  echo "\nStructural checks (expect these headings):"
  curl -sS -X POST "$BASE/api/seirraa" -H "Content-Type: application/json" -d "{\"message\":\"$p\"}" | jq -r '.reply' | \
    awk 'BEGIN{c=0} /Color analysis:/{print "FOUND: Color analysis:";c++} /Styling advice:/{print "FOUND: Styling advice:";c++} /What to wear/{print "FOUND: What to wear";c++} /Shopping recommendation:/{print "FOUND: Shopping recommendation:";c++} END{print "Sections found:" c "/4"}' || true
done

# Run Java-only SeirraaModel tester if javac/java available
if command -v javac >/dev/null 2>&1 && command -v java >/dev/null 2>&1; then
  echo "\nRunning local Java SeirraaModel tester..."
  (cd java/ECommerceProject && javac SeirraaModel.java SeirraaModelTester.java && java -cp . SeirraaModelTester)
else
  echo "\nSkipping Java harness: javac/java not found on PATH."
fi

echo "\nAssessment complete.\n"
