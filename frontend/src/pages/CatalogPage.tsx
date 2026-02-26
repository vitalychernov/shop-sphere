import { useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { ProductFilters } from '../types';
import styles from './CatalogPage.module.css';

const CATEGORIES = ['All', 'sneakers', 'bags', 'accessories', 'clothing', 'electronics'];

export default function CatalogPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12, sort: 'newest' });
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useProducts(filters);

  function handleCategory(cat: string) {
    setFilters((f) => ({
      ...f,
      page: 1,
      category: cat === 'All' ? undefined : cat,
    }));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1, search: search || undefined }));
  }

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters((f) => ({ ...f, sort: e.target.value as ProductFilters['sort'] }));
  }

  return (
    <Layout>
      <div className="container">
        <h1 className={styles.title}>Catalog</h1>

        {/* Search + Sort bar */}
        <div className={styles.toolbar}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <select value={filters.sort} onChange={handleSort} className={styles.sort}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Category filters */}
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => {
            const active = cat === 'All' ? !filters.category : filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`${styles.categoryBtn} ${active ? styles.active : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {isLoading && <p className={styles.state}>Loading products...</p>}
        {isError && <p className={styles.state}>Failed to load products.</p>}

        {data && (
          <>
            {data.products.length === 0 ? (
              <p className={styles.state}>No products found.</p>
            ) : (
              <div className={styles.grid}>
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-outline"
                  disabled={!data.pagination.hasPrevPage}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  {data.pagination.page} / {data.pagination.totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={!data.pagination.hasNextPage}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
