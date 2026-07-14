USE bellevouix_store;

INSERT INTO reviews
  (user_id, product_id, order_id, rating, title, comment, review_image_url, status)
VALUES
  (2, 102, 'BLV12345', 5, 'Beautiful dress', 'The fabric feels soft and the fit is exactly as expected.', NULL, 'visible'),
  (2, 1001, 'BLV12345', 4, 'Good everyday t-shirt', 'Comfortable cotton and worth the price.', NULL, 'visible'),
  (3, 202, 'BLV12346', 5, 'Loved the jacket', 'Looks stylish and the quality feels premium.', NULL, 'visible'),
  (3, 4001, 'BLV12346', 4, 'Nice phone case', 'Color is cute and the case protects well.', NULL, 'visible');
