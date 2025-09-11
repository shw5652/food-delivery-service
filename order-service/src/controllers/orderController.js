import db from "../config/db.js";
import axios from "axios";

export const placeOrder = async (req, res) =>{
    const client = await db.connect();

    try{
        const { restaurant_id, address_id, items } = req.body;
        const user_id = req.user_id;

        if(!items || items.length === 0){
            return res.status(400).json({error: "Order must include items"});
        }

        await client.query("BEGIN");

        const amount_cents = items.reduce(
            (sum, item) => sum + item.price_snapshot_cents * item.qty, 0
        );

        const orderResult = await client.query(
            'INSERT INTO orders.orders (user_id, restaurant_id, address_id, amount_cents) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, restaurant_id, address_id, amount_cents]
        );

        const order = orderResult.rows[0];

        for(const item of items){
            await client.query(
                'INSERT INTO orders.order_items (order_id, menu_item_id, name_snapshot, price_snapshot_cents, qty) VALUES ($1, $2, $3, $4, $5)', [order.id, item.menu_item_id, item.name_snapshot, item.price_snapshot_cents, item.qty]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({message: "Order placed successfully", order});
    }
    catch (err){
        await client.query("ROLLBACK");
        console.error("Error placing order : ", err);
        res.status(500).json({error: "Server error"});
    }
    finally{
        client.release();
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await db.query(
            `SELECT * FROM orders.orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderResult = await db.query(
            `SELECT * FROM orders.orders WHERE id = $1`,
            [id]
        );
    
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
    
        const itemsResult = await db.query(
            `SELECT * FROM orders.order_items WHERE order_id = $1`,
            [id]
        );
    
        res.json({ ...orderResult.rows[0], items: itemsResult.rows });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "DELIVERY_PARTNER_ASSIGNED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({
            message: `Order status updated to ${status}`,
            order,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
    
        const result = await db.query(
            `UPDATE orders.orders SET status = 'CANCELLED' WHERE id = $1 RETURNING *`,
            [id]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
    
        res.json({ message: "Order cancelled successfully", order: result.rows[0] });
    } catch (err) {
        console.error("Error cancelling order:", err);
        res.status(500).json({ error: "Server error" });
    }
};