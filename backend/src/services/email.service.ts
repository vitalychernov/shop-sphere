import nodemailer from 'nodemailer';
import { env } from '../config/env';

// Create transporter lazily — only when SMTP credentials are configured
function createTransporter() {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

interface OrderEmailData {
  to: string;
  userName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

export const EmailService = {
  async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    // Skip silently if SMTP is not configured — email is optional
    if (!env.smtp.user || !env.smtp.pass) {
      console.log('[Email] SMTP not configured — skipping order confirmation email');
      return;
    }

    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#212529">
        <div style="background:#1a1a2e;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:24px">ShopSphere</h1>
        </div>

        <div style="background:#fff;padding:32px;border:1px solid #dee2e6;border-top:none">
          <h2 style="color:#1a1a2e;margin-top:0">Order Confirmed! 🎉</h2>
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Thank you for your order. We've received your payment and are processing your items.</p>

          <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:24px 0">
            <p style="margin:0 0 4px;font-size:12px;color:#6c757d;text-transform:uppercase;letter-spacing:0.5px">Order ID</p>
            <code style="font-size:13px;color:#1a1a2e">${data.orderId}</code>
          </div>

          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #dee2e6;font-size:13px;color:#6c757d">Item</th>
                <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #dee2e6;font-size:13px;color:#6c757d">Qty</th>
                <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #dee2e6;font-size:13px;color:#6c757d">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align:right;margin-top:16px;padding-top:16px;border-top:2px solid #dee2e6">
            <strong style="font-size:18px">Total: $${data.totalAmount.toFixed(2)}</strong>
          </div>

          <div style="margin-top:32px;text-align:center">
            <a href="${env.clientUrl}" style="background:#e94560;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
              Continue Shopping
            </a>
          </div>
        </div>

        <div style="padding:16px;text-align:center;font-size:12px;color:#6c757d">
          © ${new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    `;

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: env.smtp.from,
        to: data.to,
        subject: `Order Confirmed — ShopSphere #${data.orderId.slice(-8).toUpperCase()}`,
        html,
      });
      console.log(`[Email] Order confirmation sent to ${data.to}`);
    } catch (error) {
      // Log but don't throw — a failed email should not break the order creation
      console.error('[Email] Failed to send order confirmation:', error);
    }
  },
};
