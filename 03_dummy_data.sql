USE bellevouix_store;

-- Practical seed data for testing orders, payments, uploaded media, and admin activity.

INSERT INTO orders
  (order_id, user_id, customer_name, customer_email, customer_phone, payment_method, order_status, subtotal, shipping_amount, tax_amount, total_amount, estimated_delivery, ordered_at)
VALUES
  ('BLV12345', 2, 'Sarah Johnson', 'sarah@example.com', '+91 98765 43210', 'cod', 'Processing', 3897.00, 0.00, 701.00, 4598.00, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '2024-04-05 10:30:00'),
  ('BLV12346', 3, 'Mike Chen', 'mike@example.com', '+91 98765 43211', 'card', 'Delivered', 2998.00, 0.00, 540.00, 3538.00, '2024-04-11', '2024-04-06 14:15:00');

INSERT INTO order_items
  (order_id, product_id, product_name, product_category, size_label, quantity, unit_price, line_total)
VALUES
  ('BLV12345', 102, 'Floral Dress', 'women', 'M', 1, 2299.00, 2299.00),
  ('BLV12345', 1001, 'Classic Cotton T-Shirt', 'men', 'L', 2, 799.00, 1598.00),
  ('BLV12346', 202, 'Classic Denim Jacket', 'men', 'L', 1, 2499.00, 2499.00),
  ('BLV12346', 4001, 'Phone Case - Pink', 'accessories', 'Free Size', 1, 499.00, 499.00);

INSERT INTO order_addresses
  (order_id, first_name, last_name, address_line1, address_line2, city, state_name, zip_code, country)
VALUES
  ('BLV12345', 'Sarah', 'Johnson', '12 MG Road', 'Apartment 4B', 'Bengaluru', 'Karnataka', '560001', 'India'),
  ('BLV12346', 'Mike', 'Chen', '45 Park Street', NULL, 'Mumbai', 'Maharashtra', '400001', 'India');

INSERT INTO payments
  (order_id, payment_method, payment_status, card_last4, card_name, amount, paid_at)
VALUES
  ('BLV12345', 'cod', 'pending', NULL, NULL, 4598.00, NULL),
  ('BLV12346', 'card', 'paid', '1234', 'Mike Chen', 3538.00, '2024-04-06 14:16:00');

INSERT INTO media_assets
  (file_name, asset_url, category, is_featured, uploaded_by)
VALUES
  ('bellevouix-logo.png', 'frontend/images/bellevouix-logo.png', 'featured', TRUE, 1),
  ('floral-dress.jpg', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 'women', TRUE, 1),
  ('denim-jacket.jpg', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', 'men', FALSE, 1);

INSERT INTO admin_activity
  (admin_user_id, activity_type, description)
VALUES
  (1, 'order_created', 'New order BLV12345 was placed'),
  (1, 'user_registered', 'Sarah Johnson joined Bellevouix'),
  (1, 'stock_updated', 'Floral Dress stock updated'),
  (1, 'user_verified', 'Mike Chen profile verified');
