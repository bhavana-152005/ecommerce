# Bellevouix — Y2K Fashion Store

A full-stack e-commerce demo with an HTML/CSS/JS frontend and two interchangeable backends:

- **Java + MySQL** (`java/ECommerceProject/ApiServer.java`) — a self-contained HTTP server that serves the frontend and the `/api` endpoints. Best for local full-stack development. Falls back to in-memory demo data when MySQL is not configured.
- **Node serverless functions** (`api/`) — the same API surface for deploying on **Vercel** (which cannot run Java). Needs a cloud MySQL database for live data.

## Project structure

```
frontend/
  html/      all pages (login.html, index.html, men.html, ...)
  css/       style.css, checkout.css
  js/        browser scripts (theme.js, api.js, login.js, script.js, ...)
  images/    bellevouix-logo.png
api/         Vercel Node serverless functions (_db.js, health.js, products.js, login.js, signup.js, orders.js)
java/ECommerceProject/   Java sources + mysql-connector-j.jar
sql/         schema + seed data (bellevouix_database.sql) and query templates
vercel.json  routing so /html, /css, /js, /images and / map to frontend/
package.json Node deps (mysql2) for the serverless API
```

> Note: the frontend HTML uses paths like `../css/style.css`, so pages must be served from `frontend/html/` with sibling `css/`, `js/`, `images/` folders. Both the Java server and `vercel.json` provide exactly this mapping.

## Run locally (Java full-stack)

```bash
# from the repo root
./run_api.sh              # Linux/macOS
# or on Windows PowerShell:
# .\run_api.ps1 -MysqlUser root -MysqlPassword "your_password"
```

Then open http://localhost:8080/html/login.html

To use MySQL instead of demo data, first load the schema:

```bash
mysql -u root -p < sql/bellevouix_database.sql
```

and set `MYSQL_URL` / `MYSQL_USER` / `MYSQL_PASSWORD` (see `INTEGRATION_GUIDE.md`).

Local admin shortcut (demo mode): username `admin`, password `admin123`.

## Deploy on Vercel

Vercel serves the static frontend and runs the `api/` functions. **Java is not used on Vercel.**

1. Import the repo in Vercel (no build step needed — `vercel.json` handles routing).
2. Provision a cloud MySQL 8 database (PlanetScale, Aiven, Railway, RDS, ...) and load `sql/bellevouix_database.sql`.
3. In the Vercel project, add env vars: `MYSQL_URL` **or** `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_DATABASE`.
4. Deploy. Check `https://<project>.vercel.app/api/health` → `{"ok":true,...}`.

Without the database env vars the `/api` calls fail, but the frontend degrades gracefully to built-in demo data, so the site still loads (no more 404).
