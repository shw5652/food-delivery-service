import db from "../config/db.js";

export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, price_cents } = req.body;

    const result = await db.query(
      `INSERT INTO restaurant.menu_items (restaurant_id, name, description, price_cents)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurantId, name, description, price_cents]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const result = await db.query(
      `SELECT * FROM restaurant.menu_items
       WHERE restaurant_id = $1
       ORDER BY created_at DESC`,
      [restaurantId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, price_cents, is_available } = req.body;

    const result = await db.query(
      `UPDATE restaurant.menu_items
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price_cents = COALESCE($3, price_cents),
           is_available = COALESCE($4, is_available)
       WHERE id = $5
       RETURNING *`,
      [name, description, price_cents, is_available, itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await db.query(
      `DELETE FROM restaurant.menu_items WHERE id = $1 RETURNING *`,
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ error: "Server error" });
  }
};
