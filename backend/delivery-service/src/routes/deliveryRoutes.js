import express from "express";
import {
  assignPartner,
  getDelivery,
  changeDeliveryStatus,
  getPartnerDeliveries,
} from "../controllers/deliveryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign", verifyToken, assignPartner);
router.get("/:orderId", verifyToken, getDelivery);
router.put("/:orderId/status", verifyToken, changeDeliveryStatus);
router.get("/partner/:partnerName", verifyToken, getPartnerDeliveries);

export default router;
