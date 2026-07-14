USE bellevouix_store;

-- Add a review after the customer has bought the product.
-- review_image_url is optional; pass NULL when the customer does not upload a photo.
INSERT INTO reviews
  (user_id, product_id, order_id, rating, title, comment, review_image_url)
VALUES
  (?, ?, ?, ?, ?, ?, ?);

-- Show all visible reviews for one product.
SELECT
  r.review_id,
  p.name AS product_name,
  u.full_name AS customer_name,
  r.rating,
  r.title,
  r.comment,
  r.review_image_url,
  r.created_at
FROM reviews r
JOIN products p ON p.product_id = r.product_id
JOIN users u ON u.user_id = r.user_id
WHERE r.product_id = ?
  AND r.status = 'visible'
ORDER BY r.created_at DESC;

-- Question: which products are customers happiest with?
SELECT
  p.product_id,
  p.name,
  p.category,
  ROUND(AVG(r.rating), 1) AS average_rating,
  COUNT(r.review_id) AS total_reviews
FROM products p
JOIN reviews r ON r.product_id = p.product_id
WHERE r.status = 'visible'
GROUP BY p.product_id, p.name, p.category
ORDER BY average_rating DESC, total_reviews DESC;

-- Question: what did customers say about a product?
SELECT
  p.name AS product_name,
  r.rating,
  r.title,
  r.comment,
  r.review_image_url
FROM reviews r
JOIN products p ON p.product_id = r.product_id
WHERE p.name LIKE CONCAT('%', ?, '%')
  AND r.status = 'visible'
ORDER BY r.rating DESC;

-- Question: which reviews has this customer written?
SELECT
  r.review_id,
  p.name AS product_name,
  r.rating,
  r.title,
  r.comment,
  r.review_image_url,
  r.created_at
FROM reviews r
JOIN products p ON p.product_id = r.product_id
WHERE r.user_id = ?
ORDER BY r.created_at DESC;

-- Question: which reviews need an admin to look at them?
SELECT
  r.review_id,
  p.name AS product_name,
  u.full_name AS customer_name,
  r.rating,
  r.title,
  r.comment,
  r.review_image_url,
  r.created_at
FROM reviews r
JOIN products p ON p.product_id = r.product_id
JOIN users u ON u.user_id = r.user_id
WHERE r.rating <= 2
ORDER BY r.created_at DESC;

-- Update an existing review.
UPDATE reviews
SET rating = ?,
    title = ?,
    comment = ?,
    review_image_url = ?
WHERE review_id = ?
  AND user_id = ?;

-- Hide a review from the admin dashboard.
UPDATE reviews
SET status = 'hidden'
WHERE review_id = ?;

-- Show reviews summary for product page rating stars.
SELECT
  product_id,
  ROUND(AVG(rating), 1) AS average_rating,
  COUNT(*) AS total_reviews,
  SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews,
  SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_reviews,
  SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_reviews,
  SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_reviews,
  SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews
FROM reviews
WHERE product_id = ?
  AND status = 'visible'
GROUP BY product_id;
