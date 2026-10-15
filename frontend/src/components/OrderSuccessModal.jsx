import React, { useState } from 'react';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight, FileText, MailCheck } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

const OrderSuccessModal = ({ order, isOpen, onClose }) => {
  const [showInvoice, setShowInvoice] = useState(false);

  if (!isOpen || !order) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-gray-100 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Animated Celebration Icon */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
            Thank you for shopping with FashionStore! An automated invoice has also been generated for your order.
          </p>

          {/* Email Notification Note */}
          {order.customerInfo?.email && (
            <div className="mt-3 py-2 px-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
              <MailCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Invoice sent to <strong>{order.customerInfo.email}</strong></span>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 my-5 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-bold uppercase text-[11px]">Order Reference:</span>
              <span className="font-mono font-black text-gray-900 text-sm">#{order._id ? order._id.slice(-8).toUpperCase() : 'FS-SUCCESS'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Payment Method:</span>
              <span className="font-bold text-gray-800">
                {order.paymentMethod || 'Cash on Delivery'} {order.isPaid ? '(Paid)' : '(Unpaid COD)'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Estimated Delivery:</span>
              <span className="font-bold text-emerald-700">2 - 4 Business Days</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
              <span className="font-bold text-gray-800">Total Payable Amount:</span>
              <span className="font-black text-brand-500 text-base">
                Rs. {Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-gray-200"
            >
              <FileText size={16} className="text-brand-500" />
              <span>View & Print Official Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>

      <InvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </>
  );
};

export default OrderSuccessModal;
