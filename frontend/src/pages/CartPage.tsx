import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.empty}>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started.</p>
            <Link to="/" className="btn btn-primary">Browse Catalog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h1 className={styles.title}>Cart ({totalItems} items)</h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map(({ product, quantity }) => (
              <div key={product._id} className={styles.item}>
                <img
                  src={product.images[0] ?? 'https://placehold.co/80x80?text=?'}
                  alt={product.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemInfo}>
                  <Link to={`/products/${product.slug}`} className={styles.itemName}>
                    {product.name}
                  </Link>
                  <span className={styles.itemPrice}>${product.price.toFixed(2)}</span>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.quantity}>
                    <button onClick={() => updateQuantity(product._id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                  </div>

                  <span className={styles.subtotal}>
                    ${(product.price * quantity).toFixed(2)}
                  </span>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(product._id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.free}>Free</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {isAuthenticated ? (
              <Link to="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
                Proceed to Checkout
              </Link>
            ) : (
              <Link
                to="/login"
                state={{ from: '/checkout' }}
                className={`btn btn-primary ${styles.checkoutBtn}`}
              >
                Login to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
