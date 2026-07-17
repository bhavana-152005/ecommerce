USE bellevouix_store;

-- =========================================================
-- TESTING QUERIES
-- These queries use real sample data from the insert files.
-- Use this file for manual testing in MySQL.
-- Backend files should still use ? placeholders.
-- =========================================================

-- 1. LOGIN TEST
-- Sample user: sarah / user123
SELECT
  user_id,
  username,
  full_name,
  email,
  role,
  verification_status
FROM users
WHERE username = 'sarah'
  AND password_hash = SHA2('user123', 256)
  AND is_active = TRUE;

-- Admin login test: admin / admin123
SELECT
  user_id,
  username,
  full_name,
  email,
  role,
  verification_status
FROM users
WHERE username = 'admin'
  AND password_hash = SHA2('admin123', 256)
  AND is_active = TRUE;

-- 2. ADD TO CART TEST
-- Create an active cart for Sarah if she does not already have one.
INSERT INTO carts (user_id, status)
SELECT 2, 'active'
WHERE NOT EXISTS (
  SELECT 1
  FROM carts
  WHERE user_id = 2
    AND status = 'active'
);

-- Store Sarah's active cart id in a variable.
SET @cart_id = (
  SELECT cart_id
  FROM carts
  WHERE user_id = 2
    AND status = 'active'
  ORDER BY updated_at DESC
  LIMIT 1
);

-- Add Floral Dress to Sarah's cart.
INSERT INTO cart_items (cart_id, product_id, size_label, quantity, unit_price)
VALUES (@cart_id, 102, 'M', 1, 2299.00)
ON DUPLICATE KEY UPDATE
  quantity = quantity + VALUES(quantity),
  unit_price = VALUES(unit_price);

-- Add Classic Cotton T-Shirt to Sarah's cart.
INSERT INTO cart_items (cart_id, product_id, size_label, quantity, unit_price)
VALUES (@cart_id, 1001, 'L', 2, 799.00)
ON DUPLICATE KEY UPDATE
  quantity = quantity + VALUES(quantity),
  unit_price = VALUES(unit_price);

-- View Sarah's cart.
SELECT
  ci.cart_item_id,
  p.name,
  p.category,
  ci.size_label,
  ci.quantity,
  ci.unit_price,
  ci.quantity * ci.unit_price AS line_total
FROM cart_items ci
JOIN products p ON p.product_id = ci.product_id
WHERE ci.cart_id = @cart_id;

-- Calculate cart total with shipping and GST.
SELECT
  subtotal,
  CASE WHEN subtotal > 999 THEN 0 ELSE 99 END AS shipping_amount,
  ROUND(subtotal * 0.18, 0) AS tax_amount,
  subtotal + CASE WHEN subtotal > 999 THEN 0 ELSE 99 END + ROUND(subtotal * 0.18, 0) AS total_amount
FROM (
  SELECT COALESCE(SUM(quantity * unit_price), 0) AS subtotal
  FROM cart_items
  WHERE cart_id = @cart_id
) cart_total;

-- 3. CHECKOUT TEST
-- Create calculated checkout values.
SET @subtotal = (
  SELECT COALESCE(SUM(quantity * unit_price), 0)
  FROM cart_items
  WHERE cart_id = @cart_id
);

SET @shipping = CASE WHEN @subtotal > 999 THEN 0 ELSE 99 END;
SET @tax = ROUND(@subtotal * 0.18, 0);
SET @total = @subtotal + @shipping + @tax;
SET @order_id = CONCAT('BLVTEST', UNIX_TIMESTAMP());

-- Create order.
INSERT INTO orders
  (order_id, user_id, customer_name, customer_email, customer_phone, payment_method, order_status, subtotal, shipping_amount, tax_amount, total_amount, estimated_delivery)
VALUES
  (@order_id, 2, 'Sarah Johnson', 'sarah@example.com', '+91 98765 43210', 'cod', 'Processing', @subtotal, @shipping, @tax, @total, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY));

-- Copy cart items into order items.
INSERT INTO order_items
  (order_id, product_id, product_name, product_category, size_label, quantity, unit_price, line_total)
SELECT
  @order_id,
  ci.product_id,
  p.name,
  p.category,
  ci.size_label,
  ci.quantity,
  ci.unit_price,
  ci.quantity * ci.unit_price
FROM cart_items ci
JOIN products p ON p.product_id = ci.product_id
WHERE ci.cart_id = @cart_id;

-- Save delivery address.
INSERT INTO order_addresses
  (order_id, first_name, last_name, address_line1, address_line2, city, state_name, zip_code, country)
VALUES
  (@order_id, 'Sarah', 'Johnson', '12 MG Road', 'Apartment 4B', 'Bengaluru', 'Karnataka', '560001', 'India');

-- Save payment record for cash on delivery.
INSERT INTO payments
  (order_id, payment_method, payment_status, amount)
VALUES
  (@order_id, 'cod', 'pending', @total);

-- Mark cart as ordered.
UPDATE carts
SET status = 'ordered'
WHERE cart_id = @cart_id;

-- Show final order summary.
SELECT
  o.order_id,
  o.customer_name,
  o.payment_method,
  o.order_status,
  o.subtotal,
  o.shipping_amount,
  o.tax_amount,
  o.total_amount,
  o.estimated_delivery
FROM orders o
WHERE o.order_id = @order_id;

-- Show products inside the test order.
SELECT
  product_name,
  product_category,
  size_label,
  quantity,
  unit_price,
  line_total
FROM order_items
WHERE order_id = @order_id;
