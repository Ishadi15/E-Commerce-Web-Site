import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Truck, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Western Province',
    zipCode: '10100',
    paymentMethod: 'Cash on Delivery'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || ''
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const subtotalLKR = cartTotal * 300;
  const shippingLKR = subtotalLKR >= 5000 ? 0 : 350;
  const grandTotalLKR = subtotalLKR + shippingLKR;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.id || item._id,
          name: item.title,
          quantity: item.quantity,
          size: item.size || 'M',
          color: item.color || 'Standard',
          image: item.image || item.images?.[0]?.url || '',
          price: item.price
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'Sri Lanka'
        },
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotalLKR,
        shippingPrice: shippingLKR,
        totalPrice: grandTotalLKR
      };

      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Order created successfully!
      clearCart();
      onClose();
      if (onOrderSuccess) {
        onOrderSuccess(data.data);
      }
    } catch (err) {
      console.error('Order error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto relative z-10 border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              Fast Checkout
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enter delivery information to complete your order
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                1. Customer & Contact Info
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  placeholder="e.g. Nipuni Dhananjana"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="e.g. nipuni@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number (Mobile) *</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-500 bg-brand-500/5 text-brand-600 font-bold'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Truck size={20} className="mb-1" />
                    <span className="text-xs text-center">Cash On Delivery</span>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Credit Card'
                      ? 'border-brand-500 bg-brand-500/5 text-brand-600 font-bold'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Credit Card"
                      checked={formData.paymentMethod === 'Credit Card'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <CreditCard size={20} className="mb-1" />
                    <span className="text-xs text-center">Credit / Debit Card</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                2. Shipping Address
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Street Address *</label>
                <input 
                  type="text" 
                  name="street"
                  required
                  placeholder="e.g. 123/A, High Level Road"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">City / Town *</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    placeholder="e.g. Colombo / Kandy"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    placeholder="e.g. 10100"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Province / District</label>
                <select 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="Western Province">Western Province</option>
                  <option value="Central Province">Central Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="North Western Province">North Western Province</option>
                  <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                  <option value="Northern Province">Northern Province</option>
                  <option value="North Central Province">North Central Province</option>
                  <option value="Uva Province">Uva Province</option>
                </select>
              </div>

              {/* Order Summary Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Items Subtotal ({cartItems.length}):</span>
                  <span className="font-bold text-gray-900">Rs. {subtotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Shipping Fee:</span>
                  <span className={`font-bold ${shippingLKR === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingLKR === 0 ? 'FREE' : `Rs. ${shippingLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase text-gray-800">Total Amount:</span>
                  <span className="text-xl font-black text-brand-500">
                    Rs. {grandTotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Place Order CTA */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield size={16} className="text-green-600" />
              <span>Safe & Encrypted 256-bit Checkout</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full sm:w-auto min-w-[220px] py-3.5 px-8 bg-brand-500 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-brand-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Order...
                </>
              ) : (
                `Place Order • Rs. ${grandTotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CheckoutModal;
