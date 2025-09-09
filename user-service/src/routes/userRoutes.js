import express from "express";
import { getProfile, addAddress } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

router.post("/address", verifyToken, addAddress);

export default router;