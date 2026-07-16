# Bellevouix E-commerce — Golden Path E2E Test Report

**PR:** #1 — `github.com/bhavana-152005/ecommerce` (branch `devin/1784196456-restructure-vercel`)
**What changed:** Flat repo reorganized into `frontend/{html,css,js,images}`, `api/`, `java/ECommerceProject/`, `sql/`. The Java `ApiServer` serves both the frontend and `/api/*` with in-memory demo data when MySQL isn't configured.
**How run:** `bash run_api.sh` from repo root → compiles Java sources, starts on `http://localhost:8080` in **memory fallback mode** (no MySQL).

## Result summary

| # | Test | Result |
|---|------|--------|
| T1 | Root redirect + styled login page (asset paths fixed) | ✅ Pass |
| T2 | User login (`sarah`/`user123`) lands on index.html | ✅ Pass |
| T3 | Home grid renders products from `/api/products` | ✅ Pass |
| T4 | Category pages (Men, Women) render styled product grids | ✅ Pass |
| T5 | Add to cart → checkout → place order → success modal | ✅ Pass |
| — | `/api/health` + `/api/products` respond | ✅ Pass |

**Overall: golden path works end-to-end.** Two issues to flag (neither blocks the golden path): a login-spec discrepancy and a cosmetic invisible-button CSS bug on category quick-view. See "Issues found".

---

## Issues found

### 1. Login spec discrepancy — arbitrary user credentials do NOT work on the running server
The task says User login works with "any username + password (demo fallback)". With the Java server **running**, the user role only succeeds for `sarah`/`user123`; arbitrary credentials return HTTP 401 "Invalid login details." and show an alert.
- The client-side "any credentials" fallback in `login.js` only fires when the API is **unreachable** (network error, no HTTP status). Because the running server returns a real 401, the fallback never triggers.
- **Impact:** The documented "any username/password" flow is misleading for the full-stack server. Working user login is `sarah`/`user123` (admin is `admin`/`admin123`). Not a code defect per se, but the instructions/expectations don't match runtime behavior.

### 2. Cosmetic bug — category quick-view "Add to Cart" button renders invisible
On category pages (e.g. `women.js`), the quick-view modal's Add-to-Cart button uses `background: var(--primary-color)` with white text, but the CSS variable defined in the stylesheet is `--primary` (not `--primary-color`). The variable is undefined, so the button renders as **white text on a transparent/white background** — effectively invisible — although it remains present and clickable.
- **Evidence:** In the quick-view modal only "Add to Wishlist" was visible; the Add to Cart button occupied the left flex slot but showed no fill/text. Clicking its location worked and added the item.
- **Impact:** Users may not see the primary Add-to-Cart button in the category quick-view. Low functional impact (clickable) but poor UX. Recommend changing `--primary-color` → `--primary` (or defining the variable).

---

## Evidence

### T1 — Styled login page loads (asset paths resolved after restructure)
Root `/` redirected to `/html/login.html`. Page is fully styled (custom fonts, gradient, card layout, colored button) and the Bellevouix logo image renders — proving `../css/style.css` and `../images/...` resolve correctly after the folder restructure.

![Styled login page](https://app.devin.ai/attachments/1e96ec08-540f-4a31-8fe2-9dceb8ba2afc/ss_4a611681.png)

### T2 + T3 — User login lands on index.html; home grid loads from /api/products
Logging in as `sarah`/`user123` (role User) navigated to `index.html`. The featured grid rendered the **six API demo product names** (Women Kurti, Floral Dress, Men Hoodie, Classic Denim Jacket, Kids T-Shirt, Luxury Handbag) — distinct from the static hardcoded names, proving the grid loaded from `/api/products`.

![Home product grid from API](https://app.devin.ai/attachments/8dc5f68d-ed35-4025-ae03-64854c7ea676/ss_e224705e.png)

Direct API verification:
```
GET /api/health → {"ok":true,"database":"memory fallback (...)"}
GET /api/products?category=all → Women Kurti, Floral Dress, Men Hoodie,
                                 Classic Denim Jacket, Kids T-Shirt, Luxury Handbag
```

### T4 — Category page renders styled product grid (Women)
Women category page loaded styled with its own product grid (Floral Maxi Dress, Summer Cotton Dress, Party Wear Gown, Silk Blouse, etc.), header/logo, hero, and category filters. Men page verified equivalently.

![Women category page](https://app.devin.ai/attachments/266d7740-9147-4497-9293-8098d96bd83d/ss_2959bfe4.png)

### T5 — Add to cart → checkout → place order

**Add to cart:** Opened quick-view for Floral Maxi Dress, selected size M, clicked Add to Cart → "Added to cart!" notification, cart count incremented to 1.

![Added to cart notification, cart count 1](https://app.devin.ai/attachments/604ba42d-f282-491c-9822-7e2a9100333f/ss_a097b265.png)

**Checkout:** Proceeded to `checkout.html`; order summary listed the item with correct pricing and computed totals — Subtotal Rs.1899, Shipping FREE, Tax Rs.342, Total Rs.2241.

![Checkout page with order summary](https://app.devin.ai/attachments/382325d1-2b13-40a0-977f-f6a488a45dca/ss_1ae8f4b8.png)

**Place order:** Filled billing form, selected Country = India and payment = Cash on Delivery, clicked Place Order → **success modal** "Order Placed Successfully!" with **Order ID `BLV1784200835440568`** and estimated delivery "Tuesday 21 July, 2026".

![Order placed successfully modal](https://app.devin.ai/attachments/518c5e1e-7735-4884-b576-3fb1484b17ef/ss_0ca8eb71.png)

**API confirmation of order endpoint:** A correctly-structured `POST /api/orders` returned **HTTP 201** `{"success":true,"orderId":"BLV-TEST-123"}`. The UI flow itself confirms 201 during the real order: `checkout.js` only shows the success modal when the API does **not** return an error status (a 400 would `alert()` and return with no modal). A malformed payload correctly returns 400, confirming validation.

---

## Environment / setup notes
- Java 17 present (`/usr/bin/java`, `/usr/bin/javac`).
- `run_api.sh` lacks the executable bit — launched with `bash run_api.sh` (not `./run_api.sh`).
- No MySQL configured → server runs in memory fallback mode (expected for this test).
- No repo environment blueprint exists; session author lacks permission to propose one.

## Out of scope / not tested
- Kids and Accessories category pages (Men + Women covered the pattern).
- Admin dashboard deep functionality (admin login itself verified via API).
- Seirraa LLM (needs API key), MySQL-backed mode, signup flow.
