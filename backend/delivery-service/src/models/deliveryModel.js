import pool from "../config/db.js";

export const assignDeliveryPartner = async (orderId, partnerName) => {
  const result = await pool.query(
    `INSERT INTO delivery.deliveries (order_id, partner_name, status)
     VALUES ($1, $2, 'ASSIGNED')
     RETURNING *`,
    [orderId, partnerName]
  );
  return result.rows[0];
};

export const getDeliveryByOrderId = async (orderId) => {
  const result = await pool.query(
    `SELECT * FROM delivery.deliveries WHERE order_id = $1`,
    [orderId]
  );
  return result.rows[0];
};

export const updateDeliveryStatus = async (orderId, status) => {
  const result = await pool.query(
    `UPDATE delivery.deliveries SET status = $1 WHERE order_id = $2 RETURNING *`,
    [status, orderId]
  );
  return result.rows[0];
};

export const getDeliveriesForPartner = async (partnerName) => {
  const result = await pool.query(
    `SELECT * FROM delivery.deliveries WHERE partner_name = $1`,
    [partnerName]
  );
  return result.rows;
};
