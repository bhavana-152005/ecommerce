#!/usr/bin/env bash
set -euo pipefail

BASE=${1:-http://localhost:8080}

echo "Running Seirraa API tests against $BASE"

echo "Health check..."
curl -sS "$BASE/api/health" | jq || true

echo "Text-only test..."
curl -sS -X POST "$BASE/api/seirraa" -H "Content-Type: application/json" -d '{"message":"brunch casual pastel outfit"}' | jq

# Image test uses an empty placeholder small base64 1x1 GIF
IMGDATA="data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
curl -sS -X POST "$BASE/api/seirraa" -H "Content-Type: application/json" -d '{"message":"casual look","imageData":"'"$IMGDATA"'","imageMimeType":"image/gif"}' | jq

echo "All tests completed."
