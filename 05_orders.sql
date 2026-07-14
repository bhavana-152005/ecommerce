USE bellevouix_store;

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
