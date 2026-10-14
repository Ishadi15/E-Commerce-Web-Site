import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  if (!isOpen) return null;

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id || item._id);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => addToCart(item));
    clearWishlist();
    onClose();
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-gray-200 z-[75] shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <Heart size={20} className="fill-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Saved Wishlist</h2>
              <p className="text-xs text-gray-500">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-400 flex items-center justify-center mb-4">
                <Heart size={36} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                Explore our collections and tap the heart icon on your favorite items to save them for later!
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item.id || item._id}
                className="flex gap-4 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow items-center"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                    {item.category || 'Fashion'}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-gray-900">
                      Rs. {(item.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5">
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Cart</span>
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id || item._id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
            <button 
              onClick={handleMoveAllToCart}
              className="w-full py-3.5 bg-brand-500 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add All to Cart</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={clearWishlist}
              className="text-center text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors py-1 cursor-pointer"
            >
              Clear entire wishlist
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default WishlistModal;
