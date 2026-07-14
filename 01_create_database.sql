-- Create and select the Bellevouix database.

CREATE DATABASE IF NOT EXISTS bellevouix_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bellevouix_store;

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
