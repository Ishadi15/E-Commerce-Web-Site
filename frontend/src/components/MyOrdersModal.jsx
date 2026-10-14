import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyOrdersModal = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const storedToken = token || localStorage.getItem('token');
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                My Orders
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Track and review your recent purchases
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
          <div className="py-16 flex flex-col items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-brand-500 mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Your Orders...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-800 text-sm">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500 mt-1">Start shopping to see your placed orders here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow bg-gray-50/50">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-gray-200 gap-2">
                  <div>
                    <span className="text-xs font-black text-gray-900 font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.orderStatus || 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-3 space-y-2">
                  {order.orderItems && order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-200" />
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-[11px] text-gray-500">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        Rs. {(item.price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-600">Total Amount:</span>
                  <span className="text-sm font-black text-brand-500">
                    Rs. {Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersModal;
