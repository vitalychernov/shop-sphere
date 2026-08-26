import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useMyOrders } from '../hooks/useOrders';
import styles from './AccountPage.module.css';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export default function AccountPage() {
  const { user } = useAuth();
  const { data: orders, isLoading, isError } = useMyOrders();

  return (
    <Layout>
      <div className="container">
        <h1 className={styles.title}>My Account</h1>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <dl className={styles.profile}>
            <dt>Name</dt>
            <dd>{user?.name}</dd>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
            <dt>Role</dt>
            <dd className={styles.role}>{user?.role}</dd>
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Order History</h2>

          {isLoading && <p className={styles.state}>Loading orders…</p>}

          {isError && (
            <p className={styles.stateError}>Failed to load orders. Please try again.</p>
          )}

          {orders && orders.length === 0 && (
            <div className={styles.empty}>
              <p>You haven't placed any orders yet.</p>
              <Link to="/" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order._id} className={styles.order}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`${styles.badge} ${styles[`badge_${order.status}`]}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <ul className={styles.itemList}>
                    {order.items.map((item, idx) => (
                      <li key={idx} className={styles.item}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>× {item.quantity}</span>
                        <span className={styles.itemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.orderFooter}>
                    <span className={styles.orderTotal}>
                      Total: <strong>${order.totalAmount.toFixed(2)}</strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
