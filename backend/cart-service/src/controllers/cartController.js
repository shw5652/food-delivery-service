import {
    getOrCreateCart,
    addCartItem,
    findCartByUser,
    getCartItems,
    updateCartItemQty,
    removeCartItem,
    clearCart,
  } from "../models/cartModel.js";
  
  export const getCart = async (req, res) => {
    try {
      const userId = req.user.id; 
      const cart = await findCartByUser(userId);
  
      if (!cart) {
        return res.json({ cart: null, items: [] });
      }
  
      const items = await getCartItems(cart.id);
      res.json({ cart, items });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { restaurantId, menuItemId, menuItemName, qty, priceSnapshotCents } = req.body;
  
      const cart = await getOrCreateCart(userId, restaurantId);
      const item = await addCartItem(cart.id, menuItemId, menuItemName, qty, priceSnapshotCents);
  
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const updateCartItem = async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId, newQty } = req.body;
  
      const cart = await findCartByUser(userId);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const updated = await updateCartItemQty(itemId, cart.id, newQty);
      if (!updated) return res.status(404).json({ message: "Item not found" });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const removeFromCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
  
      const cart = await findCartByUser(userId);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const removed = await removeCartItem(itemId, cart.id);
      if (!removed) return res.status(404).json({ message: "Item not found" });
  
      res.json({ message: "Item removed", removed });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const clearUserCart = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const cart = await findCartByUser(userId);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      await clearCart(cart.id);
      res.json({ message: "Cart cleared" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  