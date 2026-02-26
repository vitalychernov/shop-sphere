import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.slug}`} className={styles.imageWrapper}>
        <img
          src={product.images[0] ?? 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className={styles.image}
        />
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/products/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>

      <div className={styles.footer}>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
