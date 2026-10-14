const nodemailer = require('nodemailer');

/**
 * Generate a responsive, professional HTML email invoice
 */
const generateInvoiceHTML = (order) => {
  const orderId = order._id ? String(order._id).toUpperCase() : 'ORD-NEW';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const itemsRows = (order.orderItems || []).map((item) => {
    const itemTotal = ((item.price || 0) * (item.quantity || 1) * 300).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const unitPrice = ((item.price || 0) * 300).toLocaleString('en-US', {
      minimumFractionDigits: 2
    });

    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 8px; vertical-align: middle;">
          <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${item.name || 'Product'}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
            Size: <span style="font-weight: 600; color: #334155;">${item.size || 'M'}</span> &bull; 
            Color: <span style="font-weight: 600; color: #334155;">${item.color || 'Standard'}</span>
          </div>
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 13px; color: #475569; vertical-align: middle;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 13px; color: #475569; vertical-align: middle;">
          Rs. ${unitPrice}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: 700; color: #0f172a; vertical-align: middle;">
          Rs. ${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  const subtotal = Number(order.itemsPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const shipping = Number(order.shippingPrice || 0) === 0 ? 'FREE' : `Rs. ${Number(order.shippingPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const total = Number(order.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const customerName = order.customerInfo?.name || 'Valued Customer';
  const customerEmail = order.customerInfo?.email || 'N/A';
  const customerPhone = order.customerInfo?.phone || 'N/A';
  const address = order.shippingAddress
    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}, Sri Lanka`
    : 'Standard Delivery Address';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Receipt #${orderId} - FASHIONSTORE</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" style="width: 100%; max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border-spacing: 0;">
    
    <!-- Top Header Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px 36px; text-align: left;">
        <table style="width: 100%; border-spacing: 0;">
          <tr>
            <td>
              <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-transform: uppercase;">
                FASHION<span style="color: #ef4444;">STORE</span>
              </div>
              <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">
                Official Order Receipt & Tax Invoice
              </div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(239, 68, 68, 0.4);">
                ${order.orderStatus || 'Confirmed'}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Greeting & Summary Info -->
    <tr>
      <td style="padding: 28px 36px 12px 36px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">
          Thank You For Your Order, ${customerName}!
        </h2>
        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0;">
          Your order has been placed successfully and is being prepared for dispatch. Below are the full details and invoice for your purchase.
        </p>

        <!-- Meta Details Box -->
        <table style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; border-spacing: 0; margin-bottom: 24px;">
          <tr>
            <td style="width: 50%; padding: 6px 12px; vertical-align: top;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Order ID</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; font-family: monospace; margin-top: 2px;">#${orderId}</div>
            </td>
            <td style="width: 50%; padding: 6px 12px; vertical-align: top;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Order Date</div>
              <div style="font-size: 14px; font-weight: 600; color: #334155; margin-top: 2px;">${orderDate}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 12px 6px 12px; vertical-align: top;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Payment Method</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                ${order.paymentMethod || 'Cash on Delivery'}
                <span style="font-size: 11px; font-weight: 700; color: ${order.isPaid ? '#16a34a' : '#ea580c'}; margin-left: 6px;">
                  (${order.isPaid ? 'PAID' : 'PAY ON DELIVERY'})
                </span>
              </div>
            </td>
            <td style="padding: 12px 12px 6px 12px; vertical-align: top;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Delivery Contact</div>
              <div style="font-size: 13px; font-weight: 600; color: #334155; margin-top: 2px;">
                ${customerPhone} &bull; ${customerEmail}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 12px 12px 6px 12px; border-top: 1px dashed #cbd5e1; margin-top: 6px;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Shipping Destination</div>
              <div style="font-size: 13px; color: #334155; font-weight: 500; margin-top: 2px;">${address}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Items Table -->
    <tr>
      <td style="padding: 0 36px 20px 36px;">
        <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 10px;">
          Purchased Items
        </div>
        <table style="width: 100%; border-collapse: collapse; border-spacing: 0;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc;">
              <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Item Description</th>
              <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Unit Price</th>
              <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Cost Breakdown -->
    <tr>
      <td style="padding: 0 36px 28px 36px;">
        <table style="width: 100%; border-spacing: 0;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 20px;">
              <div style="padding: 14px; background: #f1f5f9; border-radius: 12px; font-size: 12px; color: #475569; line-height: 1.5;">
                <strong>Islandwide Delivery Note:</strong><br>
                Orders within Colombo arrive in 1-2 business days. Outstation packages arrive within 3-4 working days via prompt courier service.
              </div>
            </td>
            <td style="width: 50%; vertical-align: top;">
              <table style="width: 100%; border-spacing: 0;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Subtotal:</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px; font-weight: 600; color: #1e293b;">Rs. ${subtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Delivery Charge:</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px; font-weight: 700; color: ${order.shippingPrice === 0 ? '#16a34a' : '#1e293b'};">
                    ${shipping}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #0f172a;">
                  <td style="padding: 12px 0 0 0; font-size: 15px; font-weight: 900; color: #0f172a; text-transform: uppercase;">Total Amount:</td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: 900; color: #ef4444;">Rs. ${total}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; text-align: center;">
        <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">
          Need assistance with this order? Contact our support hotline at <strong>+94 11 234 5678</strong> or email <strong>support@fashionstore.lk</strong>.
        </p>
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          &copy; ${new Date().getFullYear()} FASHIONSTORE SRI LANKA. All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
  `;
};

/**
 * Send automated email invoice to customer
 */
const sendOrderInvoiceEmail = async (order) => {
  try {
    const recipient = order.customerInfo?.email;
    if (!recipient) {
      console.log('No email specified for order receipt notification.');
      return false;
    }

    const htmlContent = generateInvoiceHTML(order);

    // Create transporter if SMTP settings provided in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"FashionStore Sri Lanka" <${process.env.SMTP_FROM || 'orders@fashionstore.lk'}>`,
        to: recipient,
        subject: `Your FashionStore Order Receipt & Confirmation #${String(order._id).toUpperCase()}`,
        html: htmlContent,
      });

      console.log('Automated invoice email sent successfully to', recipient, 'MessageId:', info.messageId);
      return true;
    } else {
      // In development / test mode without external SMTP credentials
      console.log(`[Invoice Email Service] Order receipt generated for ${recipient} for Order #${order._id}. Email dispatch simulated.`);
      return true;
    }
  } catch (error) {
    console.error('Failed to send invoice email:', error.message);
    return false;
  }
};

module.exports = {
  generateInvoiceHTML,
  sendOrderInvoiceEmail,
};
