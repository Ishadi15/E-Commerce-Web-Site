import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  
  if (!isOpen || !product) return null;

  const defaultSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const defaultColors = product.colors && product.colors.length > 0 ? product.colors : ['Standard'];
  const imageUrl = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';

  const [selectedSize, setSelectedSize] = useState(defaultSizes[0]);
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const priceLKR = (product.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 border border-gray-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-md rounded-full shadow hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center relative min-h-[350px] md:min-h-[500px]">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover max-h-[520px]"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-500 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow">
              {product.category || 'Fashion'}
            </span>
          </div>
        </div>

        {/* Right: Product Information & Purchase Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {product.brand && (
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {product.brand}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 leading-tight">
              {product.title}
            </h2>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-semibold">(4.9 / 5.0 • 128 Reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-500">
                Rs. {priceLKR}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {(product.price * 300 * 1.25).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-extrabold px-2 py-0.5 rounded">
                25% OFF
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.description || 'Premium quality apparel made with utmost craftsmanship, breathable fabrics, and tailored for exceptional durability and comfort.'}
            </p>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Select Size
                </label>
                <span className="text-[11px] text-brand-500 font-bold hover:underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {defaultSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-11 px-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-2">
                Color: <span className="font-medium text-gray-500">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-4">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-gray-200 font-bold text-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-black text-gray-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-gray-200 font-bold text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons & Badges */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer ${
                isAdded
                  ? 'bg-green-600 text-white shadow-green-600/30'
                  : 'bg-brand-500 hover:bg-red-700 text-white shadow-brand-500/30 active:scale-[0.99]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={20} className="stroke-[3]" />
                  Added To Your Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Add To Cart • Rs. {((product.price * 300) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </>
              )}
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-5 text-[11px] text-gray-500 text-center font-medium">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-gray-700" />
                <span>Island-wide Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-gray-700" />
                <span>100% Genuine Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={16} className="text-gray-700" />
                <span>Easy 7-Day Exchange</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
