const { query, sendJson, method } = require("./_db");

function toProduct(row) {
  return {
    id: row.product_id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    discount: Number(row.discount_percent || 0),
    stock: Number(row.stock_quantity || 0),
    image: row.image_url,
    rating: Number(row.rating || 0),
    ratingCount: Number(row.rating_count || 0),
    isNew: Boolean(row.is_new),
    sizes: row.sizes ? String(row.sizes).split(",") : []
  };
}

module.exports = async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;

  const category = String(req.query.category || "all").toLowerCase();
  const params = [];
  let where = "WHERE p.is_active = TRUE";

  if (category && category !== "all") {
    where += " AND p.category = ?";
    params.push(category);
  }

  const rows = await query(
    `SELECT p.product_id, p.name, p.brand, p.category, p.subcategory, p.price,
            p.original_price, p.discount_percent, p.stock_quantity, p.image_url,
            p.rating, p.rating_count, p.is_new,
            GROUP_CONCAT(ps.size_label ORDER BY ps.size_label) AS sizes
       FROM products p
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
      ${where}
      GROUP BY p.product_id
      ORDER BY p.created_at DESC, p.product_id`,
    params
  );

  sendJson(res, 200, { products: rows.map(toProduct) });
};
