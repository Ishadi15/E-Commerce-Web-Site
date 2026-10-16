import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlistItems: [],
      wishlistCount: 0,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      toggleWishlist: () => {},
      isInWishlist: () => false,
      clearWishlist: () => {}
    };
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fashionstore_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fashionstore_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => (item.id || item._id) === (product.id || product._id));
      if (exists) return prev;
      return [...prev, {
        id: product.id || product._id,
        _id: product.id || product._id,
        title: product.title,
        price: product.price,
        image: product.image || product.images?.[0]?.url || '',
        category: product.category,
        brand: product.brand || 'FashionStore',
        size: product.size || product.sizes?.[0] || 'M',
        color: product.color || product.colors?.[0] || 'Standard'
      }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== productId));
  };

  const toggleWishlist = (product) => {
    const id = product.id || product._id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item.id || item._id) === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
