USE bellevouix_store;

INSERT INTO users
  (username, full_name, email, phone, password_hash, role, verification_status)
VALUES
  ('admin', 'Bellevouix Admin', 'admin@bellevouix.com', '+91 98765 43200', SHA2('admin123', 256), 'admin', 'verified'),
  ('sarah', 'Sarah Johnson', 'sarah@example.com', '+91 98765 43210', SHA2('user123', 256), 'user', 'pending'),
  ('mike', 'Mike Chen', 'mike@example.com', '+91 98765 43211', SHA2('user123', 256), 'user', 'verified'),
  ('emily', 'Emily Davis', 'emily@example.com', '+91 98765 43212', SHA2('user123', 256), 'user', 'flagged');
