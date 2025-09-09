import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
} from "../controllers/restaurantController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

export default router;
