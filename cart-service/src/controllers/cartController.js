import pool from "../config/db.js";
import {
  getOrCreateCart,
  addCartItem,
  findCartByUser,
  getCartItems,
  updateCartItemQty,
  removeCartItem,
  clearCart
} from "../models/cartModel.js";

/**
 * POST /cart/:restaurantId/add
 * body: { menu_item_id, menu_item_name, qty, price_snapshot_cents }
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { restaurantId } = req.params;
    const { menu_item_id, menu_item_name, qty, price_snapshot_cents } = req.body;

    if (!menu_item_id || !qty || !price_snapshot_cents) {
      return res.status(400).json({ error: "menu_item_id, qty and price_snapshot_cents are required" });
    }

    const cart = await getOrCreateCart(userId, restaurantId);

    const item = await addCartItem(cart.id, menu_item_id, menu_item_name || null, qty, price_snapshot_cents);
    return res.status(201).json({ cart, item });
  } 
  catch (err) {
    console.error("addToCart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /cart/get
 * returns cart row + items
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cart = await findCartByUser(userId);
    if (!cart) return res.json({ cart: null, items: [] });

    const items = await getCartItems(cart.id);
    return res.json({ cart, items });
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * PUT /cart/update/:itemId
 * body: { qty }
 */
export const updateItem = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { itemId } = req.params;
    const { qty } = req.body;

    if (typeof qty !== "number" || qty <= 0) {
      return res.status(400).json({ error: "qty must be a positive number" });
    }

    const cart = await findCartByUser(userId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const updated = await updateCartItemQty(itemId, cart.id, qty);
    if (!updated) return res.status(404).json({ error: "Cart item not found" });

    return res.json({ item: updated });
  } catch (err) {
    console.error("updateItem error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE /cart/remove/:itemId
 */
export const removeItem = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { itemId } = req.params;
    const cart = await findCartByUser(userId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const removed = await removeCartItem(itemId, cart.id);
    if (!removed) return res.status(404).json({ error: "Cart item not found" });

    return res.json({ message: "Item removed", item: removed });
  } catch (err) {
    console.error("removeItem error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE /cart/clear
 */
export const clearUserCart = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cart = await findCartByUser(userId);
    if (!cart) return res.json({ message: "Cart already empty" });

    await clearCart(cart.id);
    return res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearUserCart error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
