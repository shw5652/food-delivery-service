import express from "express";
import { createRestaurant, getRestaurants, getRestaurantById } from "../controllers/restaurantController.js";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/rest/add", verifyToken, createRestaurant);
router.get("/rest/all", getRestaurants);
router.get("/rest/:id", getRestaurantById);

router.get("/rest/:restaurantId/menu/add", verifyToken, addMenuItem);
router.put("/rest/:restaurantId/menu/:itemId/update", verifyToken, updateMenuItem);
router.delete("/rest/:restaurantId/menu/:itemId/delete", verifyToken, deleteMenuItem);

export default router;