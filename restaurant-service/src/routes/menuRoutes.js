import express from "express";
import {
  addMenuItem,
  getMenuByRestaurant,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:restaurantId/addMenu", verifyToken, addMenuItem);
router.get("/:restaurantId/getMenu", getMenuByRestaurant);
router.put("/:restaurantId/updateMenu/:itemId", verifyToken, updateMenuItem);
router.delete("/:restaurantId/deleteMenu/:itemId", verifyToken, deleteMenuItem);

export default router;
