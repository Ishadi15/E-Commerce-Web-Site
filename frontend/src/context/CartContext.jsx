import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,
      isCartOpen: false,
      setIsCartOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {}
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fashionstore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('fashionstore_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || product.size || 'M';
    const color = selectedColor || (product.colors && product.colors[0]) || product.color || 'Standard';
    const image = product.images?.[0]?.url || product.image || '';
    const cartItemId = `${product._id || product.id}_${size}_${color}`;
    const maxStock = product.countInStock !== undefined ? Number(product.countInStock) : 25;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        const newQty = Math.min(maxStock, existing.quantity + quantity);
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: newQty, countInStock: maxStock } 
            : item
        );
      }
      return [
        ...prev, 
        { 
          ...product, 
          cartItemId, 
          id: product._id || product.id, 
          image, 
          size, 
          color, 
          quantity: Math.min(maxStock, quantity),
          countInStock: maxStock
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => (item.cartItemId || item.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, change) => {
    setCartItems(prev => prev.map(item => {
      if ((item.cartItemId || item.id) === cartItemId) {
        const maxStock = item.countInStock !== undefined ? Number(item.countInStock) : 99;
        const newQuantity = Math.min(maxStock, Math.max(1, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('fashionstore_cart');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
