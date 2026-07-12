# Bellevouix Vercel Deployment

## Preview Locally First

Your current Java preview is:

```text
http://localhost:8080/html/login.html
```

If you want the Vercel-style local preview, install dependencies and run:

```powershell
npm install
npm run start
```

Then open the URL printed by Vercel CLI, usually:

```text
http://localhost:3000
```

## What Vercel Runs

Vercel will serve the existing frontend files from:

```text
frontend/html
frontend/css
frontend/js
frontend/images
```

The API routes are in:

```text
api/
```

Current serverless endpoints:

```text
GET  /api/health
GET  /api/products?category=all
POST /api/login
POST /api/signup
POST /api/orders
```

## Database Requirement

Vercel cannot connect to a MySQL server running only on your computer. Use a cloud MySQL database, for example:

```text
PlanetScale, Aiven, Railway, Clever Cloud, AWS RDS, Azure MySQL, or any hosted MySQL 8 database
```

Load this SQL file into that cloud database:

```text
sql/bellevouix_database.sql
```

## Vercel Environment Variables

In Vercel project settings, add either one connection URL:

```text
MYSQL_URL=mysql://USER:PASSWORD@HOST:3306/bellevouix_store
```

Or add separate values:

```text
MYSQL_HOST=your-cloud-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=bellevouix_store
```

After deployment, check:

```text
https://your-project.vercel.app/api/health
```

It should return:

```json
{"ok":true,"database":"mysql connected"}
```

## Deploy

From the project root:

```powershell
npm install
npx vercel
```

For production:

```powershell
npx vercel --prod
```
