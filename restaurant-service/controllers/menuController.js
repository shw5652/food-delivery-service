import pool from "../config/db.js";

export const addMenuItem = async (req, res) => {
    try{
        const { restaurantId } = req.params;
        const { name, description, price_cents } = req.body;

        const result = await pool.query(
            'INSERT INTO restaurant.menu_items (restaurant_id, anme, description, price_cents) VALUES ($1, $2, $3, $4) RETURNING id, name, description, price_cents, is_available, created_at', [restaurantId, name, description, price_cents]
        );
        res.status(201).json({message: "Menu item added", item: result.rows[0]});
    } catch (err){
        console.error("AddMenuItem error : ", err.message);
        res.status(500).json({message: "Server error"});
    }
};

export const updateMenuItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const { name, description, price_cents, is_available } = req.body;
  
      const result = await pool.query(
        `UPDATE restaurant.menu_items
         SET name=$1, description=$2, price_cents=$3, is_available=$4
         WHERE id=$5
         RETURNING id, name, description, price_cents, is_available, created_at`,
        [name, description, price_cents, is_available, itemId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      res.json({ message: "Menu item updated", item: result.rows[0] });
    } catch (err) {
      console.error("updateMenuItem error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
      const { itemId } = req.params;
  
      const result = await pool.query(
        `DELETE FROM restaurant.menu_items WHERE id=$1 RETURNING id`,
        [itemId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      res.json({ message: "Menu item deleted" });
    } catch (err) {
      console.error("deleteMenuItem error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
};