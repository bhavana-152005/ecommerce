USE bellevouix_store;

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
