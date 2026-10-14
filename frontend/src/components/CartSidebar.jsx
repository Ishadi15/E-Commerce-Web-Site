import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ onProceedToCheckout }) => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white border-l border-gray-200 z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-brand-500" />
            <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">Your Cart</h2>
            <span className="bg-brand-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{cartItems.length}</span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-16">
              <ShoppingBag size={64} className="text-gray-200" />
              <p className="text-lg font-medium">Your cart is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-8 py-3 bg-brand-500 hover:bg-red-700 text-white rounded font-bold uppercase transition-colors cursor-pointer shadow"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartItemId || item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image || item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 font-bold text-sm line-clamp-1 leading-tight">{item.title}</h3>
                      <p className="text-gray-500 text-xs mt-1">
                        Size: <span className="font-semibold text-gray-700">{item.size || 'M'}</span> | Color: <span className="font-semibold text-gray-700">{item.color || 'Standard'}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId || item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-gray-900 text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-brand-500 font-black text-sm">
                      Rs. {((item.price * 300) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium uppercase text-xs">Estimated Subtotal</span>
              <span className="text-2xl font-black text-gray-900">
                Rs. {(cartTotal * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button 
              onClick={handleCheckoutClick}
              className="w-full py-4 bg-brand-500 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
