import React, { useState, useEffect } from 'react';
import { Filter, ShoppingCart, Check, Eye, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const fallbackMockProducts = [
  // Men
  { id: 'm1', title: 'Classic White Tee', price: 29.99, category: 'Men', color: 'White', size: 'M', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60' },
  { id: 'm2', title: 'Urban Graphic Hoodie', price: 65.00, category: 'Men', color: 'Black', size: 'XL', sizes: ['M', 'L', 'XL'], colors: ['Black'], image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=60' },
  { id: 'm3', title: 'Casual Denim Button-Down', price: 45.00, category: 'Men', color: 'Blue', size: 'L', sizes: ['S', 'M', 'L'], colors: ['Blue'], image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&q=60' },
  { id: 'm4', title: 'Slim Fit Stretch Chinos', price: 55.00, category: 'Men', color: 'Beige', size: 'M', sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige'], image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=60' },
  { id: 'm5', title: 'Navy Blue Tailored Blazer', price: 150.00, category: 'Men', color: 'Navy', size: 'L', sizes: ['M', 'L', 'XL'], colors: ['Navy'], image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=60' },

  // Women
  { id: 'w1', title: 'Vintage Trucker Denim Jacket', price: 89.99, category: 'Women', color: 'Blue', size: 'S', sizes: ['XS', 'S', 'M', 'L'], colors: ['Blue'], image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=60' },
  { id: 'w2', title: 'Summer Floral Wrap Dress', price: 59.99, category: 'Women', color: 'Red', size: 'M', sizes: ['S', 'M', 'L'], colors: ['Red'], image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=60' },
  { id: 'w3', title: 'Elegant Midnight Evening Gown', price: 199.99, category: 'Women', color: 'Black', size: 'M', sizes: ['XS', 'S', 'M'], colors: ['Black'], image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&q=60' },
  { id: 'w4', title: 'High-Waist Ankle Flare Jeans', price: 75.00, category: 'Women', color: 'Light Blue', size: 'S', sizes: ['S', 'M', 'L'], colors: ['Light Blue'], image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=60' },
  { id: 'w5', title: 'Silk Satin Collared Blouse', price: 65.00, category: 'Women', color: 'White', size: 'S', sizes: ['XS', 'S', 'M', 'L'], colors: ['White'], image: 'https://images.unsplash.com/photo-1603570222045-927513106584?auto=format&fit=crop&w=500&q=60' },

  // Kids
  { id: 'k1', title: 'Cartoon Print Cotton Tee', price: 15.99, category: 'Kids', color: 'Yellow', size: 'S', sizes: ['S', 'M', 'L'], colors: ['Yellow'], image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=500&q=60' },
  { id: 'k2', title: 'Cute Denim Overalls', price: 34.99, category: 'Kids', color: 'Blue', size: 'M', sizes: ['S', 'M', 'L'], colors: ['Blue'], image: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?auto=format&fit=crop&w=500&q=60' },
  { id: 'k3', title: 'Cozy Winter Puffer Jacket', price: 45.00, category: 'Kids', color: 'Red', size: 'L', sizes: ['M', 'L', 'XL'], colors: ['Red'], image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=500&q=60' },

  // Accessories
  { id: 'a1', title: 'Handcrafted Full-Grain Leather Belt', price: 35.00, category: 'Accessories', color: 'Brown', size: 'L', sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown'], image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=60' },
  { id: 'a2', title: 'Polarized Aviator Sunglasses', price: 125.00, category: 'Accessories', color: 'Gold', size: 'One Size', sizes: ['M'], colors: ['Gold'], image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=60' },
  { id: 'a3', title: 'Minimalist Stainless Steel Watch', price: 199.99, category: 'Accessories', color: 'Silver', size: 'One Size', sizes: ['M'], colors: ['Silver'], image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60' },

  // Footwear
  { id: 'f1', title: 'AeroGlide Running Shoes', price: 120.00, category: 'Footwear', color: 'Black', size: '10', sizes: ['M', 'L', 'XL'], colors: ['Black'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60' },
  { id: 'f2', title: 'All-Day Casual White Sneakers', price: 85.00, category: 'Footwear', color: 'White', size: '9', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=60' },
  { id: 'f3', title: 'Italian Hand-Stitched Loafers', price: 145.00, category: 'Footwear', color: 'Brown', size: '11', sizes: ['M', 'L', 'XL'], colors: ['Brown'], image: 'https://images.unsplash.com/photo-1614252235314-8561cd9ea1cb?auto=format&fit=crop&w=500&q=60' }
];

const categoryCircles = [
  { label: 'Ladies', val: 'Women', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80' },
  { label: 'Gents', val: 'Men', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
  { label: 'Kids', val: 'Kids', img: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?auto=format&fit=crop&w=300&q=80' },
  { label: 'Accessories', val: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  { label: 'Footwear', val: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' }
];

const ProductCatalog = ({ filters, setFilters, searchQuery, onProductSelect }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [addedItems, setAddedItems] = useState({});

  // Fetch products from backend with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery && searchQuery.trim() !== '') {
          queryParams.append('keyword', searchQuery.trim());
        }
        if (filters.category && filters.category !== '') {
          queryParams.append('category', filters.category);
        }
        if (filters.maxPrice) {
          queryParams.append('maxPrice', filters.maxPrice);
        }
        if (sortBy === 'price_asc') {
          queryParams.append('sort', 'price_asc');
        } else if (sortBy === 'price_desc') {
          queryParams.append('sort', 'price_desc');
        }

        const res = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Normalize product data
          const formatted = json.data.map(p => ({
            ...p,
            id: p._id,
            image: p.images?.[0]?.url || p.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60',
            size: p.sizes?.[0] || 'M',
            color: p.colors?.[0] || 'Standard'
          }));
          setProducts(formatted);
        } else {
          // If no backend products or search empty, use fallback filtered
          filterFallbackData();
        }
      } catch (err) {
        console.warn('Backend not reachable or error. Using fallback product dataset.', err);
        filterFallbackData();
      } finally {
        setLoading(false);
      }
    };

    const filterFallbackData = () => {
      let filtered = [...fallbackMockProducts];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      if (filters.category && filters.category !== '') {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.size && filters.size !== '') {
        filtered = filtered.filter(p => (p.sizes && p.sizes.includes(filters.size)) || p.size === filters.size);
      }
      if (filters.color && filters.color !== '') {
        filtered = filtered.filter(p => (p.colors && p.colors.includes(filters.color)) || p.color === filters.color);
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }
      if (sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      }
      setProducts(filtered);
    };

    fetchProducts();
  }, [filters, searchQuery, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearAllFilters = () => {
    setFilters({ category: '', size: '', color: '', maxPrice: 300 });
  };

  return (
    <div className="w-full">
      
      {/* Hero Fashion Banner */}
      <div className="w-full bg-slate-900 h-[320px] md:h-[420px] relative flex items-center justify-center overflow-hidden mb-12 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80" 
          alt="Fashion Hero Banner" 
          className="w-full h-full object-cover object-center absolute inset-0 filter brightness-90" 
        />
        <div className="absolute left-6 md:left-24 text-white z-20 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
              New Season 2026
            </span>
            <span className="text-xs font-semibold tracking-wider text-gray-200 hidden sm:inline">
              Exclusive Islandwide Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight uppercase tracking-tight">
            Elevate Your<br/>
            <span className="text-brand-500">Signature</span> Style
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 font-medium max-w-md hidden sm:block">
            Explore curated ladies, gents, kids wear & luxury footwear crafted with premium fabrics and modern tailoring.
          </p>
          <button 
            onClick={() => {
              window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 80, behavior: 'smooth' });
            }}
            className="bg-brand-500 hover:bg-red-700 text-white px-8 py-3.5 font-bold uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-brand-500/30 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Shop The Collection</span>
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" id="products-section">
        
        {/* Shop By Category Circles */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900 inline-block relative pb-2">
              Shop By Category
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brand-500 rounded-full"></span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Select a category to filter your favorite outfits</p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 md:gap-10">
            {categoryCircles.map(cat => (
              <div 
                key={cat.label} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  const newCat = filters.category === cat.val ? '' : cat.val;
                  setFilters(prev => ({ ...prev, category: newCat }));
                }}
              >
                <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-2.5 transition-all duration-300 relative p-1 ${
                  filters.category === cat.val 
                    ? 'ring-4 ring-brand-500 scale-105 shadow-lg' 
                    : 'ring-2 ring-gray-200 group-hover:ring-brand-500/60 group-hover:scale-105'
                }`}>
                  <img 
                    src={cat.img} 
                    alt={cat.label} 
                    className="w-full h-full object-cover rounded-full"
                  />
                  {filters.category === cat.val && (
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full flex items-center justify-center">
                      <span className="bg-brand-500 text-white p-1 rounded-full"><Check size={14} className="stroke-[3]" /></span>
                    </div>
                  )}
                </div>
                <span className={`font-bold text-xs uppercase tracking-wider transition-colors ${
                  filters.category === cat.val ? 'text-brand-500 font-black' : 'text-gray-700 group-hover:text-brand-500'
                }`}>
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section: Sidebar Filters + Products Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Side Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm sticky top-28 space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-gray-900 font-black text-xs uppercase tracking-widest">
                  <Filter size={16} className="text-brand-500" />
                  <span>Filters</span>
                </div>
                {(filters.category || filters.size || filters.color || filters.maxPrice < 300) && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-brand-500 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Category</label>
                <select 
                  name="category" 
                  value={filters.category} 
                  onChange={handleFilterChange} 
                  className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Men">Men (Gents)</option>
                  <option value="Women">Women (Ladies)</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Size</label>
                <div className="flex flex-wrap gap-1.5">
                  {['', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, size: prev.size === sz ? '' : sz }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        filters.size === sz
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sz === '' ? 'All' : sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Max Price</label>
                  <span className="text-brand-500 font-black text-xs">
                    Rs. {(filters.maxPrice * 300).toLocaleString('en-US')}
                  </span>
                </div>
                <input 
                  type="range" 
                  name="maxPrice" 
                  min="20" 
                  max="300" 
                  step="10"
                  value={filters.maxPrice} 
                  onChange={handleFilterChange}
                  className="w-full accent-brand-500 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                  <span>Rs. 6,000</span>
                  <span>Rs. 90,000</span>
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            
            {/* Header info bar */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase text-gray-900 tracking-wide">
                  {filters.category ? `${filters.category} Collection` : 'All Products'}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {products.length} Items
                </span>
                {searchQuery && (
                  <span className="text-xs text-brand-500 font-semibold italic">
                    Matching "{searchQuery}"
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-bold">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="featured">Featured / Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products List */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Eye size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 mb-6">Try adjusting your filters or search keywords.</p>
                <button 
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-brand-500 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => {
                  const priceLKR = (product.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2 });
                  const productId = product.id || product._id;
                  const isRecentlyAdded = addedItems[productId];

                  return (
                    <div 
                      key={productId} 
                      onClick={() => onProductSelect && onProductSelect(product)}
                      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-500/40 hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer"
                    >
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-md z-10 shadow-sm">
                        {product.category}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full z-10 transition-all cursor-pointer shadow-md ${
                          isInWishlist(productId)
                            ? 'bg-red-500 text-white shadow-red-500/30'
                            : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 hover:scale-110'
                        }`}
                        title={isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart size={14} className={isInWishlist(productId) ? 'fill-white' : ''} />
                      </button>

                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        {/* Hover Overlay Quick-View */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                            <Eye size={14} /> Quick View
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        {product.brand && (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                            {product.brand}
                          </span>
                        )}
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-brand-500 transition-colors">
                          {product.title}
                        </h3>

                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-brand-500 font-black text-sm sm:text-base">
                            Rs. {priceLKR}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {product.sizes?.join(', ') || 'All Sizes'}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                            setAddedItems(prev => ({ ...prev, [productId]: true }));
                            setTimeout(() => {
                              setAddedItems(prev => ({ ...prev, [productId]: false }));
                            }, 1800);
                          }}
                          className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isRecentlyAdded
                              ? 'bg-green-600 text-white shadow-md' 
                              : 'bg-gray-100 hover:bg-brand-500 hover:text-white text-gray-900 active:scale-[0.98]'
                          }`}
                        >
                          {isRecentlyAdded ? (
                            <>
                              <Check size={14} className="stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCatalog;
