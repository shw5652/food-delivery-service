import db from "../config/db.js";

export const createRestaurant = async (req, res) => {
  try {
    const { name, address, lat, lng } = req.body;
    const owner_user_id = req.user.id; 

    const result = await db.query(
      `INSERT INTO restaurant.restaurants (owner_user_id, name, address, lat, lng)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [owner_user_id, name, address, lat, lng]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM restaurant.restaurants ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM restaurant.restaurants WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).json({ error: "Server error" });
  }
};