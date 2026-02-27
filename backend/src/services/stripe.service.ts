import Stripe from 'stripe';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

const stripe = new Stripe(env.stripeSecretKey);

export const StripeService = {
  async createCheckoutSession(orderId: string, userId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Ensure the user owns this order
    if (order.user.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    if (order.status !== 'pending') {
      throw new AppError('Order is already processed', 400);
    }

    // Build Stripe line items from order items
    // Stripe requires amounts in cents (integer) — multiply by 100
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(
      (item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          // Convert dollars to cents and ensure integer
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // orderId in metadata links Stripe session back to our Order document
      metadata: { orderId: order._id.toString() },
      success_url: `${env.clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/cart`,
    });

    // Save Stripe session ID on the order for webhook reconciliation
    await Order.findByIdAndUpdate(orderId, { stripeSessionId: session.id });

    return { url: session.url };
  },

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    if (!env.stripeWebhookSecret) {
      // Webhook secret not configured — skip signature verification (dev/initial deploy only)
      console.warn('[Stripe] STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
    } else {
      try {
        // Verify that the request is genuinely from Stripe using the webhook secret
        event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
      } catch {
        throw new AppError('Invalid webhook signature', 400);
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await Order.findByIdAndUpdate(
            orderId,
            { status: 'paid' },
            { new: true }
          );

          // Decrement stock for each purchased item
          if (order) {
            await Promise.all(
              order.items.map((item) =>
                Product.findByIdAndUpdate(item.product, {
                  $inc: { stock: -item.quantity },
                })
              )
            );
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, { status: 'failed' });
        }
        break;
      }

      // Ignore all other event types
      default:
        break;
    }

    return { received: true };
  },
};
