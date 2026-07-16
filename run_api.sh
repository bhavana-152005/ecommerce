#!/usr/bin/env bash
# Compile and run the Bellevouix Java API (serves the frontend + /api endpoints).
# Usage: ./run_api.sh [port]
#   MYSQL_URL / MYSQL_USER / MYSQL_PASSWORD env vars enable the MySQL backend.
#   Without them (or without the connector jar) the API uses in-memory demo data.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/java/ECommerceProject"
CONNECTOR_JAR="$PROJECT_DIR/mysql-connector-j.jar"
PORT="${1:-8080}"

cd "$PROJECT_DIR"
echo "Compiling Java sources..."
javac *.java

export PORT
CLASSPATH=".:$CONNECTOR_JAR"
echo "Starting Bellevouix API on http://localhost:$PORT"
echo "Open http://localhost:$PORT/html/login.html"
exec java -cp "$CLASSPATH" ApiServer
