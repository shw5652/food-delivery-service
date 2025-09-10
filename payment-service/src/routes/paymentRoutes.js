import express from "express";
import {
  createPayment,
  confirmPayment,
  failPayment,
  getPayment,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPayment);
router.post("/:paymentId/confirm", authMiddleware, confirmPayment);
router.post("/:paymentId/fail", authMiddleware, failPayment);
router.get("/:paymentId", authMiddleware, getPayment);

export default router;
