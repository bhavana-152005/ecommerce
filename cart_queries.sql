USE bellevouix_store;

-- Create an active cart for a user.
INSERT INTO carts (user_id, status)
VALUES (?, 'active');

-- Get the active cart for a user.
SELECT cart_id, user_id, status, created_at, updated_at
FROM carts
WHERE user_id = ?
  AND status = 'active'
ORDER BY updated_at DESC
LIMIT 1;

-- Add an item to cart. Use 'Free Size' when the product has no size choice.
INSERT INTO cart_items (cart_id, product_id, size_label, quantity, unit_price)
VALUES (?, ?, COALESCE(NULLIF(?, ''), 'Free Size'), ?, ?)
ON DUPLICATE KEY UPDATE
  quantity = quantity + VALUES(quantity),
  unit_price = VALUES(unit_price);

-- View cart with product details.
SELECT
  ci.cart_item_id,
  ci.product_id,
  p.name,
  p.category,
  p.image_url,
  ci.size_label,
  ci.quantity,
  ci.unit_price,
  (ci.quantity * ci.unit_price) AS line_total
FROM cart_items ci
JOIN products p ON p.product_id = ci.product_id
WHERE ci.cart_id = ?
ORDER BY ci.added_at;

-- Update cart item quantity.
UPDATE cart_items
SET quantity = ?
WHERE cart_item_id = ?
  AND cart_id = ?;

-- Remove one item from cart.
DELETE FROM cart_items
WHERE cart_item_id = ?
  AND cart_id = ?;

-- Clear all items from cart after checkout or logout.
DELETE FROM cart_items
WHERE cart_id = ?;

-- Calculate checkout totals. Shipping is free above Rs. 999 and GST is 18%.
SELECT
  subtotal,
  CASE WHEN subtotal > 999 THEN 0 ELSE 99 END AS shipping_amount,
  ROUND(subtotal * 0.18, 0) AS tax_amount,
  subtotal + CASE WHEN subtotal > 999 THEN 0 ELSE 99 END + ROUND(subtotal * 0.18, 0) AS total_amount
FROM (
  SELECT COALESCE(SUM(quantity * unit_price), 0) AS subtotal
  FROM cart_items
  WHERE cart_id = ?
) cart_total;
