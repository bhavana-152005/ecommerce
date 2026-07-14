USE bellevouix_store;

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
