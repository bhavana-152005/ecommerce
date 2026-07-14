USE bellevouix_store;

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
