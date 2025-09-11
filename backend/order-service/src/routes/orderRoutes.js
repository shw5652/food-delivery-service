import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);

router.get("/get", verifyToken, getMyOrders);

router.get("/get/:id", verifyToken, getOrderById);

router.put("/:id/status", verifyToken, updateOrderStatus);

router.delete("/delete/:id", verifyToken, cancelOrder);

export default router;
