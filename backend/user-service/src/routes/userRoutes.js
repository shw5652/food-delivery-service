import express from "express";
import { getProfile, addAddress, getAddresses, updateAddress, deleteAddress } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

router.post("/address/add", verifyToken, addAddress);

router.get("/address/get", verifyToken, getAddresses);

router.put("/address/update", verifyToken, updateAddress);

router.delete("/address/delete", verifyToken, deleteAddress);

export default router;