import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearUserCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/update", updateCartItem);

router.delete("/remove/:itemId", removeFromCart);

router.delete("/clear", clearUserCart);

export default router;
