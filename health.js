const { query, sendJson, method } = require("./_db");

module.exports = async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;

  try {
    await query("SELECT 1 AS ok");
    sendJson(res, 200, { ok: true, database: "mysql connected" });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      database: `mysql unavailable (${error.name}: ${error.message})`
    });
  }
};
