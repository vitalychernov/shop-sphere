import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useMyOrders } from '../hooks/useOrders';
import { authApi } from '../api/auth.api';
import styles from './AccountPage.module.css';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { data: orders, isLoading, isError } = useMyOrders();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  function handleLogout() {
    logout();
    navigate('/');
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    setPwLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPwSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update password.';
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>My Account</h1>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ── Profile ───────────────────────────────────────── */}
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

        {/* ── Change Password ────────────────────────────────── */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Change Password</h2>
          <form onSubmit={handleChangePassword} className={styles.pwForm}>
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                className={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {pwError && <p className={styles.pwError}>{pwError}</p>}
            {pwSuccess && <p className={styles.pwSuccess}>{pwSuccess}</p>}
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* ── Orders ────────────────────────────────────────── */}
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
