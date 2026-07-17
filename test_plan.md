# Test Plan — Bellevouix Repo Restructure (PR #1)

## Context / What changed
Flat repo reorganized into `frontend/{html,css,js,images}`, `api/`, `java/ECommerceProject/`, `sql/`. The Java `ApiServer` serves the frontend AND `/api/*` with in-memory demo data when MySQL isn't configured. The restructure's main risk is broken relative asset paths (`../css`, `../images`, `../js`) and the API base resolution. Server started via `bash run_api.sh` on http://localhost:8080 (confirmed running in demo/memory fallback mode).

## Pre-verified via curl (setup evidence, not part of recording)
- `/api/health` → `{"ok":true,"database":"memory fallback (...)"}`
- `/api/products` → returns demo products array (Women Kurti, Floral Dress, Men Hoodie, etc.)
- `/api/login` admin/admin123 role=admin → success; sarah/user123 role=user → success; arbitrary user → 401 "Invalid login details."

## Known discrepancy to flag (not a blocker)
Task says User login works with "any username + password (demo fallback)". Code (ApiServer.java:503, login.js:21) shows: with the Java server RUNNING, user role only succeeds for `sarah/user123`; arbitrary creds get a 401 and an alert (the client-side fallback only fires when the API is unreachable). So on the full-stack server, the working user login is `sarah/user123`. Will use that.

## Test Cases (browser, recorded)

### T1 — Styled login page loads (asset paths fixed)
- Navigate to http://localhost:8080/ → expect 302 redirect to /html/login.html.
- PASS if: page is visibly styled (custom fonts, card layout, colored button — NOT raw unstyled HTML) AND the Bellevouix logo image renders (not a broken-image icon). This proves `../css/style.css` and `../images/bellevouix-logo.png` resolve.
- FAIL if: page is unstyled black-on-white text or logo is a broken image.

### T2 — User login lands on index.html
- Select role = User, enter username `sarah`, password `user123`, click Login.
- PASS if: URL becomes `.../html/index.html` and home page renders with header/logo.
- FAIL if: alert appears or stays on login page.

### T3 — Home product grid renders from /api/products
- On index.html, observe the featured product grid.
- PASS if: product cards render with names matching the API demo data (e.g. "Women Kurti", "Floral Dress", "Men Hoodie", "Classic Denim Jacket", "Kids T-Shirt", "Luxury Handbag") — these are the API fallback names, distinct from the static hardcoded names, proving the grid loaded from /api/products. Product count text should show 6 products.
- FAIL if: grid empty, "No products found", or shows only the static names (Classic Cotton T-Shirt etc.) which would mean the API fetch failed.
- Evidence: also confirm via browser Network/console that GET /api/products returned 200.

### T4 — Category page renders products (Men)
- Click "Men" nav link → men.html.
- PASS if: page is styled and product grid shows men's products (e.g. "Classic Cotton T-Shirt", "Denim Jacket", "Slim Fit Jeans") with prices. (Category pages use their own hardcoded arrays, so this proves the restructured page + its JS/CSS load correctly.)
- FAIL if: unstyled, empty grid, or JS error prevents render.
- Spot-check one more category (Women) to confirm the pattern.

### T5 — Add to cart → checkout → place order → confirmation
- On a product card, click "Select Size" → quick-view modal opens. Select a size (e.g. M). Click "Add to Cart". Expect "Added to cart!" notification and cart count increments to 1.
- Open cart sidebar → click "Proceed to Checkout" → checkout.html.
- PASS (checkout load) if: order summary lists the added item with correct price, and subtotal/shipping/tax/total computed.
- Fill shipping form (firstName, lastName, email, phone, address, city, state, zipCode, country), keep payment = Cash on Delivery, click "Place Order".
- PASS (order) if: success modal appears showing an Order ID (format `BLV...`) and an estimated delivery date. Confirm via Network that POST /api/orders returned 201 with an orderId.
- FAIL if: validation blocks a fully-filled valid form, no success modal, or POST /api/orders errors.

## Out of scope
Admin dashboard deep functionality, Seirraa LLM (needs API key), MySQL-backed mode, signup. Admin login success itself already verified via curl; may quickly show admin.html loads as a bonus/regression but primary flow is the user golden path.
