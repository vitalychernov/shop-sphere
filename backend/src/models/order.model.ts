import { Schema, model, InferSchemaType } from 'mongoose';

// Sub-schema for individual items within an order.
// We store price as a snapshot — if the product price changes later,
// the historical order data remains accurate.
const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    // Set after Stripe Checkout Session is created
    stripeSessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export type OrderType = InferSchemaType<typeof orderSchema>;

export const Order = model('Order', orderSchema);
