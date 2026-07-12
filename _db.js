const mysql = require("mysql2/promise");

let pool;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.MYSQL_URL,
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || "bellevouix_store",
      waitForConnections: true,
      connectionLimit: 5,
      namedPlaceholders: false,
      enableKeepAlive: true
    });

    if (!process.env.MYSQL_URL) {
      requiredEnv("MYSQL_HOST");
      requiredEnv("MYSQL_USER");
      requiredEnv("MYSQL_PASSWORD");
    }
  }

  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

function sendJson(res, status, payload) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(status).json(payload);
}

function method(req, res, allowed) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

  if (!allowed.includes(req.method)) {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return false;
  }

  return true;
}

function sha256(value) {
  return require("crypto").createHash("sha256").update(value, "utf8").digest("hex");
}

module.exports = { query, sendJson, method, sha256 };
