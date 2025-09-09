import express from "express";
import { getProfile, addAddress, getAddresses, updateAddress, deleteAddress } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

router.post("/address", verifyToken, addAddress);

router.get("/addresses", verifyToken, getAddresses);

router.put("/address/:id", verifyToken, updateAddress);

router.delete("/address/:id", verifyToken, deleteAddress);

export default router;