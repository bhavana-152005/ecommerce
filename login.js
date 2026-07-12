const { query, sendJson, method, sha256 } = require("./_db");

module.exports = async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;

  const { username = "", password = "", role = "" } = req.body || {};
  if (!username.trim() || !password.trim() || !role.trim()) {
    sendJson(res, 400, { success: false, message: "Username, password, and role are required." });
    return;
  }

  const rows = await query(
    `SELECT user_id, username, email, role
       FROM users
      WHERE (username = ? OR email = ?)
        AND password_hash = ?
        AND role = ?
        AND is_active = TRUE
      LIMIT 1`,
    [username, username, sha256(password), role.toLowerCase()]
  );

  if (!rows.length) {
    sendJson(res, 401, { success: false, message: "Invalid login details." });
    return;
  }

  const user = rows[0];
  sendJson(res, 200, {
    success: true,
    user: {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};
