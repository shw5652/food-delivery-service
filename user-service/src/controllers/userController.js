import pool from "../config/db.js";

export const getProfile = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, created_at 
         FROM app_auth.users WHERE id = $1`,
        [req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const addAddress = async (req, res) => {
    const { line1, line2, city, state, postal_code, lat, lng } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO app_auth.addresses 
         (user_id, line1, line2, city, state, postal_code, lat, lng)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [req.user.id, line1, line2, city, state, postal_code, lat, lng]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};