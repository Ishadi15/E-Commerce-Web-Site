import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User as UserIcon, Heart, Menu, X, Package, LogOut, ChevronRight } from 'lucide-react';
import ProductCatalog from './components/ProductCatalog';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import MyOrdersModal from './components/MyOrdersModal';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, loading, logout } = useAuth();
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    color: '',
    maxPrice: 300
  });

  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    const closeDropdown = () => setIsProfileDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [isProfileDropdownOpen]);

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, category }));
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 80, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 80, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    setLastPlacedOrder(order);
    setIsOrderSuccessOpen(true);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white relative bg-[#f8f9fa] flex flex-col justify-between">
      
      {/* Top Bar Announcement */}
      <div className="bg-brand-500 text-white text-[11px] sm:text-xs font-bold py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2">
        <span>✨ FREE DELIVERY ON ALL ISLANDWIDE ORDERS ABOVE RS. 5,000/-</span>
      </div>

      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden text-gray-700 hover:text-black p-1 cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              onClick={() => { setFilters({ category: '', size: '', color: '', maxPrice: 300 }); setSearchQuery(''); setSearchInput(''); }}
              className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase cursor-pointer select-none"
            >
              FASHION<span className="text-brand-500">STORE</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-xl mx-6 relative">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for dresses, shirts, jackets, shoes..." 
              className="w-full bg-gray-100 border border-gray-200 text-xs sm:text-sm rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 font-medium"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-brand-500 rounded-full transition-colors cursor-pointer"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6 text-gray-800">
            
            {/* User Profile / Auth Button */}
            <div className="relative">
              {user ? (
                <div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                    className="flex items-center gap-2 p-1 hover:text-brand-500 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-black text-xs border border-brand-500/30">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 px-3 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="border-b border-gray-100 pb-3 mb-2 px-2">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-black text-gray-900 mt-0.5 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsMyOrdersOpen(true);
                        }}
                        className="w-full text-left py-2 px-3 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
                      >
                        <Package size={16} className="text-brand-500" />
                        <span>My Orders</span>
                      </button>

                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left py-2 px-3 hover:bg-red-50 text-xs font-bold text-red-600 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer mt-1"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 hover:border-brand-500 hover:text-brand-500 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-white"
                >
                  <UserIcon size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-800 hover:text-brand-500 transition-colors cursor-pointer flex items-center"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-gray-100 border border-gray-200 text-xs rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-brand-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex justify-center border-t border-gray-100">
          <ul className="flex gap-8 text-xs font-bold text-gray-700 uppercase tracking-wider py-3">
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, 'Women')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Women' ? 'text-brand-500 font-black' : ''}`}>
                Ladies
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, 'Men')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Men' ? 'text-brand-500 font-black' : ''}`}>
                Gents
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, 'Kids')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Kids' ? 'text-brand-500 font-black' : ''}`}>
                Kids
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, 'Accessories')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Accessories' ? 'text-brand-500 font-black' : ''}`}>
                Accessories
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, 'Footwear')} className={`hover:text-brand-500 transition-colors ${filters.category === 'Footwear' ? 'text-brand-500 font-black' : ''}`}>
                Footwear
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleCategoryClick(e, '')} className={`hover:text-brand-500 transition-colors ${filters.category === '' ? 'text-brand-500 font-black' : ''}`}>
                All Outfits
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-black text-lg uppercase tracking-tight">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-gray-500"><X size={20} /></button>
              </div>

              <div className="mt-4 space-y-3 text-sm font-bold uppercase tracking-wider text-gray-800">
                {['Women', 'Men', 'Kids', 'Accessories', 'Footwear'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={(e) => handleCategoryClick(e, cat)}
                    className="w-full text-left py-2 hover:text-brand-500 flex justify-between items-center"
                  >
                    <span>{cat}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
                <button 
                  onClick={(e) => handleCategoryClick(e, '')}
                  className="w-full text-left py-2 hover:text-brand-500 flex justify-between items-center"
                >
                  <span>View All</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-700 truncate">Hi, {user.name}</p>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setIsMyOrdersOpen(true); }}
                    className="w-full py-2 bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-800"
                  >
                    My Orders
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                  className="w-full py-3 bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <ProductCatalog 
          filters={filters} 
          setFilters={setFilters} 
          searchQuery={searchQuery}
          onProductSelect={(product) => setSelectedProduct(product)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-xs py-14 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="text-2xl font-black tracking-tighter text-white uppercase mb-3">
              FASHION<span className="text-brand-500">STORE</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              Sri Lanka's leading fashion e-commerce destination for curated ladies, gents, and kids collections.
            </p>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-xs">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Women')} className="hover:text-white transition-colors">Ladies Wear</a></li>
              <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Men')} className="hover:text-white transition-colors">Gents Collection</a></li>
              <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Kids')} className="hover:text-white transition-colors">Kids & Baby</a></li>
              <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Footwear')} className="hover:text-white transition-colors">Footwear & Kicks</a></li>
              <li><a href="#" onClick={(e) => handleCategoryClick(e, 'Accessories')} className="hover:text-white transition-colors">Fashion Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-xs">Customer Support</h4>
            <ul className="space-y-2">
              <li><span>Helpline: +94 11 234 5678</span></li>
              <li><span>Email: support@fashionstore.lk</span></li>
              <li><span>Delivery: Islandwide Delivery</span></li>
              <li><span>Returns: 7-Day Exchange Policy</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-xs">Secure Payments</h4>
            <p className="text-gray-400 mb-3">We accept Cash on Delivery and online card payments islandwide.</p>
            <div className="flex gap-2">
              <span className="bg-gray-800 text-gray-300 font-bold px-2.5 py-1 rounded text-[10px]">VISA</span>
              <span className="bg-gray-800 text-gray-300 font-bold px-2.5 py-1 rounded text-[10px]">MASTERCARD</span>
              <span className="bg-brand-500 text-white font-bold px-2.5 py-1 rounded text-[10px]">CASH ON DELIVERY</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800/80 text-center text-[11px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} FASHION STORE (PVT) LTD. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <CartSidebar 
        onProceedToCheckout={() => setIsCheckoutOpen(true)} 
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal 
        isOpen={isOrderSuccessOpen} 
        order={lastPlacedOrder} 
        onClose={() => setIsOrderSuccessOpen(false)} 
      />

      <MyOrdersModal 
        isOpen={isMyOrdersOpen} 
        onClose={() => setIsMyOrdersOpen(false)} 
      />

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
