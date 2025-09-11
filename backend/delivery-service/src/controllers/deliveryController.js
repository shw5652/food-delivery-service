import {
    assignDeliveryPartner,
    getDeliveryByOrderId,
    updateDeliveryStatus,
    getDeliveriesForPartner,
  } from "../models/deliveryModel.js";

import db from "../config/db.js";
import axios from "axios";

export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;

    const assignment = await db.query(
      `INSERT INTO delivery.assignments (order_id, delivery_partner_id, status)
       VALUES ($1, $2, 'ASSIGNED')
       RETURNING *`,
      [orderId, partnerId]
    );

    await axios.put(`${process.env.ORDERS_SERVICE_URL}/orders/${orderId}/status`, {
      status: "DELIVERY_PARTNER_ASSIGNED",
    });

    res.json({
      message: "Delivery partner assigned and order updated",
      assignment: assignment.rows[0],
    });
  } catch (err) {
    console.error("Error assigning partner:", err.message);
    res.status(500).json({ error: err.message });
  }
};
  
  export const getDelivery = async (req, res) => {
    try {
      const { orderId } = req.params;
      const delivery = await getDeliveryByOrderId(orderId);
      if (!delivery) return res.status(404).json({ error: "Not found" });
      res.json(delivery);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch delivery" });
    }
  };
  
  export const changeDeliveryStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const delivery = await updateDeliveryStatus(orderId, status);
      res.json(delivery);
    } catch (err) {
      res.status(500).json({ error: "Failed to update delivery" });
    }
  };
  
  export const getPartnerDeliveries = async (req, res) => {
    try {
      const { partnerName } = req.params;
      const deliveries = await getDeliveriesForPartner(partnerName);
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch partner deliveries" });
    }
  };
  