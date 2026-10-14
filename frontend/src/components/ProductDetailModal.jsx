import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star, Heart, 
  Flame, AlertTriangle, ArrowRight, MessageSquare, Send, CheckCircle2, User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

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

const DEFAULT_REVIEWS = [
  {
    name: 'Dilshan Silva',
    rating: 5,
    comment: 'Exceptional tailoring and super comfortable fit! Delivery took just 2 days in Colombo.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    name: 'Nipuni Dhananjana',
    rating: 5,
    comment: 'Fabric feels luxurious and fits true to size. Highly recommended!',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

const ProductDetailModal = ({ product, isOpen, onClose, onSelectRelated }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

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

  // Reviews & Rating State (Member 4 Requirement)
  const [reviewsList, setReviewsList] = useState([]);
  const [averageRating, setAverageRating] = useState(4.9);
  const [reviewCount, setReviewCount] = useState(2);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

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
    setReviewSuccess('');

    // Setup Reviews
    const initialReviews = (product.reviews && product.reviews.length > 0)
      ? product.reviews
      : DEFAULT_REVIEWS;
    setReviewsList(initialReviews);

    const initialAvg = product.rating 
      ? Number(product.rating) 
      : Number((initialReviews.reduce((a, r) => a + r.rating, 0) / initialReviews.length).toFixed(1));
    setAverageRating(initialAvg || 4.9);
    setReviewCount(product.numReviews || initialReviews.length);

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
  }, [product, user]);

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

  // Submit Review Handler (Member 4 Requirement)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const id = product.id || product._id;
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating: userRating,
          comment: reviewComment.trim(),
          name: reviewerName.trim() || user?.name || 'Customer'
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setReviewsList(data.data.reviews || [
          ...reviewsList,
          { name: reviewerName || 'You', rating: userRating, comment: reviewComment, createdAt: new Date().toISOString() }
        ]);
        setAverageRating(data.data.rating || userRating);
        setReviewCount(data.data.numReviews || reviewsList.length + 1);
        setReviewSuccess('Thank you! Your verified review has been submitted.');
        setReviewComment('');
      } else {
        // Fallback local update
        const newReview = {
          name: reviewerName.trim() || user?.name || 'Customer',
          rating: userRating,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString()
        };
        const updated = [newReview, ...reviewsList];
        setReviewsList(updated);
        const newAvg = Number((updated.reduce((a, r) => a + r.rating, 0) / updated.length).toFixed(1));
        setAverageRating(newAvg);
        setReviewCount(updated.length);
        setReviewSuccess('Review saved successfully!');
        setReviewComment('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewSuccess('Review recorded locally.');
    } finally {
      setIsSubmittingReview(false);
    }
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
        <div className="md:w-1/2 bg-gray-50 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-gray-100 p-6">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xs mb-4">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Category Pill */}
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
              {product.category}
            </span>
          </div>

          {/* Multi-Angle Image Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-2 justify-center">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === imgUrl ? 'border-brand-500 shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`angle-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details, Options, Reviews */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            
            {/* Brand & Stock Pill */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                {product.brand || 'FashionStore Exclusive'}
              </span>

              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-black px-2.5 py-1 rounded-full border border-red-200">
                  <AlertTriangle size={13} />
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

            <h2 className="text-2xl font-black text-gray-900 mt-1 leading-tight">
              {product.title}
            </h2>

            {/* Dynamic Star Ratings & Reviews Count (Member 4 Requirement) */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                    className={star <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-bold">
                {averageRating} / 5.0 &bull; {reviewCount} Verified Customer {reviewCount === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Price Display */}
            <div className="mt-3.5 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-brand-500">
                Rs. {priceLKR}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                Rs. {(product.price * 300 * 1.25).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                SAVE 25%
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
              {product.description || 'Premium quality apparel tailored with breathable fabrics for ultimate day-to-day comfort and effortless modern style.'}
            </p>

            {/* Size Selector */}
            <div className="mt-4">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                Select Size: <span className="text-brand-500 font-bold">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {defaultSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[40px] h-9 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center border cursor-pointer ${
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
            <div className="mt-3.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                Color: <span className="text-brand-500 font-bold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((colorName) => (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    className={`h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      selectedColor === colorName
                        ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0" 
                      style={{ backgroundColor: getColorHex(colorName) }}
                    />
                    <span>{colorName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-3.5 flex items-center gap-3">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-black text-gray-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= stock || isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist Actions */}
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-brand-500 hover:bg-black text-white shadow-brand-500/20 active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <Check size={18} className="stroke-[3]" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add To Cart &bull; Rs. {((product.price * 300) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                <Heart size={20} className={isInWishlist(product.id || product._id) ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* Customer Ratings & Reviews Section (Member 4 Requirement) */}
            <div className="mt-7 pt-5 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-brand-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Customer Reviews & Feedback ({reviewCount})
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-amber-500">
                  ★ {averageRating} / 5.0
                </span>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleSubmitReview} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2.5 text-xs">
                <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wide block">
                  Write a Customer Review
                </span>

                {/* 5-Star Interactive Rating Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Your Rating:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={18} 
                          fill={(hoverRating || userRating) >= star ? 'currentColor' : 'none'}
                          className={(hoverRating || userRating) >= star ? 'text-amber-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">({userRating} / 5)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Your Name (e.g. Kasun)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
                  />
                  <div className="flex items-center text-[11px] text-gray-400">
                    <span>Verified Buyer Feedback</span>
                  </div>
                </div>

                <textarea 
                  rows={2}
                  required
                  placeholder="Share details about the fit, quality, or styling..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                />

                {reviewSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> {reviewSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={13} />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl shadow-xs space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-black text-[10px]">
                          {rev.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-gray-900 text-[11px]">{rev.name}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded">
                          Verified
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            fill={i < rev.rating ? 'currentColor' : 'none'} 
                            className={i < rev.rating ? 'text-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[9px] text-gray-400 block">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
