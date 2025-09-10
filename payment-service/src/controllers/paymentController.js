import Payment from "../models/paymentModel.js";
import axios from "axios";

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    const payment = new Payment({
      orderId,
      amount,
      currency,
      status: "CREATED",
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM payments.payment_intents WHERE id = $1",
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Payment intent not found" });
      }
  
      const paymentIntent = result.rows[0];
  
      const paymentSucceeded = Math.random() < 0.5; 
  
      let newStatus = paymentSucceeded ? "SUCCEEDED" : "FAILED";
  
      await pool.query(
        "UPDATE payments.payment_intents SET status = $1 WHERE id = $2",
        [newStatus, id]
      );
  
      if (paymentSucceeded) {
        await axios.put(
          `http://localhost:4003/api/orders/${paymentIntent.order_id}/status`, 
          { status: "CONFIRMED" },
          {
            headers: { Authorization: req.headers.authorization }, 
          }
        );
      } else {
        await axios.put(
          `http://localhost:4003/api/orders/${paymentIntent.order_id}/status`,
          { status: "CANCELLED" },
          {
            headers: { Authorization: req.headers.authorization },
          }
        );
      }
  
      res.json({
        message: `Payment ${newStatus}`,
        paymentIntentId: id,
        orderId: paymentIntent.order_id,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error confirming payment:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };