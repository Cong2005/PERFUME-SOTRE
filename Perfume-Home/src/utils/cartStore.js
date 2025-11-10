// src/utils/cartStore.js
const CART_KEY = "perfume-cart";

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item) => {
  const cart = getCart();
  const exists = cart.find(p => p.id === item.id);
  if (!exists) cart.push(item);
  saveCart(cart);
};

export const removeFromCart = (id) => {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
