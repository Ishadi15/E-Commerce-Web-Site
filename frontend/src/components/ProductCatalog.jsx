import React, { useState, useEffect } from 'react';
import { Filter, ShoppingCart, Check, Eye, Sparkles, Heart, ChevronDown, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const fallbackMockProducts = [
  // Men
  { id: 'm1', title: 'Classic White Tee', price: 29.99, category: 'Men', color: 'White', size: 'M', sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], countInStock: 25, brand: 'FashionStore Originals', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60' },
  { id: 'm2', title: 'Urban Graphic Hoodie', price: 65.00, category: 'Men', color: 'Black', size: 'XL', sizes: ['M', 'L', 'XL'], colors: ['Black'], countInStock: 4, brand: 'StreetVibe', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=60' },
  { id: 'm3', title: 'Casual Denim Button-Down', price: 45.00, category: 'Men', color: 'Blue', size: 'L', sizes: ['S', 'M', 'L'], colors: ['Blue'], countInStock: 12, brand: 'FashionStore Originals', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&q=60' },
  { id: 'm4', title: 'Slim Fit Stretch Chinos', price: 55.00, category: 'Men', color: 'Beige', size: 'M', sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige'], countInStock: 18, brand: 'UrbanTailor', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=60' },
  { id: 'm5', title: 'Navy Blue Tailored Blazer', price: 150.00, category: 'Men', color: 'Navy', size: 'L', sizes: ['M', 'L', 'XL'], colors: ['Navy'], countInStock: 0, brand: 'SavileRow', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=60' },

  // Women
  { id: 'w1', title: 'Vintage Trucker Denim Jacket', price: 89.99, category: 'Women', color: 'Blue', size: 'S', sizes: ['XS', 'S', 'M', 'L'], colors: ['Blue'], countInStock: 14, brand: 'VintageDenim', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=60' },
  { id: 'w2', title: 'Summer Floral Wrap Dress', price: 59.99, category: 'Women', color: 'Red', size: 'M', sizes: ['S', 'M', 'L'], colors: ['Red'], countInStock: 3, brand: 'BohoChic', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=60' },
  { id: 'w3', title: 'Elegant Midnight Evening Gown', price: 199.99, category: 'Women', color: 'Black', size: 'M', sizes: ['XS', 'S', 'M'], colors: ['Black'], countInStock: 6, brand: 'LuxeAtelier', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&q=60' },
  { id: 'w4', title: 'High-Waist Ankle Flare Jeans', price: 75.00, category: 'Women', color: 'Blue', size: 'S', sizes: ['S', 'M', 'L'], colors: ['Blue'], countInStock: 10, brand: 'DenimCo', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=60' },
  { id: 'w5', title: 'Silk Satin Collared Blouse', price: 65.00, category: 'Women', color: 'White', size: 'S', sizes: ['XS', 'S', 'M', 'L'], colors: ['White'], countInStock: 16, brand: 'SilkTouch', image: 'https://images.unsplash.com/photo-1603570222045-927513106584?auto=format&fit=crop&w=500&q=60' },

  // Kids
  { id: 'k1', title: 'Cartoon Print Cotton Tee', price: 15.99, category: 'Kids', color: 'Yellow', size: 'S', sizes: ['S', 'M', 'L'], colors: ['Yellow'], countInStock: 22, brand: 'LittleStars', image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=500&q=60' },
  { id: 'k2', title: 'Cute Denim Overalls', price: 34.99, category: 'Kids', color: 'Blue', size: 'M', sizes: ['S', 'M', 'L'], colors: ['Blue'], countInStock: 7, brand: 'KidsPlay', image: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?auto=format&fit=crop&w=500&q=60' },
  { id: 'k3', title: 'Cozy Winter Puffer Jacket', price: 45.00, category: 'Kids', color: 'Red', size: 'L', sizes: ['M', 'L', 'XL'], colors: ['Red'], countInStock: 2, brand: 'WarmKids', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=500&q=60' },

  // Accessories
  { id: 'a1', title: 'Handcrafted Full-Grain Leather Belt', price: 35.00, category: 'Accessories', color: 'Brown', size: 'L', sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown'], countInStock: 30, brand: 'HeritageCraft', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=60' },
  { id: 'a2', title: 'Polarized Aviator Sunglasses', price: 125.00, category: 'Accessories', color: 'Gold', size: 'One Size', sizes: ['One Size'], colors: ['Gold'], countInStock: 15, brand: 'OpticLuxe', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=60' },
  { id: 'a3', title: 'Minimalist Stainless Steel Watch', price: 199.99, category: 'Accessories', color: 'Silver', size: 'One Size', sizes: ['One Size'], colors: ['Silver'], countInStock: 8, brand: 'ChronoClassic', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60' },

  // Footwear
  { id: 'f1', title: 'AeroGlide Running Shoes', price: 120.00, category: 'Footwear', color: 'Black', size: '10', sizes: ['8', '9', '10', '11'], colors: ['Black'], countInStock: 20, brand: 'StridePro', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60' },
  { id: 'f2', title: 'All-Day Casual White Sneakers', price: 85.00, category: 'Footwear', color: 'White', size: '9', sizes: ['7', '8', '9', '10'], colors: ['White'], countInStock: 25, brand: 'UrbanKicks', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=60' },
  { id: 'f3', title: 'Italian Hand-Stitched Loafers', price: 145.00, category: 'Footwear', color: 'Brown', size: '11', sizes: ['9', '10', '11'], colors: ['Brown'], countInStock: 5, brand: 'Milanese', image: 'https://images.unsplash.com/photo-1614252235314-8561cd9ea1cb?auto=format&fit=crop&w=500&q=60' }
];

const categoryCircles = [
  { label: 'Ladies', val: 'Women', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80' },
  { label: 'Gents', val: 'Men', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
  { label: 'Kids', val: 'Kids', img: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?auto=format&fit=crop&w=300&q=80' },
  { label: 'Accessories', val: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  { label: 'Footwear', val: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' }
];

const COLOR_OPTIONS = [
  { name: '', label: 'All', hex: '#E5E7EB' },
  { name: 'Black', label: 'Black', hex: '#111827' },
  { name: 'White', label: 'White', hex: '#FFFFFF', border: true },
  { name: 'Blue', label: 'Blue', hex: '#2563EB' },
  { name: 'Red', label: 'Red', hex: '#DC2626' },
  { name: 'Beige', label: 'Beige', hex: '#D2B48C' },
  { name: 'Yellow', label: 'Yellow', hex: '#EAB308' },
  { name: 'Brown', label: 'Brown', hex: '#78350F' },
];

const ProductCatalog = ({ filters, setFilters, searchQuery, onProductSelect }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [addedItems, setAddedItems] = useState({});
  const [visibleCount, setVisibleCount] = useState(8); // Pagination: 8 items initially

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
        if (filters.color && filters.color !== '') {
          queryParams.append('color', filters.color);
        }
        if (filters.inStock) {
          queryParams.append('inStock', 'true');
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
            color: p.colors?.[0] || 'Standard',
            countInStock: p.countInStock !== undefined ? p.countInStock : 15
          }));
          setProducts(formatted);
        } else {
          // Fallback filtered data
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
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
      }
      if (filters.category && filters.category !== '') {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.size && filters.size !== '') {
        filtered = filtered.filter(p => (p.sizes && p.sizes.includes(filters.size)) || p.size === filters.size);
      }
      if (filters.color && filters.color !== '') {
        filtered = filtered.filter(p => (p.colors && p.colors.some(c => c.toLowerCase() === filters.color.toLowerCase())) || (p.color && p.color.toLowerCase() === filters.color.toLowerCase()));
      }
      if (filters.inStock) {
        filtered = filtered.filter(p => p.countInStock > 0);
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
    setVisibleCount(8); // Reset pagination on filter change
  };

  const clearAllFilters = () => {
    setFilters({ category: '', size: '', color: '', inStock: false, maxPrice: 300 });
    setVisibleCount(8);
  };

  const displayedProducts = products.slice(0, visibleCount);

  return (
    <div className="w-full">
      
      {/* Hero Showcase Banner */}
      <div className="w-full bg-gray-900 h-[320px] md:h-[450px] relative flex items-center justify-center overflow-hidden mb-12 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80" 
          alt="Fashion Sale Banner" 
          className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-1000 ease-out" 
        />
        <div className="absolute left-6 md:left-24 text-white z-20 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 border border-brand-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} /> New Season Arrivals
          </div>
          <h1 className="text-3xl md:text-6xl font-black mb-4 leading-none uppercase tracking-tight">
            Discover Your<br/><span className="text-brand-500">Signature</span> Style
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mb-6 max-w-md font-medium leading-relaxed">
            Elevate your wardrobe with authentic, trendsetting fashion pieces crafted for everyday elegance and durability.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 80, behavior: 'smooth' })}
            className="bg-white text-black px-8 py-3.5 font-black uppercase text-xs tracking-wider rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-xl hover:shadow-brand-500/30 cursor-pointer active:scale-95"
          >
            Explore Catalog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" id="products-section">
        
        {/* Shop By Category Circles */}
        <div className="mb-14 text-center">
          <div className="inline-block relative">
            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 pb-2">
              Shop By Category
            </h2>
            <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8">
            {categoryCircles.map(cat => (
              <div 
                key={cat.label} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: prev.category === cat.val ? '' : cat.val }));
                  setVisibleCount(8);
                  window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 80, behavior: 'smooth' });
                }}
              >
                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-2 overflow-hidden mb-2.5 transition-all relative ${
                  filters.category === cat.val 
                    ? 'border-brand-500 ring-4 ring-brand-500/20 scale-105' 
                    : 'border-gray-200 group-hover:border-brand-500 group-hover:scale-105'
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
                {(filters.category || filters.size || filters.color || filters.inStock || filters.maxPrice < 300) && (
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

              {/* Color Filter Swatches */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Color
                  </label>
                  {filters.color && (
                    <span className="text-[10px] font-black text-brand-500">{filters.color}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = filters.color === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, color: prev.color === c.name ? '' : c.name }));
                          setVisibleCount(8);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {c.hex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                        )}
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Size</label>
                <div className="flex flex-wrap gap-1.5">
                  {['', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, size: prev.size === sz ? '' : sz }));
                        setVisibleCount(8);
                      }}
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

              {/* In-Stock Filter Toggle */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer" htmlFor="inStockToggle">
                  In Stock Only
                </label>
                <input
                  id="inStockToggle"
                  type="checkbox"
                  checked={!!filters.inStock}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, inStock: e.target.checked }));
                    setVisibleCount(8);
                  }}
                  className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
                />
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
                  {products.length} Items Available
                </span>
                {searchQuery && (
                  <span className="text-xs text-brand-500 font-semibold italic">
                    Matching "{searchQuery}"
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl py-2 px-3 focus:outline-none focus:border-brand-500 text-gray-800 cursor-pointer"
                >
                  <option value="featured">Featured / Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 animate-pulse space-y-3">
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
                <p className="text-xs text-gray-500 mb-6">Try adjusting your color, category, or price filters.</p>
                <button 
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-brand-500 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.map(product => {
                    const priceLKR = (product.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2 });
                    const productId = product.id || product._id;
                    const isRecentlyAdded = addedItems[productId];
                    const stock = product.countInStock !== undefined ? Number(product.countInStock) : 15;
                    const isOutOfStock = stock <= 0;
                    const isLowStock = stock > 0 && stock <= 5;

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

                        {/* Inventory / Stock Badge */}
                        {isOutOfStock ? (
                          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow z-10">
                            Out of Stock
                          </div>
                        ) : isLowStock ? (
                          <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow z-10 flex items-center gap-1">
                            <Flame size={11} /> Only {stock} Left
                          </div>
                        ) : null}

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
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isOutOfStock) return;
                              addToCart(product);
                              setAddedItems(prev => ({ ...prev, [productId]: true }));
                              setTimeout(() => {
                                setAddedItems(prev => ({ ...prev, [productId]: false }));
                              }, 1800);
                            }}
                            className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                              isOutOfStock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : isRecentlyAdded
                                ? 'bg-emerald-600 text-white shadow-md cursor-pointer' 
                                : 'bg-gray-100 hover:bg-brand-500 hover:text-white text-gray-900 active:scale-[0.98] cursor-pointer'
                            }`}
                          >
                            {isOutOfStock ? (
                              <span>Out of Stock</span>
                            ) : isRecentlyAdded ? (
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

                {/* Pagination / Load More Button */}
                {products.length > visibleCount && (
                  <div className="mt-12 text-center flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Showing {displayedProducts.length} of {products.length} products
                    </p>
                    <button
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-8 py-3.5 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
                    >
                      <span>Load More Products</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCatalog;
