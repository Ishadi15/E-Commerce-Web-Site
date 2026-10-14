import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const orderId = order._id ? String(order._id).toUpperCase() : 'ORD-SAMPLE';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const subtotal = Number(order.itemsPrice || 0);
  const shipping = Number(order.shippingPrice || 0);
  const total = Number(order.totalPrice || (subtotal + shipping));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Invoice Modal Window */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto relative z-10 border border-gray-200 p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:p-4">
        
        {/* Actions bar (hidden in print) */}
        <div className="flex justify-between items-center pb-6 mb-6 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500">Official Invoice</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              {order.isPaid ? 'Paid' : 'Payment on Delivery'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="space-y-6 text-gray-800">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-6 border-b border-gray-200">
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase">
                FASHION<span className="text-brand-500">STORE</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                FashionStore (Pvt) Ltd &bull; Colombo, Sri Lanka
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Helpline: +94 11 234 5678 &bull; orders@fashionstore.lk
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Receipt / Tax Invoice</span>
              <span className="text-base font-black font-mono text-gray-900 block mt-0.5">
                #{orderId}
              </span>
              <span className="text-xs text-gray-500 block mt-0.5">
                Date: {orderDate}
              </span>
              <span className="inline-block mt-2 text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-600">
                Status: {order.orderStatus || 'Processing'}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Billed & Shipped To</p>
              <p className="font-bold text-gray-900 text-sm">{order.customerInfo?.name || 'Customer'}</p>
              <p className="text-gray-600 mt-0.5">Phone: {order.customerInfo?.phone || 'N/A'}</p>
              <p className="text-gray-600">Email: {order.customerInfo?.email || 'N/A'}</p>
              <p className="text-gray-700 mt-1 font-medium leading-relaxed">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}, Sri Lanka
              </p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Payment Information</p>
              <p className="font-bold text-gray-900 text-sm">{order.paymentMethod || 'Cash on Delivery'}</p>
              <p className="text-gray-600 mt-0.5">
                Payment Status: <strong className={order.isPaid ? 'text-emerald-700' : 'text-amber-700'}>
                  {order.isPaid ? 'Fully Paid' : 'Cash on Delivery Pending'}
                </strong>
              </p>
              {order.paymentResult?.id && (
                <p className="text-gray-500 font-mono mt-0.5 text-[11px]">
                  Ref: {order.paymentResult.id}
                </p>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-gray-500 text-[11px]">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Verified Electronic Commercial Invoice</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.orderItems || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-xs sm:text-sm">{item.name}</p>
                          <p className="text-[11px] text-gray-500">
                            Size: {item.size || 'M'} &bull; Color: {item.color || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      Rs. {((item.price || 0) * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-gray-900">
                      Rs. {((item.price || 0) * (item.quantity || 1) * 300).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Islandwide Delivery:</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="border-t-2 border-gray-900 pt-2 flex justify-between items-baseline text-sm">
                <span className="font-black text-gray-900 uppercase">Grand Total:</span>
                <span className="text-lg font-black text-brand-500">
                  Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-gray-100 pt-6 text-center text-[11px] text-gray-400 space-y-1">
            <p>Thank you for choosing FashionStore Sri Lanka! 7-day exchange available on unworn items with tags intact.</p>
            <p className="font-medium text-gray-500">Official Computer-Generated Tax Receipt &bull; Valid Islandwide</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
