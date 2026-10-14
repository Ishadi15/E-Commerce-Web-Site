import React, { useState, useEffect } from 'react';
import { 
  X, BarChart3, Package, ShoppingCart, AlertTriangle, TrendingUp, 
  Plus, Edit, Trash2, CheckCircle2, Clock, Truck, ShieldAlert,
  Search, RefreshCw, FileText, ChevronRight, Eye, Sparkles, Filter,
  ArrowUpRight, ArrowDownRight, Layers, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from './InvoiceModal';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
];

const AdminDashboardModal = ({ isOpen, onClose }) => {
  const { user, token, login } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'orders'
  
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    price: 35,
    category: 'Women',
    brand: 'FashionStore Originals',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White'],
    countInStock: 20,
    imageUrl: PRESET_IMAGES[0]
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Status notification
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeToken}`
    };
  };

  const showNotification = (text, type = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage({ text: '', type: '' }), 3500);
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setIsAnalyticsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const url = orderStatusFilter === 'All' 
        ? 'http://localhost:5000/api/orders' 
        : `http://localhost:5000/api/orders?status=${orderStatusFilter}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      fetchProducts();
      fetchOrders();
    }
  }, [isOpen, activeTab, orderStatusFilter]);

  // Quick Restock Handler
  const handleQuickRestock = async (productId, addStock) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${productId}/stock`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ addStock })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Restocked successfully! (+${addStock} units)`);
        fetchAnalytics();
        fetchProducts();
      } else {
        showNotification(data.message || 'Restock failed', 'error');
      }
    } catch (err) {
      showNotification('Server connection error', 'error');
    }
  };

  // Update Order Fulfillment Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order status updated to "${newStatus}"!`);
        fetchOrders();
        fetchAnalytics();
      } else {
        showNotification(data.message || 'Status update failed', 'error');
      }
    } catch (err) {
      showNotification('Network error while updating status', 'error');
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Product "${title}" deleted`);
        fetchProducts();
        fetchAnalytics();
      } else {
        showNotification(data.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showNotification('Error deleting product', 'error');
    }
  };

  // Create / Update Product Submit Handler
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: productFormData.title,
        description: productFormData.description,
        price: Number(productFormData.price),
        category: productFormData.category,
        brand: productFormData.brand,
        countInStock: Number(productFormData.countInStock),
        sizes: productFormData.sizes,
        colors: productFormData.colors,
        images: [{ url: productFormData.imageUrl }]
      };

      const isEdit = !!editingProduct;
      const url = isEdit 
        ? `http://localhost:5000/api/products/${editingProduct._id || editingProduct.id}` 
        : 'http://localhost:5000/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(isEdit ? 'Product updated successfully!' : 'New Product created!');
        setIsCreateModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        fetchAnalytics();
      } else {
        showNotification(data.message || 'Failed to save product', 'error');
      }
    } catch (err) {
      showNotification('Error submitting product', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductFormData({
      title: '',
      description: '',
      price: 35,
      category: 'Women',
      brand: 'FashionStore Originals',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White'],
      countInStock: 25,
      imageUrl: PRESET_IMAGES[0]
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      title: prod.title,
      description: prod.description || '',
      price: prod.price,
      category: prod.category || 'Women',
      brand: prod.brand || 'FashionStore Originals',
      sizes: prod.sizes || ['S', 'M', 'L'],
      colors: prod.colors || ['Black'],
      countInStock: prod.countInStock,
      imageUrl: prod.images?.[0]?.url || prod.image || PRESET_IMAGES[0]
    });
    setIsCreateModalOpen(true);
  };

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => {
    const matchesKeyword = !productSearch.trim() || 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesKeyword && matchesCategory;
  });

  const filteredOrders = orders.filter(o => {
    if (!orderSearch.trim()) return true;
    const term = orderSearch.toLowerCase();
    const id = (o._id || '').toLowerCase();
    const customer = (o.customerInfo?.name || '').toLowerCase();
    const phone = (o.customerInfo?.phone || '').toLowerCase();
    return id.includes(term) || customer.includes(term) || phone.includes(term);
  });

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Main Shell */}
        <div className="bg-[#f8f9fa] rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col relative z-10 border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Bar Header */}
          <div className="bg-gray-950 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center font-black">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                    Admin Command Center
                  </h2>
                  <span className="bg-brand-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                    Member 4 Module
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Operations, Store Analytics, Product Inventory CRUD & Order Fulfillment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tabs */}
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'analytics' ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BarChart3 size={15} />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'products' ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Package size={15} />
                  <span>Products CRUD</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders' ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Truck size={15} />
                  <span>Fulfillment ({orders.length})</span>
                </button>
              </div>

              <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedbackMessage.text && (
            <div className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 ${
              feedbackMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <CheckCircle2 size={16} />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* ================= TAB 1: ANALYTICS DASHBOARD ================= */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Revenue */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Total Revenue (LKR)</span>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                      Rs. {Number(analytics?.summary?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <ArrowUpRight size={14} /> Islandwide Sales Recorded
                    </span>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Total Orders</span>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <ShoppingCart size={18} />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                      {analytics?.summary?.totalOrders || 0}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium block mt-1">
                      {analytics?.orderStatusBreakdown?.delivered || 0} Delivered &bull; {analytics?.orderStatusBreakdown?.processing || 0} In Progress
                    </span>
                  </div>

                  {/* Active Catalog Products */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Active Products</span>
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <Package size={18} />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                      {analytics?.summary?.totalProducts || products.length}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium block mt-1">
                      Across 5 Retail Categories
                    </span>
                  </div>

                  {/* Low Stock Alerts */}
                  <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs bg-amber-50/20">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Low Stock Alerts</span>
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                        <AlertTriangle size={18} />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
                      {analytics?.summary?.lowStockCount || 0}
                    </div>
                    <span className="text-[11px] text-amber-700 font-bold block mt-1">
                      Stock ≤ 5 units remaining
                    </span>
                  </div>
                </div>

                {/* Low Stock Alert Interactive Table (Member 4 Requirement) */}
                <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
                  <div className="p-4 bg-amber-500/10 border-b border-amber-200/60 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-600" />
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-amber-950">
                        Low Stock Intelligence & One-Click Restock
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800">
                      {analytics?.lowStockProducts?.length || 0} items needing restock
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Current Stock</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-4 text-right">Instant Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(!analytics?.lowStockProducts || analytics.lowStockProducts.length === 0) ? (
                          <tr>
                            <td colSpan="5" className="py-6 text-center text-gray-400 font-medium">
                              All products have healthy inventory levels (&gt; 5 in stock).
                            </td>
                          </tr>
                        ) : (
                          analytics.lowStockProducts.map(item => (
                            <tr key={item._id} className="hover:bg-amber-50/30">
                              <td className="py-3 px-4 font-bold text-gray-900">
                                {item.title}
                              </td>
                              <td className="py-3 px-3 text-gray-500">{item.category}</td>
                              <td className="py-3 px-3 font-mono font-black text-amber-600 text-sm">
                                {item.countInStock} left
                              </td>
                              <td className="py-3 px-3">
                                {item.countInStock <= 0 ? (
                                  <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                    Out of Stock
                                  </span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                    Critical Low
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex gap-1.5">
                                  <button
                                    onClick={() => handleQuickRestock(item._id, 15)}
                                    className="px-2.5 py-1 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                                  >
                                    +15 Units
                                  </button>
                                  <button
                                    onClick={() => handleQuickRestock(item._id, 30)}
                                    className="px-2.5 py-1 bg-brand-500 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                                  >
                                    +30 Units
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Orders Breakdown & Category Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Fulfillment Status Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">
                      Order Fulfillment Status Distribution
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-amber-700">Processing / In Preparation</span>
                          <span>{analytics?.orderStatusBreakdown?.processing || 0}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (analytics?.orderStatusBreakdown?.processing || 0) * 20)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-blue-700">Shipped / In Transit</span>
                          <span>{analytics?.orderStatusBreakdown?.shipped || 0}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (analytics?.orderStatusBreakdown?.shipped || 0) * 20)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-emerald-700">Delivered Successfully</span>
                          <span>{analytics?.orderStatusBreakdown?.delivered || 0}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (analytics?.orderStatusBreakdown?.delivered || 0) * 20)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">
                        Recent Store Purchases
                      </h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-brand-500 font-bold hover:underline cursor-pointer"
                      >
                        View All Orders
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(!analytics?.recentOrders || analytics.recentOrders.length === 0) ? (
                        <p className="text-xs text-gray-400 py-4 text-center">No orders recorded yet.</p>
                      ) : (
                        analytics.recentOrders.slice(0, 5).map(o => (
                          <div key={o._id} className="p-2.5 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-gray-900">{o.customerInfo?.name || 'Customer'}</p>
                              <p className="text-[10px] text-gray-400 font-mono">#{o._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-900 block">
                                Rs. {Number(o.totalPrice || 0).toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-brand-600 uppercase">
                                {o.orderStatus}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 2: PRODUCT MANAGEMENT (CRUD) ================= */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                {/* Search, Filter & Add Button */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    {/* Search input */}
                    <div className="relative min-w-[220px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product title, brand..." 
                        className="w-full text-xs pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="text-xs font-bold bg-gray-100 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Women">Ladies (Women)</option>
                      <option value="Men">Gents (Men)</option>
                      <option value="Kids">Kids & Baby</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>

                    <span className="text-xs text-gray-400 font-semibold">
                      Showing {filteredProducts.length} items
                    </span>
                  </div>

                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-black text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md shadow-brand-500/20"
                  >
                    <Plus size={16} />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="py-3.5 px-4">Product Info</th>
                          <th className="py-3.5 px-3">Category</th>
                          <th className="py-3.5 px-3">Price (LKR)</th>
                          <th className="py-3.5 px-3">Inventory</th>
                          <th className="py-3.5 px-3">Reviews</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-gray-400">
                              No products found matching filters.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map(prod => {
                            const img = prod.images?.[0]?.url || prod.image || PRESET_IMAGES[0];
                            const stock = prod.countInStock !== undefined ? prod.countInStock : 0;
                            const isLow = stock <= 5;

                            return (
                              <tr key={prod._id || prod.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img src={img} alt={prod.title} className="w-10 h-12 object-cover rounded-lg bg-gray-100 shrink-0 border border-gray-100" />
                                    <div className="min-w-0">
                                      <p className="font-bold text-gray-900 truncate max-w-xs">{prod.title}</p>
                                      <p className="text-[11px] text-gray-400">{prod.brand || 'FashionStore'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                                    {prod.category}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-bold text-gray-900">
                                  Rs. {(prod.price * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`font-mono font-bold text-xs ${isLow ? 'text-amber-600' : 'text-gray-800'}`}>
                                    {stock} in stock
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <span className="text-amber-500 font-bold">★ {prod.rating || 0}</span>
                                    <span className="text-[10px] text-gray-400">({prod.numReviews || 0})</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => openEditModal(prod)}
                                      className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                                      title="Edit Product"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(prod._id || prod.id, prod.title)}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                      title="Delete Product"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 3: ORDER FULFILLMENT ================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Search & Status Filter Controls */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative min-w-[240px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search customer name, phone, order ID..." 
                        className="w-full text-xs pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                      {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            orderStatusFilter === status ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={fetchOrders}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
                    title="Refresh Orders"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {/* Orders List Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="py-3.5 px-4">Order Reference</th>
                          <th className="py-3.5 px-3">Customer & Contact</th>
                          <th className="py-3.5 px-3">Destination</th>
                          <th className="py-3.5 px-3">Total (LKR)</th>
                          <th className="py-3.5 px-3">Payment</th>
                          <th className="py-3.5 px-3">Fulfillment Status</th>
                          <th className="py-3.5 px-4 text-right">Invoice & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center text-gray-400">
                              No orders match the selected criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-black text-gray-900 block">
                                  #{order._id.slice(-8).toUpperCase()}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>

                              <td className="py-3.5 px-3">
                                <p className="font-bold text-gray-900">{order.customerInfo?.name || 'Customer'}</p>
                                <p className="text-[11px] text-gray-500">{order.customerInfo?.phone || 'N/A'}</p>
                              </td>

                              <td className="py-3.5 px-3 text-gray-600 max-w-[150px] truncate">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}
                              </td>

                              <td className="py-3.5 px-3 font-black text-gray-900 text-sm">
                                Rs. {Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>

                              <td className="py-3.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {order.isPaid ? 'Paid' : 'COD'}
                                </span>
                              </td>

                              {/* Fulfillment Status Selector (Member 4 Requirement) */}
                              <td className="py-3.5 px-3">
                                <select
                                  value={order.orderStatus || 'Processing'}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className={`text-xs font-bold rounded-xl py-1 px-2 border cursor-pointer focus:outline-none ${
                                    order.orderStatus === 'Delivered'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : order.orderStatus === 'Shipped'
                                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                                      : order.orderStatus === 'Cancelled'
                                      ? 'bg-red-50 text-red-700 border-red-300'
                                      : 'bg-amber-50 text-amber-700 border-amber-300'
                                  }`}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setSelectedInvoiceOrder(order)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-all cursor-pointer ml-auto"
                                  title="View Official Invoice"
                                >
                                  <FileText size={14} className="text-brand-500" />
                                  <span>Invoice</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ================= MODAL: CREATE / EDIT PRODUCT ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsCreateModalOpen(false)} 
          />
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900 uppercase">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input 
                  type="text" 
                  required
                  value={productFormData.title}
                  onChange={(e) => setProductFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Linen Relaxed Fit Shirt"
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea 
                  required
                  rows={2}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Premium breathable fabrics tailored for everyday elegance..."
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (USD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData(p => ({ ...p, price: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Approx Rs. {(Number(productFormData.price || 0) * 300).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Count In Stock *</label>
                  <input 
                    type="number" 
                    required
                    value={productFormData.countInStock}
                    onChange={(e) => setProductFormData(p => ({ ...p, countInStock: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select 
                    value={productFormData.category}
                    onChange={(e) => setProductFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="Women">Ladies (Women)</option>
                    <option value="Men">Gents (Men)</option>
                    <option value="Kids">Kids</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Name</label>
                  <input 
                    type="text" 
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData(p => ({ ...p, brand: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Preset Image Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={productFormData.imageUrl}
                  onChange={(e) => setProductFormData(p => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500 mb-2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold">Quick Presets:</span>
                  <div className="flex gap-1.5 overflow-x-auto py-1">
                    {PRESET_IMAGES.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="preset" 
                        onClick={() => setProductFormData(p => ({ ...p, imageUrl: img }))}
                        className={`w-8 h-8 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                          productFormData.imageUrl === img ? 'border-brand-500 scale-105' : 'border-gray-200 opacity-60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-500 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </>
  );
};

export default AdminDashboardModal;
