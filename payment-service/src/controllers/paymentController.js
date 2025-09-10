import { v4 as uuidv4 } from "uuid";
import {
  createPaymentIntent,
  getPaymentById,
  updatePaymentStatus,
} from "../models/paymentModel.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId, amountCents } = req.body;
    const idempotencyKey = uuidv4();

    const payment = await createPaymentIntent(orderId, amountCents, idempotencyKey);
    if (!payment) {
      return res.status(400).json({ error: "Payment already exists (idempotency)" });
    }

    res.json({ message: "Payment intent created", payment });
  } catch (err) {
    console.error("Create Payment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const providerRef = "razorpay_sim_" + uuidv4();

    const updated = await updatePaymentStatus(paymentId, "SUCCEEDED", providerRef);
    res.json({ message: "Payment confirmed", payment: updated });
  } catch (err) {
    console.error("Confirm Payment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const failPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const providerRef = "razorpay_fail_" + uuidv4();

    const updated = await updatePaymentStatus(paymentId, "FAILED", providerRef);
    res.json({ message: "Payment failed", payment: updated });
  } catch (err) {
    console.error("Fail Payment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await getPaymentById(paymentId);

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json({ payment });
  } catch (err) {
    console.error("Get Payment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
