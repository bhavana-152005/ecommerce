USE bellevouix_store;

-- Register a new user.
INSERT INTO users (username, full_name, email, phone, password_hash, role)
VALUES (?, ?, ?, ?, SHA2(?, 256), 'user');

-- Register an admin after validating the admin registration code in application code.
INSERT INTO users (username, full_name, email, phone, password_hash, role, verification_status)
VALUES (?, ?, ?, ?, SHA2(?, 256), 'admin', 'verified');

-- Login user or admin.
SELECT user_id, username, full_name, email, role, verification_status
FROM users
WHERE username = ?
  AND password_hash = SHA2(?, 256)
  AND is_active = TRUE;

-- Check whether username or email already exists.
SELECT user_id, username, email
FROM users
WHERE username = ? OR email = ?;

-- Admin user verification list.
SELECT user_id, full_name, email, phone, verification_status, created_at
FROM users
WHERE role = 'user'
ORDER BY created_at DESC;

-- Update user verification status from the admin dashboard.
UPDATE users
SET verification_status = ?
WHERE user_id = ?
  AND role = 'user';
