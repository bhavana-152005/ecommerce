USE bellevouix_store;

-- Get all active products for product listing pages.
SELECT
  p.product_id,
  p.name,
  p.brand,
  p.category,
  p.subcategory,
  p.price,
  p.original_price,
  p.discount_percent,
  p.stock_quantity,
  p.image_url,
  p.rating,
  p.rating_count,
  p.is_new
FROM products p
WHERE p.is_active = TRUE
ORDER BY p.created_at DESC;

-- Get products by category: women, men, kids, or accessories.
SELECT *
FROM products
WHERE category = ?
  AND is_active = TRUE
ORDER BY name;

-- Search products by name, brand, category, or subcategory.
SELECT *
FROM products
WHERE is_active = TRUE
  AND (
    name LIKE CONCAT('%', ?, '%')
    OR brand LIKE CONCAT('%', ?, '%')
    OR category LIKE CONCAT('%', ?, '%')
    OR subcategory LIKE CONCAT('%', ?, '%')
  )
ORDER BY name;

-- Add a product from the admin dashboard.
INSERT INTO products
  (product_id, name, brand, category, subcategory, price, original_price, discount_percent, stock_quantity, image_url, rating, rating_count, is_new)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.0, 0, ?);

-- Update stock from inventory management.
UPDATE products
SET stock_quantity = ?
WHERE product_id = ?;

-- Soft delete product so old order history remains valid.
UPDATE products
SET is_active = FALSE
WHERE product_id = ?;

-- Low-stock products for admin inventory alerts.
SELECT product_id, name, brand, category, stock_quantity
FROM products
WHERE is_active = TRUE
  AND stock_quantity < 10
ORDER BY stock_quantity ASC;
