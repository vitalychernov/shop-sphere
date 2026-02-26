import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (isLoading) return <Layout><p className={styles.state}>Loading...</p></Layout>;
  if (isError || !product) return <Layout><p className={styles.state}>Product not found.</p></Layout>;

  return (
    <Layout>
      <div className="container">
        <Link to="/" className={styles.back}>← Back to Catalog</Link>

        <div className={styles.product}>
          <div className={styles.imageWrapper}>
            <img
              src={product.images[0] ?? 'https://placehold.co/600x500?text=No+Image'}
              alt={product.name}
              className={styles.image}
            />
          </div>

          <div className={styles.info}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.stock}>
              {product.stock > 0
                ? <span className={styles.inStock}>In Stock ({product.stock} left)</span>
                : <span className={styles.outOfStock}>Out of Stock</span>
              }
            </div>

            {product.stock > 0 && (
              <div className={styles.actions}>
                <div className={styles.quantity}>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAddToCart}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
