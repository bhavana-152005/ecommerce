USE bellevouix_store;

-- Dashboard summary cards.
SELECT
  (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS total_products,
  (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_status <> 'Cancelled') AS total_revenue;

-- Recent admin activity.
SELECT activity_type, description, created_at
FROM admin_activity
ORDER BY created_at DESC
LIMIT 10;

-- Add an admin activity entry.
INSERT INTO admin_activity (admin_user_id, activity_type, description)
VALUES (?, ?, ?);

-- Gallery/media upload record.
INSERT INTO media_assets (file_name, asset_url, category, is_featured, uploaded_by)
VALUES (?, ?, ?, ?, ?);

-- Featured homepage images.
SELECT asset_id, file_name, asset_url, category
FROM media_assets
WHERE is_featured = TRUE
ORDER BY uploaded_at DESC;
