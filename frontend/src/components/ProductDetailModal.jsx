import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star, Heart, Flame, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Color map for visual swatches
const COLOR_HEX_MAP = {
  white: '#FFFFFF',
  black: '#111827',
  blue: '#2563EB',
  navy: '#1E3A8A',
  red: '#DC2626',
  beige: '#D2B48C',
  yellow: '#EAB308',
  green: '#16A34A',
  pink: '#EC4899',
  gold: '#D97706',
  silver: '#9CA3AF',
  brown: '#78350F',
  'light blue': '#60A5FA',
  standard: '#4B5563'
};

const ProductDetailModal = ({ product, isOpen, onClose, onSelectRelated }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const defaultSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const defaultColors = product.colors && product.colors.length > 0 ? product.colors : ['Standard'];

  // Multi-image list
  const primaryImage = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';
  const imagesList = (product.images && product.images.length > 1)
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : [
        primaryImage,
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
      ];

  const [activeImage, setActiveImage] = useState(primaryImage);
  const [selectedSize, setSelectedSize] = useState(defaultSizes[0]);
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Stock Intelligence
  const stock = product.countInStock !== undefined ? Number(product.countInStock) : 18;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const priceLKR = (product.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Reset states when product changes
  useEffect(() => {
    setActiveImage(primaryImage);
    setSelectedSize(defaultSizes[0]);
    setSelectedColor(defaultColors[0]);
    setQuantity(1);
    setIsAdded(false);

    // Fetch related products
    const fetchRelated = async () => {
      try {
        const id = product.id || product._id;
        const res = await fetch(`http://localhost:5000/api/products/${id}/related`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setRelatedProducts(json.data.map(p => ({
            ...p,
            id: p._id,
            image: p.images?.[0]?.url || p.image || primaryImage
          })));
        }
      } catch (e) {
        setRelatedProducts([]);
      }
    };

    fetchRelated();
  }, [product]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const getColorHex = (colorName) => {
    const key = String(colorName).toLowerCase().trim();
    return COLOR_HEX_MAP[key] || '#4B5563';
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative z-10 border border-gray-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-gray-500 hover:text-gray-900 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Left: Product Image & Multi-Image Gallery */}
        <div className="md:w-1/2 bg-gray-50 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-gray-100">
          
          {/* Main Photo View */}
          <div className="relative aspect-[4/5] sm:min-h-[420px] max-h-[480px] overflow-hidden bg-gray-100">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-500 ease-out"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-brand-500 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow">
                {product.category || 'Fashion'}
              </span>
            </div>

            {/* Out of Stock Ribbon */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-sm uppercase px-5 py-2 rounded-xl shadow-lg tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Multi-Image Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-2.5 p-3.5 bg-white border-t border-gray-100 items-center justify-center">
              {imagesList.map((thumbUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(thumbUrl)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === thumbUrl 
                      ? 'border-brand-500 scale-105 shadow-md' 
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                  title={`View angle ${idx + 1}`}
                >
                  <img src={thumbUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Product Details, Stock & Purchase Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            
            {/* Brand & Stock Status Badge */}
            <div className="flex items-center justify-between gap-2">
              {product.brand ? (
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {product.brand}
                </span>
              ) : <span></span>}

              {/* Real-time Inventory Badge */}
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-black px-2.5 py-1 rounded-full border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-black px-2.5 py-1 rounded-full border border-amber-200">
                  <Flame size={13} className="text-amber-600" />
                  Only {stock} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock ({stock} available)
                </span>
              )}
            </div>

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
              <span className="text-xs text-gray-500 font-semibold">(4.9 / 5.0 • 128 Customer Reviews)</span>
            </div>

            {/* Price Display */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-500">
                Rs. {priceLKR}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {(product.price * 300 * 1.25).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                SAVE 25%
              </span>
            </div>

            {/* Description */}
            <p className="mt-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description || 'Premium quality apparel tailored with breathable fabrics for ultimate day-to-day comfort, exceptional durability and effortless modern style.'}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Select Size
                </label>
                <span className="text-[11px] text-brand-500 font-bold hover:underline cursor-pointer">Size Chart</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {defaultSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center border cursor-pointer ${
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

            {/* Color Selector with Swatches */}
            <div className="mt-4">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-2">
                Color: <span className="font-bold text-gray-900">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {defaultColors.map((color) => {
                  const hex = getColorHex(color);
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 shadow-xs'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/20" 
                        style={{ backgroundColor: hex }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 hover:bg-gray-200 font-bold text-gray-600 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-black text-gray-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= stock || isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 hover:bg-gray-200 font-bold text-gray-600 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
              {isLowStock && (
                <span className="text-[11px] text-amber-700 font-semibold">Max {stock} items</span>
              )}
            </div>

          </div>

          {/* Action Buttons & Guarantees */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-brand-500 hover:bg-red-700 text-white shadow-brand-500/30 active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isOutOfStock ? (
                  <span>Item Currently Out of Stock</span>
                ) : isAdded ? (
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

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`px-4 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isInWishlist(product.id || product._id)
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 hover:border-red-400 text-gray-400 hover:text-red-500 bg-gray-50'
                }`}
                title={isInWishlist(product.id || product._id) ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart size={22} className={isInWishlist(product.id || product._id) ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-gray-500 text-center font-medium">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-gray-700" />
                <span>Fast Islandwide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-gray-700" />
                <span>100% Genuine Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={16} className="text-gray-700" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>

            {/* Related Products Recommendation */}
            {relatedProducts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2.5">
                  You May Also Like
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectRelated && onSelectRelated(item)}
                      className="group p-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer border border-gray-100"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 mb-1">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-[10px] font-black text-brand-500">Rs. {(item.price * 300).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
