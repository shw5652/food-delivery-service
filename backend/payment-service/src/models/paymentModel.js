import { pool } from "../config/db.js";

export const createPaymentIntent = async (orderId, amountCents, idempotencyKey) => {
  const result = await pool.query(
    `INSERT INTO payments.payment_intents 
     (order_id, amount_cents, idempotency_key)
     VALUES ($1, $2, $3)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING *`,
    [orderId, amountCents, idempotencyKey]
  );
  return result.rows[0];
};

export const getPaymentById = async (paymentId) => {
  const result = await pool.query(
    `SELECT * FROM payments.payment_intents WHERE id = $1`,
    [paymentId]
  );
  return result.rows[0];
};

export const updatePaymentStatus = async (paymentId, status, providerRef) => {
  const result = await pool.query(
    `UPDATE payments.payment_intents
     SET status = $1, provider_ref = $2
     WHERE id = $3
     RETURNING *`,
    [status, providerRef, paymentId]
  );
  return result.rows[0];
};
