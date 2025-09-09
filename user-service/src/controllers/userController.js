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

export const getAddresses = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM app_auth.addresses WHERE user_id = $1 ORDER BY created_at DESC`,
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { line1, line2, city, state, postal_code, lat, lng } = req.body;
    try {
      const result = await pool.query(
        `UPDATE app_auth.addresses
         SET line1 = $1, line2 = $2, city = $3, state = $4, postal_code = $5, lat = $6, lng = $7
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
        [line1, line2, city, state, postal_code, lat, lng, id, req.user.id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Address not found or not owned by user" });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  

export const deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM app_auth.addresses WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, req.user.id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Address not found or not owned by user" });
      }
  
      res.json({ message: "Address deleted successfully", id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};