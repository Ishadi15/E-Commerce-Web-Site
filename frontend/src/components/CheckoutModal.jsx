import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Truck, CreditCard, Shield, AlertCircle, Lock, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'North Western Province',
  'Sabaragamuwa Province',
  'Eastern Province',
  'Northern Province',
  'North Central Province',
  'Uva Province'
];

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
    paymentMethod: 'Cash on Delivery',
    // Card simulation details
    cardNumber: '4532 8920 1289 4019',
    cardExpiry: '12/28',
    cardCvc: '842',
    cardName: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulatingGateway, setIsSimulatingGateway] = useState(false);
  const [gatewayStep, setGatewayStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || '',
        cardName: user.name || prev.cardName,
        street: user.address?.street || prev.street,
        city: user.address?.city || prev.city,
        zipCode: user.address?.postalCode || prev.zipCode
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const subtotalLKR = cartTotal * 300;
  const isFreeDelivery = subtotalLKR >= 5000;
  const shippingLKR = isFreeDelivery ? 0 : 350;
  const grandTotalLKR = subtotalLKR + shippingLKR;

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    // Sri Lanka phone number validation (07X XXX XXXX or +94...)
    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    if (!phoneClean || !phoneRegex.test(phoneClean)) {
      errors.phone = 'Valid Sri Lankan mobile number required (e.g. 077 123 4567)';
    }

    if (!formData.street.trim() || formData.street.trim().length < 5) {
      errors.street = 'Street address is required (e.g. house number, street)';
    }

    if (!formData.city.trim()) {
      errors.city = 'City / Town is required';
    }

    if (formData.paymentMethod === 'Credit Card') {
      const cleanCard = formData.cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        errors.cardNumber = 'Valid 16-digit card number required';
      }
      if (!formData.cardExpiry || !formData.cardExpiry.includes('/')) {
        errors.cardExpiry = 'MM/YY required';
      }
      if (!formData.cardCvc || formData.cardCvc.length < 3) {
        errors.cardCvc = '3-digit CVC required';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberFormat = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
    if (fieldErrors.cardNumber) setFieldErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryFormat = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }));
    if (fieldErrors.cardExpiry) setFieldErrors(prev => ({ ...prev, cardExpiry: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let paymentResult = null;

      // Online Card Payment Simulation (PayHere Sandbox simulation)
      if (formData.paymentMethod === 'Credit Card') {
        setIsSimulatingGateway(true);
        setGatewayStep('Connecting to PayHere Sri Lanka Sandbox Gateway...');
        await new Promise(r => setTimeout(r, 800));

        setGatewayStep('Verifying card details & 3D Secure Authorization...');
        await new Promise(r => setTimeout(r, 1000));

        setGatewayStep('Transaction Approved! Finalizing Order...');
        await new Promise(r => setTimeout(r, 600));

        paymentResult = {
          id: `PH-SANDBOX-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: formData.email
        };
      }

      const orderPayload = {
        orderItems: cartItems.map(item => {
          const rawId = item._id || item.id;
          const validId = (rawId && /^[0-9a-fA-F]{24}$/.test(rawId)) ? rawId : undefined;
          return {
            product: validId,
            name: item.title,
            quantity: item.quantity,
            size: item.size || 'M',
            color: item.color || 'Standard',
            image: item.image || item.images?.[0]?.url || '',
            price: item.price
          };
        }),
        shippingAddress: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state,
          zipCode: formData.zipCode.trim() || '10100',
          country: 'Sri Lanka'
        },
        customerInfo: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        },
        paymentMethod: formData.paymentMethod,
        paymentResult,
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
      setIsSimulatingGateway(false);
      onClose();
      if (onOrderSuccess) {
        onOrderSuccess(data.data);
      }
    } catch (err) {
      console.error('Order error:', err);
      setIsSimulatingGateway(false);
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* PayHere Gateway Simulation Overlay */}
      {isSimulatingGateway && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Lock size={32} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                PayHere Sandbox Gateway
              </span>
              <h3 className="text-base font-black text-gray-900 mt-2">Securing Online Payment</h3>
              <p className="text-xs text-gray-500 font-medium">{gatewayStep}</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-brand-500 w-full animate-indeterminate"></div>
            </div>
            <div className="text-[11px] text-gray-400">
              Rs. {grandTotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })} &bull; 256-Bit SSL Encrypted
            </div>
          </div>
        </div>
      )}

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto relative z-10 border border-gray-100 p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-600">
                Member 3 Checkout Module
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase mt-1">
              Delivery & Payment Checkout
            </h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Customer & Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                1. Customer & Shipping Details
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. Kasun Kalhara"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full text-xs sm:text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                    fieldErrors.fullName ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-brand-500'
                  }`}
                />
                {fieldErrors.fullName && <p className="text-[11px] text-red-500 font-semibold mt-1">{fieldErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="e.g. kasun@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full text-xs sm:text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                    fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-brand-500'
                  }`}
                />
                {fieldErrors.email && <p className="text-[11px] text-red-500 font-semibold mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (Sri Lanka) *</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="e.g. 077 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full text-xs sm:text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                    fieldErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-brand-500'
                  }`}
                />
                {fieldErrors.phone && <p className="text-[11px] text-red-500 font-semibold mt-1">{fieldErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address *</label>
                <input 
                  type="text" 
                  name="street"
                  placeholder="e.g. 142/5, Galle Road"
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full text-xs sm:text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                    fieldErrors.street ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-brand-500'
                  }`}
                />
                {fieldErrors.street && <p className="text-[11px] text-red-500 font-semibold mt-1">{fieldErrors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Town *</label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="e.g. Colombo / Kandy"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full text-xs sm:text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ${
                      fieldErrors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-brand-500'
                    }`}
                  />
                  {fieldErrors.city && <p className="text-[11px] text-red-500 font-semibold mt-1">{fieldErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    placeholder="e.g. 00300"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
                <select 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 bg-white"
                >
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Right Column: Payment & Order Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                2. Payment Method & Review
              </h3>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'Cash on Delivery'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-600 font-bold shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Truck size={22} className="mb-1 text-brand-500" />
                  <span className="text-xs text-center font-bold">Cash On Delivery</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Pay at Doorstep</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'Credit Card'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-600 font-bold shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Credit Card"
                    checked={formData.paymentMethod === 'Credit Card'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <CreditCard size={22} className="mb-1 text-brand-500" />
                  <span className="text-xs text-center font-bold">Card / PayHere</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Online Payment</span>
                </label>
              </div>

              {/* Online Card Simulation Form (when Card selected) */}
              {formData.paymentMethod === 'Credit Card' && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-600">PayHere Sandbox Card Info</span>
                    <div className="flex gap-1.5">
                      <span className="bg-white px-2 py-0.5 rounded text-[9px] font-bold border text-blue-700">VISA</span>
                      <span className="bg-white px-2 py-0.5 rounded text-[9px] font-bold border text-red-600">MC</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Card Number</label>
                    <input 
                      type="text" 
                      value={formData.cardNumber}
                      onChange={handleCardNumberFormat}
                      placeholder="4532 8920 1289 4019"
                      className={`w-full text-xs font-mono border rounded-xl px-3 py-2 bg-white ${
                        fieldErrors.cardNumber ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {fieldErrors.cardNumber && <p className="text-[10px] text-red-500">{fieldErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Expires</label>
                      <input 
                        type="text" 
                        value={formData.cardExpiry}
                        onChange={handleExpiryFormat}
                        placeholder="MM/YY"
                        className={`w-full text-xs font-mono border rounded-xl px-3 py-2 bg-white ${
                          fieldErrors.cardExpiry ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {fieldErrors.cardExpiry && <p className="text-[10px] text-red-500">{fieldErrors.cardExpiry}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">CVC / CVV</label>
                      <input 
                        type="password" 
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardCvc: e.target.value }))}
                        placeholder="842"
                        className={`w-full text-xs font-mono border rounded-xl px-3 py-2 bg-white ${
                          fieldErrors.cardCvc ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {fieldErrors.cardCvc && <p className="text-[10px] text-red-500">{fieldErrors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Cost Breakdown Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Items Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                  <span className="font-bold text-gray-900">
                    Rs. {subtotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>Islandwide Delivery:</span>
                    {isFreeDelivery && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        PROMO
                      </span>
                    )}
                  </div>
                  <span className={`font-black ${isFreeDelivery ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {isFreeDelivery ? 'FREE (Orders > Rs. 5,000)' : 'Rs. 350.00'}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase text-gray-800">Total Payable:</span>
                  <span className="text-xl font-black text-brand-500">
                    Rs. {grandTotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                    <div className="flex items-center gap-2 truncate">
                      <img src={item.image} alt={item.title} className="w-8 h-8 rounded-md object-cover bg-gray-100" />
                      <span className="truncate max-w-[150px] font-medium text-gray-800">{item.title}</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      Rs. {((item.price * 300) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Place Order CTA */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield size={16} className="text-emerald-600" />
              <span>Safe & Encrypted 256-bit Checkout &bull; Official Sri Lanka Delivery</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full sm:w-auto min-w-[240px] py-3.5 px-8 bg-brand-500 hover:bg-black disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-brand-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing Order...</span>
                </>
              ) : (
                <span>Place Order • Rs. {grandTotalLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CheckoutModal;
