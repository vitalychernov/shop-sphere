import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/orders.api';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  async function handlePayWithStripe() {
    setError('');
    setLoading(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.product._id,
        quantity: i.quantity,
      }));

      const order = await ordersApi.create(orderItems);
      const { url } = await ordersApi.createCheckoutSession(order._id);

      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.summary}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>

            <div className={styles.items}>
              {items.map(({ product, quantity }) => (
                <div key={product._id} className={styles.item}>
                  <img
                    src={product.images[0] ?? 'https://placehold.co/48x48?text=?'}
                    alt={product.name}
                    className={styles.itemImg}
                  />
                  <span className={styles.itemName}>{product.name}</span>
                  <span className={styles.itemQty}>× {quantity}</span>
                  <span className={styles.itemTotal}>
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.row}>
                <span>Items ({totalItems})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span style={{ color: '#2d8a4e' }}>Free</span>
              </div>
              <div className={`${styles.row} ${styles.total}`}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.payment}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.stripeNote}>
              Secure payment powered by Stripe. You'll be redirected to complete your purchase.
            </p>

            {error && <div className={styles.error}>{error}</div>}

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
              onClick={handlePayWithStripe}
              disabled={loading}
            >
              {loading ? 'Redirecting to Stripe...' : `Pay $${totalPrice.toFixed(2)} with Stripe`}
            </button>

            <p className={styles.testCard}>
              Test card: <strong>4242 4242 4242 4242</strong> · Any date · Any CVC
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
