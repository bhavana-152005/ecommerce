-- ============================================================
-- Bellevouix E-Commerce Database
-- ============================================================
-- MySQL 8.x compatible.
--
-- What this file does:
--   1. Creates the database.
--   2. Removes old tables so you can run it again while testing.
--   3. Creates clean tables for Java, HTML, CSS, JS integration.
--   4. Adds starter users, products, orders, reviews, and admin data.
--   5. Creates useful views for dashboard and low-stock screens.
--
-- Run from the project root:
--   mysql -u root -p < sql/bellevouix_database.sql
--
-- Demo login data:
--   Admin: username = admin, password = admin123
--   User:  username = sarah, password = user123
-- ============================================================

CREATE DATABASE IF NOT EXISTS bellevouix_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bellevouix_store;

-- While rebuilding the database, foreign key checks are disabled so
-- tables can be dropped in a predictable order.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS admin_activity;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_addresses;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS product_sizes;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- USERS
-- Stores customer/admin accounts.
-- Java will use this table for signup, login, and admin checks.
-- Passwords are stored as SHA-256 hashes for this student project.
-- ============================================================
CREATE TABLE users (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL,
  full_name VARCHAR(120),
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(25),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  verification_status ENUM('pending', 'verified', 'flagged') NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_verification_status (verification_status)
);

-- ============================================================
-- PRODUCTS
-- Stores everything displayed on women/men/kids/accessories pages.
-- product_sizes is separate because one product can have many sizes.
-- ============================================================
CREATE TABLE products (
  product_id BIGINT UNSIGNED PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(100) NOT NULL DEFAULT 'Bellevouix',
  category ENUM('women', 'men', 'kids', 'accessories') NOT NULL,
  subcategory VARCHAR(80),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percent INT UNSIGNED DEFAULT 0,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  image_url VARCHAR(600),
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  rating_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_products_price CHECK (price > 0),
  CONSTRAINT chk_products_original_price CHECK (original_price IS NULL OR original_price >= price),
  KEY idx_products_category (category),
  KEY idx_products_subcategory (subcategory),
  KEY idx_products_stock_quantity (stock_quantity),
  KEY idx_products_active (is_active)
);

CREATE TABLE product_sizes (
  product_id BIGINT UNSIGNED NOT NULL,
  size_label VARCHAR(20) NOT NULL,
  PRIMARY KEY (product_id, size_label),
  CONSTRAINT fk_product_sizes_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- ============================================================
-- CARTS
-- Each active cart belongs to one user.
-- cart_items stores the products currently selected before checkout.
-- ============================================================
CREATE TABLE carts (
  cart_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('active', 'ordered', 'abandoned') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KEY idx_carts_user_status (user_id, status)
);

CREATE TABLE cart_items (
  cart_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  size_label VARCHAR(20) NOT NULL DEFAULT 'Free Size',
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0),
  CONSTRAINT chk_cart_items_unit_price CHECK (unit_price > 0),
  UNIQUE KEY uq_cart_product_size (cart_id, product_id, size_label)
);

-- ============================================================
-- ORDERS
-- Once checkout is completed, cart data is copied into orders and
-- order_items. Product name/price are saved again so order history
-- remains correct even if product prices change later.
-- ============================================================
CREATE TABLE orders (
  order_id VARCHAR(40) PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(25) NOT NULL,
  payment_method ENUM('card', 'cod') NOT NULL,
  order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Processing',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  estimated_delivery DATE,
  ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_orders_amounts CHECK (
    subtotal >= 0 AND shipping_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0
  ),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (order_status),
  KEY idx_orders_ordered_at (ordered_at)
);

CREATE TABLE order_items (
  order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  product_id BIGINT UNSIGNED,
  product_name VARCHAR(150) NOT NULL,
  product_category VARCHAR(40) NOT NULL,
  size_label VARCHAR(20) NOT NULL DEFAULT 'Free Size',
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
  CONSTRAINT chk_order_items_amounts CHECK (unit_price > 0 AND line_total >= unit_price),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id)
);

-- ============================================================
-- REVIEWS
-- Users can review a product once. Admin can hide reviews if needed.
-- ============================================================
CREATE TABLE reviews (
  review_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  order_id VARCHAR(40),
  rating TINYINT UNSIGNED NOT NULL,
  title VARCHAR(120),
  comment TEXT,
  review_image_url TEXT,
  status ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY uq_reviews_user_product (user_id, product_id),
  KEY idx_reviews_product_status (product_id, status),
  KEY idx_reviews_rating (rating)
);

-- ============================================================
-- ADDRESS, PAYMENT, MEDIA, ADMIN ACTIVITY
-- These support checkout, admin dashboard, and uploaded/displayed media.
-- ============================================================
CREATE TABLE order_addresses (
  address_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  zip_code VARCHAR(12) NOT NULL,
  country VARCHAR(100) NOT NULL,
  CONSTRAINT fk_order_addresses_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE KEY uq_order_addresses_order (order_id)
);

CREATE TABLE payments (
  payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  payment_method ENUM('card', 'cod') NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  card_last4 CHAR(4),
  card_name VARCHAR(120),
  amount DECIMAL(10,2) NOT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT chk_payments_amount CHECK (amount > 0),
  UNIQUE KEY uq_payments_order (order_id),
  KEY idx_payments_status (payment_status)
);

CREATE TABLE media_assets (
  asset_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  asset_url TEXT NOT NULL,
  category ENUM('featured', 'men', 'women', 'kids', 'accessories', 'other') NOT NULL DEFAULT 'other',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_by BIGINT UNSIGNED,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_assets_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  KEY idx_media_assets_category (category),
  KEY idx_media_assets_featured (is_featured)
);

CREATE TABLE admin_activity (
  activity_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id BIGINT UNSIGNED,
  activity_type VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_activity_user
    FOREIGN KEY (admin_user_id) REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  KEY idx_admin_activity_created_at (created_at)
);

-- ============================================================
-- STARTER DATA
-- These rows make the app usable immediately after running the script.
-- Replace or expand these as your frontend product cards grow.
-- ============================================================
INSERT INTO users
  (username, full_name, email, phone, password_hash, role, verification_status)
VALUES
  ('admin', 'Bellevouix Admin', 'admin@bellevouix.com', '+91 98765 43200', SHA2('admin123', 256), 'admin', 'verified'),
  ('sarah', 'Sarah Johnson', 'sarah@example.com', '+91 98765 43210', SHA2('user123', 256), 'user', 'pending'),
  ('mike', 'Mike Chen', 'mike@example.com', '+91 98765 43211', SHA2('user123', 256), 'user', 'verified'),
  ('emily', 'Emily Davis', 'emily@example.com', '+91 98765 43212', SHA2('user123', 256), 'user', 'flagged');

INSERT INTO products
  (product_id, name, brand, category, subcategory, price, original_price, discount_percent, stock_quantity, image_url, rating, rating_count, is_new)
VALUES
  (101, 'Women Kurti', 'Bellevouix', 'women', 'kurtis', 1499.00, 1999.00, 25, 35, 'frontend/images/bellevouix-logo.png', 4.4, 120, TRUE),
  (102, 'Floral Dress', 'Bellevouix', 'women', 'dresses', 2299.00, 2999.00, 23, 28, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 4.7, 342, TRUE),
  (201, 'Men Hoodie', 'Bellevouix', 'men', 'hoodies', 1899.00, 2499.00, 24, 42, 'frontend/images/bellevouix-logo.png', 4.5, 155, FALSE),
  (202, 'Classic Denim Jacket', 'UrbanStyle', 'men', 'jackets', 2799.00, 3999.00, 30, 30, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', 4.6, 189, FALSE),
  (301, 'Kids T-Shirt', 'KiddoWear', 'kids', 'tshirts', 699.00, 999.00, 30, 60, 'https://images.unsplash.com/photo-1503919436084-b69c2f762761?w=400&h=500&fit=crop', 4.7, 324, TRUE),
  (302, 'Kids Sneakers', 'KiddoWear', 'kids', 'shoes', 1299.00, 1799.00, 28, 25, 'frontend/images/bellevouix-logo.png', 4.3, 98, FALSE),
  (401, 'Luxury Handbag', 'Bellevouix', 'accessories', 'bags', 3499.00, 4999.00, 30, 18, 'frontend/images/bellevouix-logo.png', 4.8, 210, TRUE),
  (402, 'Sneakers', 'Bellevouix', 'accessories', 'shoes', 2499.00, 3299.00, 24, 22, 'frontend/images/bellevouix-logo.png', 4.4, 140, FALSE),
  (403, 'Watches', 'Bellevouix', 'accessories', 'watches', 1999.00, 2999.00, 33, 16, 'frontend/images/bellevouix-logo.png', 4.5, 176, FALSE),
  (1001, 'Classic Cotton T-Shirt', 'Bellevouix', 'men', 'tshirts', 799.00, 1299.00, 38, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 4.5, 245, TRUE),
  (2001, 'Floral Maxi Dress', 'Bellevouix', 'women', 'dresses', 1899.00, 2999.00, 37, 40, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 4.7, 342, TRUE),
  (3001, 'Kids Cartoon T-Shirt', 'KiddoWear', 'kids', 'tshirts', 499.00, 799.00, 38, 60, 'https://images.unsplash.com/photo-1503919436084-b69c2f762761?w=400&h=500&fit=crop', 4.7, 324, TRUE),
  (4001, 'Phone Case - Pink', 'TechStyle', 'accessories', 'phone-cases', 299.00, 499.00, 40, 100, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=500&fit=crop', 4.6, 456, TRUE);

INSERT INTO product_sizes (product_id, size_label)
VALUES
  (101, 'S'), (101, 'M'), (101, 'L'), (101, 'XL'),
  (102, 'S'), (102, 'M'), (102, 'L'), (102, 'XL'),
  (201, 'M'), (201, 'L'), (201, 'XL'),
  (202, 'M'), (202, 'L'), (202, 'XL'),
  (301, 'S'), (301, 'M'), (301, 'L'),
  (302, '1'), (302, '2'), (302, '3'),
  (402, '6'), (402, '7'), (402, '8'), (402, '9'),
  (1001, 'S'), (1001, 'M'), (1001, 'L'), (1001, 'XL'),
  (2001, 'S'), (2001, 'M'), (2001, 'L'), (2001, 'XL'),
  (3001, 'S'), (3001, 'M'), (3001, 'L');

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

INSERT INTO reviews
  (user_id, product_id, order_id, rating, title, comment, review_image_url, status)
VALUES
  (2, 102, 'BLV12345', 5, 'Beautiful dress', 'The fabric feels soft and the fit is exactly as expected.', NULL, 'visible'),
  (2, 1001, 'BLV12345', 4, 'Good everyday t-shirt', 'Comfortable cotton and worth the price.', NULL, 'visible'),
  (3, 202, 'BLV12346', 5, 'Loved the jacket', 'Looks stylish and the quality feels premium.', NULL, 'visible'),
  (3, 4001, 'BLV12346', 4, 'Nice phone case', 'Color is cute and the case protects well.', NULL, 'visible');

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

-- ============================================================
-- DASHBOARD VIEWS
-- Views behave like saved SELECT queries. Java/admin pages can query
-- them directly instead of repeating dashboard calculations everywhere.
-- ============================================================
CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS total_products,
  (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_status <> 'Cancelled') AS total_revenue;

CREATE OR REPLACE VIEW low_stock_products AS
SELECT
  product_id,
  name,
  brand,
  category,
  stock_quantity
FROM products
WHERE is_active = TRUE
  AND stock_quantity < 10;

-- ============================================================
-- QUICK CHECKS
-- If these SELECTs return numbers, the database loaded successfully.
-- ============================================================
SELECT 'Bellevouix database is ready' AS setup_status;

SELECT
  (SELECT COUNT(*) FROM users) AS users_loaded,
  (SELECT COUNT(*) FROM products) AS products_loaded,
  (SELECT COUNT(*) FROM orders) AS orders_loaded,
  (SELECT COUNT(*) FROM reviews) AS reviews_loaded;
