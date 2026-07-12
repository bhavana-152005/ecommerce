# Bellevouix Full-Stack App

This project combines:
- a Java HTTP backend in java/ECommerceProject,
- a MySQL schema in sql/bellevouix_database.sql,
- a frontend in frontend/.

## Run locally

1. Start MySQL server.
2. Run the SQL script:
   mysql -u root -p < sql/bellevouix_database.sql
3. Start the Java API. Use one of these options:
    - With OpenAI:
       powershell -ExecutionPolicy Bypass -File .\run_api.ps1 -ConnectorJar .\lib\mysql-connector-j.jar -MysqlUser root -MysqlPassword "your_password" -RequireDatabase -OpenAiApiKey "your_openai_api_key" -LlmProvider openai
    - With Gemini:
       powershell -ExecutionPolicy Bypass -File .\run_api.ps1 -ConnectorJar .\lib\mysql-connector-j.jar -MysqlUser root -MysqlPassword "your_password" -RequireDatabase -GeminiApiKey "your_gemini_api_key" -LlmProvider gemini
    - With local built-in Seirraa mode (no external API key required):
       powershell -ExecutionPolicy Bypass -File .\run_api.ps1 -ConnectorJar .\lib\mysql-connector-j.jar -MysqlUser root -MysqlPassword "your_password" -RequireDatabase -LlmProvider local
    - Or using the bundled helper script:
       powershell -ExecutionPolicy Bypass -File .\start_seirraa.ps1 -LlmProvider local
4. Open http://localhost:8080/html/login.html

## Seirraa AI

Seirraa now calls the backend endpoint `/api/seirraa`.

- If `SEIRRAA_LLM_PROVIDER` is set to `openai` or `gemini`, the backend forwards requests to that provider using the configured API key.
- If `SEIRRAA_LLM_PROVIDER` is set to `local`, or if no provider key is available, the backend uses the built-in Seirraa model in `java/ECommerceProject/SeirraaModel.java`.

That means Seirraa is available even without a paid LLM key, while still supporting richer OpenAI/Gemini responses when configured.

## Deploy frontend to Vercel from GitHub

This repo already contains a Vercel configuration (`vercel.json`) that serves files from `frontend/`.

To enable automatic deploys from GitHub to Vercel:

1. Create a Vercel project (https://vercel.com/new) and connect it to this GitHub repository, or create a project manually and note the `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID`.
2. In your GitHub repository, go to Settings → Secrets and Variables → Actions and add the following secrets:
   - `VERCEL_TOKEN` — a Personal Token (from Vercel Account Settings)
   - `VERCEL_ORG_ID` — optional but recommended (from the Vercel project settings)
   - `VERCEL_PROJECT_ID` — optional but recommended (from the Vercel project settings)
3. On push to `main` (or `master`), the GitHub Action at `.github/workflows/deploy-frontend-vercel.yml` will run and deploy `frontend/` to Vercel.

If you prefer, you can also use Vercel's native GitHub integration (recommended): connect your repo at https://vercel.com, which will automatically build and deploy the `frontend/` directory on every push.

Once deployed, use the Vercel project URL on your resume so visitors load the live frontend directly.

## Docker & GitHub Container Registry (CI)

This repository includes a `Dockerfile`, `docker-compose.yml`, and a GitHub Actions workflow `.github/workflows/build-and-push.yml` that:

- builds a Docker image for the Java API,
- pushes the image to GitHub Container Registry (`ghcr.io/<your-org>/myntra`),
- runs a brief smoke test using the built-in `SeirraaModel`.

To use locally:

Build and run with Compose:

```bash
docker compose build
docker compose up
```

To run the image without DB (in-memory fallback):

```bash
docker build -t bellevouix:local .
docker run -p 8080:8080 -e MYSQL_REQUIRED=false -e SEIRRAA_LLM_PROVIDER=local bellevouix:local
```

To enable the GitHub Actions workflow to push to GHCR, ensure the repository has `GITHUB_TOKEN` with `packages: write` permissions (default for repo workflows) — no additional secret is required for GHCR.

