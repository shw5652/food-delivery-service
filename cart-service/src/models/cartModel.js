import pool from "../config/db.js";

export const getOrCreateCart = async (userId, restaurantId) => {
  const { rows } = await pool.query(
    `SELECT * FROM cart.carts WHERE user_id=$1`,
    [userId]
  );

  if (rows.length > 0) {
    if (rows[0].restaurant_id && rows[0].restaurant_id !== restaurantId) {
      const updated = await pool.query(
        `UPDATE cart.carts SET restaurant_id=$1 WHERE id=$2 RETURNING *`,
        [restaurantId, rows[0].id]
      );
      return updated.rows[0];
    }
    return rows[0];
  }

  const res = await pool.query(
    `INSERT INTO cart.carts (user_id, restaurant_id) VALUES ($1, $2) RETURNING *`,
    [userId, restaurantId]
  );
  return res.rows[0];
};

export const addCartItem = async (cartId, menuItemId, menuItemName, qty, priceSnapshotCents) => {
  const res = await pool.query(
    `INSERT INTO cart.cart_items (cart_id, menu_item_id, menu_item_name, qty, price_snapshot_cents)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [cartId, menuItemId, menuItemName, qty, priceSnapshotCents]
  );
  return res.rows[0];
};

export const findCartByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM cart.carts WHERE user_id=$1`,
    [userId]
  );
  return rows[0] || null;
};

export const getCartItems = async (cartId) => {
  const { rows } = await pool.query(
    `SELECT * FROM cart.cart_items WHERE cart_id=$1 ORDER BY created_at DESC`,
    [cartId]
  );
  return rows;
};

export const updateCartItemQty = async (itemId, userCartId, newQty) => {
  const { rows } = await pool.query(
    `UPDATE cart.cart_items SET qty=$1 WHERE id=$2 AND cart_id=$3 RETURNING *`,
    [newQty, itemId, userCartId]
  );
  return rows[0] || null;
};

export const removeCartItem = async (itemId, userCartId) => {
  const { rows } = await pool.query(
    `DELETE FROM cart.cart_items WHERE id=$1 AND cart_id=$2 RETURNING *`,
    [itemId, userCartId]
  );
  return rows[0] || null;
};

export const clearCart = async (cartId) => {
  await pool.query(`DELETE FROM cart.cart_items WHERE cart_id=$1`, [cartId]);
  return true;
};
