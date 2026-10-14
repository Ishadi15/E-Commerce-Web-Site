import React from 'react';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-gray-100 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 size={48} className="stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
          Order Confirmed!
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Thank you for shopping with FashionStore. Your order has been placed and is now being processed.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 my-6 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-500 font-semibold uppercase">Order ID:</span>
            <span className="font-mono font-bold text-gray-900">#{order._id ? order._id.slice(-8).toUpperCase() : 'FS-SUCCESS'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Payment Method:</span>
            <span className="font-bold text-gray-800">{order.paymentMethod || 'Cash on Delivery'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Estimated Delivery:</span>
            <span className="font-bold text-green-700">2 - 4 Business Days</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
            <span className="font-bold text-gray-800">Total Paid/Payable:</span>
            <span className="font-black text-brand-500 text-base">
              Rs. {Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-black hover:bg-gray-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default OrderSuccessModal;
