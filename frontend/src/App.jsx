import React from 'react';
import { ShoppingBag, Search, User, Heart, Menu } from 'lucide-react';
import ProductCatalog from './components/ProductCatalog';
import CartSidebar from './components/CartSidebar';
import { CartProvider, useCart } from './context/CartContext';

function AppContent() {
  const { cartCount, setIsCartOpen } = useCart();
  const [filters, setFilters] = React.useState({
    category: '',
    size: '',
    color: '',
    maxPrice: 300
  });

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, category }));
    // Scroll to products
    window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden bg-[#f8f9fa]">
      {/* Top Bar */}
      <div className="bg-brand-500 text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        FREE DELIVERY ON ALL ORDERS ABOVE RS. 5,000/- Island wide!
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-800"><Menu size={24} /></button>
            <div className="text-3xl font-black tracking-tighter text-black uppercase">
              FASHION<span className="text-brand-500">STORE</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="w-full bg-gray-100 border border-gray-200 text-sm rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-500">
              <Search size={18} />
            </button>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-6 text-gray-800">
            <button className="hidden sm:flex flex-col items-center gap-1 hover:text-brand-500 transition-colors">
              <User size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
            </button>
            <button className="hidden sm:flex flex-col items-center gap-1 hover:text-brand-500 transition-colors">
              <Heart size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center gap-1 hover:text-brand-500 transition-colors"
            >
              <ShoppingBag size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-brand-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="hidden lg:flex justify-center border-t border-gray-100">
          <ul className="flex gap-8 text-sm font-bold text-gray-800 uppercase tracking-wide py-3">
            <li><a href="#" onClick={(e) => handleCategoryClick(e, '')} className={`hover:text-brand-500 transition-colors ${filters.category === '' ? 'text-brand-500' : ''}`}>All</a></li>
            <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Women')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Women' ? 'text-brand-500' : ''}`}>Ladies</a></li>
            <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Men')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Men' ? 'text-brand-500' : ''}`}>Gents</a></li>
            <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Kids')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Kids' ? 'text-brand-500' : ''}`}>Kids</a></li>
            <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Footwear')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Footwear' ? 'text-brand-500' : ''}`}>Footwear</a></li>
            <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Accessories')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Accessories' ? 'text-brand-500' : ''}`}>Accessories</a></li>
            <li><a href="#" className="text-brand-500 hover:text-red-700 transition-colors">Offers</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <ProductCatalog filters={filters} setFilters={setFilters} />
      </main>

      <footer className="bg-gray-900 py-16 mt-20 text-center text-gray-400 text-sm">
        <p>&copy; 2026 FASHION STORE. All rights reserved.</p>
      </footer>
      
      <CartSidebar />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
