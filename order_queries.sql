USE bellevouix_store;

-- Create order header during checkout.
INSERT INTO orders
  (order_id, user_id, customer_name, customer_email, customer_phone, payment_method, order_status, subtotal, shipping_amount, tax_amount, total_amount, estimated_delivery)
VALUES
  (?, ?, ?, ?, ?, ?, 'Processing', ?, ?, ?, ?, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY));

-- Copy active cart items into order items.
INSERT INTO order_items
  (order_id, product_id, product_name, product_category, size_label, quantity, unit_price, line_total)
SELECT
  ?,
  ci.product_id,
  p.name,
  p.category,
  ci.size_label,
  ci.quantity,
  ci.unit_price,
  ci.quantity * ci.unit_price
FROM cart_items ci
JOIN products p ON p.product_id = ci.product_id
WHERE ci.cart_id = ?;

-- Save checkout delivery address.
INSERT INTO order_addresses
  (order_id, first_name, last_name, address_line1, address_line2, city, state_name, zip_code, country)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Save payment record. For cards, store only the last four digits.
INSERT INTO payments
  (order_id, payment_method, payment_status, card_last4, card_name, amount, paid_at)
VALUES
  (?, ?, ?, ?, ?, ?, CASE WHEN ? = 'paid' THEN CURRENT_TIMESTAMP ELSE NULL END);

-- Mark cart as ordered after successful checkout.
UPDATE carts
SET status = 'ordered'
WHERE cart_id = ?;

-- Admin order list.
SELECT
  o.order_id,
  o.customer_name,
  o.ordered_at,
  COUNT(oi.order_item_id) AS item_count,
  o.total_amount,
  o.order_status
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY o.order_id
ORDER BY o.ordered_at DESC;

-- Full order details.
SELECT
  o.order_id,
  o.customer_name,
  o.customer_email,
  o.customer_phone,
  o.payment_method,
  o.order_status,
  o.subtotal,
  o.shipping_amount,
  o.tax_amount,
  o.total_amount,
  o.estimated_delivery,
  oi.product_name,
  oi.product_category,
  oi.size_label,
  oi.quantity,
  oi.unit_price,
  oi.line_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.order_id = ?;

-- Update order status from admin dashboard.
UPDATE orders
SET order_status = ?
WHERE order_id = ?;
