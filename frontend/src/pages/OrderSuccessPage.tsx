import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import styles from './OrderSuccessPage.module.css';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  // Clear the cart once the user lands on the success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>

          {sessionId && (
            <p className={styles.sessionId}>
              Stripe Session ID: <code>{sessionId}</code>
            </p>
          )}

          <div className={styles.actions}>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
