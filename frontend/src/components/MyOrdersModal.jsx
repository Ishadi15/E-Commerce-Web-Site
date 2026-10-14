import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Calendar, CheckCircle2, AlertCircle, FileText, Truck, ArrowRight, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from './InvoiceModal';

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered'];

const MyOrdersModal = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const storedToken = token || localStorage.getItem('token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Could not connect to backend server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, token]);

  if (!isOpen) return null;

  const getStatusStepIndex = (status) => {
    if (status === 'Delivered') return 2;
    if (status === 'Shipped') return 1;
    return 0; // Processing
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto relative z-10 border border-gray-100 p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-xl">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                  My Orders & Live Tracking
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Review and track the delivery status of your purchases
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-brand-500 mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Retrieving Your Orders...</span>
            </div>
          ) : !user ? (
            <div className="py-16 text-center text-gray-500 space-y-3">
              <Package size={48} className="mx-auto text-gray-300" />
              <h3 className="font-bold text-gray-900 text-sm">Please Sign In</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Sign in to your account to review all previously placed orders and their live tracking updates.
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-3">
              <Package size={48} className="mx-auto text-gray-300" />
              <h3 className="font-bold text-gray-900 text-sm">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                When you place orders for our clothing items, they will appear here with live shipping tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStepIndex = getStatusStepIndex(order.orderStatus);
                const isCancelled = order.orderStatus === 'Cancelled';

                return (
                  <div key={order._id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all bg-white space-y-4">
                    
                    {/* Top Row: ID, Date, Status */}
                    <div className="flex flex-wrap justify-between items-center pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                            {order.paymentMethod}
                          </span>
                          {order.isPaid ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              PAID
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                              COD PENDING
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
                        >
                          <FileText size={14} className="text-brand-500" />
                          <span>View Invoice</span>
                        </button>

                        <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.orderStatus || 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Order Tracking Timeline Stepper (Member 3 Requirement) */}
                    {!isCancelled && (
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center relative">
                          {/* Connecting line */}
                          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                          <div 
                            className="absolute top-1/2 left-6 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ 
                              width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%' 
                            }}
                          />

                          {STATUS_STEPS.map((step, idx) => {
                            const isCompleted = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;

                            return (
                              <div key={step} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isCompleted 
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                }`}>
                                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                                </div>
                                <span className={`text-[11px] font-bold mt-1.5 uppercase tracking-wider ${
                                  isCurrent ? 'text-emerald-700 font-black' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-2.5 pt-1">
                      {order.orderItems && order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-xl bg-gray-100 shrink-0 border border-gray-100" />
                            )}
                            <div>
                              <p className="font-bold text-gray-900 text-xs sm:text-sm">{item.name}</p>
                              <p className="text-[11px] text-gray-500">
                                Qty: {item.quantity} &bull; Size: {item.size || 'M'} &bull; Color: {item.color || 'Standard'}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">
                            Rs. {((item.price || 0) * (item.quantity || 1) * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Total Footer */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-sm">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city} ({order.shippingAddress?.state})
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 sm:text-right">
                        <span className="text-gray-500 font-medium">Total (LKR):</span>
                        <span className="text-base font-black text-brand-500">
                          Rs. {Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Invoice Viewer Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </>
  );
};

export default MyOrdersModal;
