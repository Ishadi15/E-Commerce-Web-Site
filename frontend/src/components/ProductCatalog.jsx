import React, { useState } from 'react';
import { Filter, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const mockProducts = [
  // Men
  { id: 1, title: 'Classic White Tee', price: 29.99, category: 'Men', color: 'White', size: 'M', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 6, title: 'Graphic Hoodie', price: 65.00, category: 'Men', color: 'Black', size: 'XL', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 7, title: 'Casual Denim Shirt', price: 45.00, category: 'Men', color: 'Blue', size: 'L', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 8, title: 'Slim Fit Chinos', price: 55.00, category: 'Men', color: 'Beige', size: '32', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 9, title: 'Navy Blue Blazer', price: 150.00, category: 'Men', color: 'Navy', size: 'L', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },

  // Women
  { id: 2, title: 'Denim Jacket', price: 89.99, category: 'Women', color: 'Blue', size: 'S', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 4, title: 'Summer Floral Dress', price: 59.99, category: 'Women', color: 'Red', size: 'M', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 10, title: 'Elegant Evening Gown', price: 199.99, category: 'Women', color: 'Black', size: 'M', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 11, title: 'High-Waist Jeans', price: 75.00, category: 'Women', color: 'Light Blue', size: '28', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 12, title: 'Silk Blouse', price: 65.00, category: 'Women', color: 'White', size: 'S', image: 'https://images.unsplash.com/photo-1603570222045-927513106584?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },

  // Kids
  { id: 13, title: 'Cartoon Print T-Shirt', price: 15.99, category: 'Kids', color: 'Yellow', size: 'S', image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 14, title: 'Cute Denim Overalls', price: 34.99, category: 'Kids', color: 'Blue', size: 'M', image: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 15, title: 'Kids Winter Jacket', price: 45.00, category: 'Kids', color: 'Red', size: 'L', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 16, title: 'Colorful Cotton Shorts', price: 19.99, category: 'Kids', color: 'Green', size: 'S', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 17, title: 'Little Princess Dress', price: 39.99, category: 'Kids', color: 'Pink', size: 'M', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },

  // Accessories
  { id: 5, title: 'Vintage Leather Belt', price: 35.00, category: 'Accessories', color: 'Brown', size: 'L', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 18, title: 'Classic Aviator Sunglasses', price: 125.00, category: 'Accessories', color: 'Gold', size: 'One Size', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 19, title: 'Minimalist Watch', price: 199.99, category: 'Accessories', color: 'Silver', size: 'One Size', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 20, title: 'Silk Printed Scarf', price: 29.99, category: 'Accessories', color: 'Multi', size: 'One Size', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 21, title: 'Canvas Tote Bag', price: 45.00, category: 'Accessories', color: 'Beige', size: 'One Size', image: 'https://images.unsplash.com/photo-1597633244018-723f5b721e78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },

  // Footwear
  { id: 3, title: 'Black Running Shoes', price: 120.00, category: 'Footwear', color: 'Black', size: '10', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 22, title: 'White Casual Sneakers', price: 85.00, category: 'Footwear', color: 'White', size: '9', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 23, title: 'Elegant Leather Loafers', price: 145.00, category: 'Footwear', color: 'Brown', size: '11', image: 'https://images.unsplash.com/photo-1614252235314-8561cd9ea1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 24, title: "Women's Ankle Boots", price: 110.00, category: 'Footwear', color: 'Black', size: '7', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 25, title: 'Summer Comfort Sandals', price: 45.00, category: 'Footwear', color: 'Tan', size: '8', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

const ProductCatalog = ({ filters, setFilters }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(mockProducts);
  const [addedItems, setAddedItems] = useState({}); // To track UI feedback per item

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter(product => {
    return (
      (filters.category === '' || product.category === filters.category) &&
      (filters.size === '' || product.size === filters.size) &&
      (filters.color === '' || product.color === filters.color) &&
      (product.price <= filters.maxPrice)
    );
  });

  return (
    <div className="w-full">
      {/* Hero Banner Placeholder */}
      <div className="w-full bg-gray-200 h-[300px] md:h-[400px] relative flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent"></div>
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Sale Banner" className="w-full h-full object-cover" />
        <div className="absolute left-8 md:left-24 text-white z-10 max-w-lg">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-brand-500">New Arrivals</h2>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase">Discover Your<br/>Perfect Style</h1>
          <button className="bg-white text-black px-8 py-3 font-bold uppercase text-sm tracking-wider hover:bg-brand-500 hover:text-white transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" id="products-section">
        
        {/* Shop By Category Circles */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center uppercase tracking-wide mb-8 border-b border-gray-200 pb-4 inline-block relative left-1/2 -translate-x-1/2">
            Shop By Category
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-500"></div>
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { label: 'Ladies', val: 'Women' }, 
              { label: 'Gents', val: 'Men' }, 
              { label: 'Kids', val: 'Kids' }, 
              { label: 'Footwear', val: 'Footwear' }
            ].map(cat => (
              <div 
                key={cat.label} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: cat.val }));
                  window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 100, behavior: 'smooth' });
                }}
              >
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border bg-gray-100 flex items-center justify-center overflow-hidden mb-3 transition-colors ${filters.category === cat.val ? 'border-brand-500 border-2' : 'border-gray-200 group-hover:border-brand-500'}`}>
                  <span className="text-gray-400">Image</span>
                </div>
                <span className={`font-bold text-sm uppercase tracking-wide transition-colors ${filters.category === cat.val ? 'text-brand-500' : 'group-hover:text-brand-500'}`}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Top/Side Filters - Simplified for Retail */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 border border-gray-200 shadow-sm sticky top-36">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <Filter size={18} className="text-gray-900" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filter By</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded p-2.5 text-sm focus:border-brand-500 focus:ring-0">
                    <option value="">All Categories</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Size</label>
                  <select name="size" value={filters.size} onChange={handleFilterChange} className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded p-2.5 text-sm focus:border-brand-500 focus:ring-0">
                    <option value="">All Sizes</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="10">10</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Max Price</label>
                    <span className="text-gray-900 font-bold text-sm">Rs. {(filters.maxPrice * 300).toLocaleString('en-US')}</span>
                  </div>
                  <input 
                    type="range" 
                    name="maxPrice" 
                    min="0" 
                    max="300" 
                    value={filters.maxPrice} 
                    onChange={handleFilterChange}
                    className="w-full accent-brand-500 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wide">Trending Now</h2>
              <span className="text-sm text-gray-500">{filteredProducts.length} Products</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({category: '', size: '', color: '', maxPrice: 200})}
                  className="mt-4 px-8 py-3 bg-brand-500 text-white font-bold uppercase text-sm tracking-wider hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col relative">
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-brand-500 text-white text-[10px] font-bold uppercase px-2 py-1 z-10">
                      New
                    </div>

                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1 text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-brand-500 cursor-pointer line-clamp-2">{product.title}</h3>
                      <div className="text-brand-500 font-bold text-lg mb-4">Rs. {(product.price * 300).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          setAddedItems(prev => ({...prev, [product.id]: true}));
                          setTimeout(() => {
                            setAddedItems(prev => ({...prev, [product.id]: false}));
                          }, 2000);
                        }}
                        className={`mt-auto w-full py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                          addedItems[product.id] 
                            ? 'bg-green-600 text-white border-green-600' 
                            : 'bg-white text-gray-900 border-gray-300 hover:bg-brand-500 hover:text-white hover:border-brand-500'
                        }`}
                      >
                        {addedItems[product.id] ? 'Added to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
