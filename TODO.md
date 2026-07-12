# TODO - Bellevouix Frontend Fixes

## Done
- ✅ Fix quick-view size selector (add `data-size`, track `quickViewSelectedSize`, visually toggle active size)
- ✅ Make cart items size-aware (`selectedSize` stored on cart line items)
- ✅ Make cart quantity/remove size-aware (match by `productId + selectedSize`)
- ✅ Prevent cart/wishlist leakage by switching from `localStorage` → `sessionStorage` for:
  - `frontend/js/script.js` (home/all page)
  - `frontend/js/men.js`, `frontend/js/women.js`, `frontend/js/kids.js` (sector pages) *(as per earlier applied changes)*
  - `frontend/js/accessories.js`

## Next
- [ ] Expand diverse clothing product catalog for every gender in:
  - `frontend/js/script.js`
  - `frontend/js/men.js`
  - `frontend/js/women.js`
  - `frontend/js/kids.js`
- [ ] Ensure every new product has a consistent `sizes` array
- [ ] Verify size filtering uses `data-size` buttons correctly across all pages
- [ ] Re-check sorting accuracy after catalog expansion:
  - `price-low` (low→high)
  - `price-high` (high→low)
  - `new` / `popular` (as implemented in each JS file)

## Notes
- UI sorting dropdown values already match existing JS sort keys in HTML (`price-low`, `price-high`, `new`, `default`).
- Current implementation is frontend-demo-array driven; backend/Java/SQL not modified for product diversity.
