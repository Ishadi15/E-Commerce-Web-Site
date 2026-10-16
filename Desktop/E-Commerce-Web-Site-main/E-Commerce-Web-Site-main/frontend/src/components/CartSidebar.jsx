import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Truck, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FREE_SHIPPING_THRESHOLD = 5000;

const CartSidebar = ({ onProceedToCheckout }) => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const subtotalLKR = cartTotal * 300;
  const progressPercent = Math.min(100, Math.round((subtotalLKR / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalLKR);
  const qualifiesForFreeShipping = subtotalLKR >= FREE_SHIPPING_THRESHOLD;

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
      <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white border-l border-gray-200 z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 text-brand-500 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-wide uppercase">Shopping Cart</h2>
              <span className="text-xs font-bold text-gray-500">{cartItems.length} unique {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 font-semibold p-1.5 transition-colors cursor-pointer"
                title="Clear all items"
              >
                Clear Cart
              </button>
            )}
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free Delivery Target Banner (Member 3 Requirement) */}
        {cartItems.length > 0 && (
          <div className="bg-amber-50/70 border-b border-amber-200/60 p-4">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <Truck size={16} className="text-amber-600" />
                {qualifiesForFreeShipping ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-600 inline" /> You've unlocked FREE Islandwide Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-brand-600">Rs. {amountToFreeShipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> more for FREE Delivery!
                  </span>
                )}
              </div>
              <span className="text-amber-800 font-black">{progressPercent}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${qualifiesForFreeShipping ? 'bg-emerald-500' : 'bg-brand-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">Your cart is currently empty</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[240px]">Browse our latest collections and add pieces to your cart.</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 bg-brand-500 hover:bg-black text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const maxStock = item.countInStock !== undefined ? Number(item.countInStock) : 99;
              const isAtMaxStock = item.quantity >= maxStock;

              return (
                <div key={item.cartItemId || item.id} className="flex gap-4 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-gray-200 transition-all">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img src={item.image || item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-gray-900 font-bold text-xs sm:text-sm truncate leading-tight">{item.title}</h3>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          Size: <span className="font-semibold text-gray-800">{item.size || 'M'}</span> &bull; Color: <span className="font-semibold text-gray-800">{item.color || 'Standard'}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                          className="p-1 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer"
                          title="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-gray-900 text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                          disabled={isAtMaxStock}
                          className="p-1 hover:bg-white rounded text-gray-600 transition-colors disabled:opacity-30 cursor-pointer"
                          title={isAtMaxStock ? 'Max stock reached' : 'Increase'}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Item Total (LKR) */}
                      <div className="text-right">
                        <div className="text-brand-500 font-black text-sm">
                          Rs. {((item.price * 300) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {isAtMaxStock && (
                          <span className="text-[10px] text-amber-600 font-bold">Max stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                <span className="font-bold text-gray-900">
                  Rs. {subtotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Delivery:</span>
                <span className={`font-black ${qualifiesForFreeShipping ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {qualifiesForFreeShipping ? 'FREE' : 'Rs. 350.00'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-black uppercase text-gray-700">Estimated Total:</span>
              <span className="text-xl font-black text-gray-950">
                Rs. {(subtotalLKR + (qualifiesForFreeShipping ? 0 : 350)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-brand-500 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-[11px] text-center text-gray-400 font-medium">
              Tax included. 100% Secure Checkout with Islandwide Delivery.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
