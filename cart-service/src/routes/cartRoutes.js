import express from "express";
import {
  addToCart,
  getCart,
  updateItem,
  removeItem,
  clearUserCart
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:restaurantId/add", verifyToken, addToCart);

router.get("/get", verifyToken, getCart);

router.put("/update/:itemId", verifyToken, updateItem);

router.delete("/remove/:itemId", verifyToken, removeItem);

router.delete("/clear", verifyToken, clearUserCart);

export default router;
