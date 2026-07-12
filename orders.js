const mysql = require("mysql2/promise");
const { sendJson, method } = require("./_db");

function connectionConfig() {
  if (process.env.MYSQL_URL) return process.env.MYSQL_URL;
  return {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || "bellevouix_store"
  };
}

function orderId(value) {
  return value || `BLV${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

module.exports = async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) {
    sendJson(res, 400, { success: false, message: "Order could not be saved. Check cart and checkout data." });
    return;
  }

  const id = orderId(body.orderId);
  const connection = await mysql.createConnection(connectionConfig());

  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, payment_method,
                           subtotal, shipping_amount, tax_amount, total_amount, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY))`,
      [
        id,
        `${body.firstName || ""} ${body.lastName || ""}`.trim(),
        body.email || "",
        body.phone || "",
        body.paymentMethod || "cod",
        Number(body.subtotal || 0),
        Number(body.shipping || 0),
        Number(body.tax || 0),
        Number(body.total || 0)
      ]
    );

    for (const item of items) {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_category,
                                  size_label, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          Number(item.id),
          item.name || "",
          item.category || "",
          item.selectedSize || "Free Size",
          quantity,
          price,
          price * quantity
        ]
      );
    }

    await connection.commit();
    sendJson(res, 201, { success: true, orderId: id });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
};
