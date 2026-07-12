const { query, sendJson, method, sha256 } = require("./_db");

module.exports = async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;

  const { username = "", email = "", password = "", role = "user", adminCode = "" } = req.body || {};
  const normalizedRole = String(role).toLowerCase();

  if (!username.trim() || !email.trim() || !password.trim() || !normalizedRole.trim()) {
    sendJson(res, 400, { success: false, message: "Username, email, password, and role are required." });
    return;
  }

  if (normalizedRole === "admin" && adminCode !== "BELLEVOUIX2025") {
    sendJson(res, 403, { success: false, message: "Invalid admin registration code." });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO users (username, full_name, email, password_hash, role, verification_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        username,
        email,
        sha256(password),
        normalizedRole,
        normalizedRole === "admin" ? "verified" : "pending"
      ]
    );

    sendJson(res, 201, {
      success: true,
      user: {
        id: result.insertId,
        username,
        email,
        role: normalizedRole
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      sendJson(res, 409, { success: false, message: "Username or email already exists." });
      return;
    }

    throw error;
  }
};
