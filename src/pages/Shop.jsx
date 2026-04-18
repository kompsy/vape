// src/pages/Shop.jsx
import { useState } from 'react';
import { getProducts } from '../store';
import { useLocalStore } from '../hooks';
import ProductModal from '../components/ProductModal';

function ProductCard({ product, onClick }) {
  const variants = product.variants || [];
  const prices = variants.map(v => v.salePrice).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const totalStock = variants.reduce((s, v) => s + (v.stock || 0), 0);

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-img">
        {product.videoUrl ? (
          <video src={product.videoUrl} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Intet billede</span>
          </div>
        )}
        {totalStock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="badge badge-red" style={{ fontSize: 13 }}>Udsolgt</span>
          </div>
        )}
        {totalStock > 0 && totalStock <= 10 && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span className="badge badge-amber">Få tilbage</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="flex-between" style={{ marginTop: 10 }}>
          {minPrice ? (
            <span className="product-price">fra {minPrice} kr</span>
          ) : (
            <span className="product-price" style={{ color: 'var(--text3)' }}>—</span>
          )}
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{variants.length} varianter</span>
        </div>
      </div>
    </div>
  );
}

export default function Shop({ onAdminClick }) {
  useLocalStore();
  const products = getProducts().filter(p => p.active !== false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">WASPE<span>.</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-outline btn-sm" onClick={onAdminClick}>Admin</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '120px 0 60px', textAlign: 'center' }}>
        <div className="container-sm">
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 18,
            background: 'var(--accent-dim)', padding: '4px 14px', borderRadius: '100px'
          }}>Premium Vapes</span>
          <h1 style={{ fontSize: 'clamp(48px,9vw,96px)', fontWeight: 800, letterSpacing: '-4px', lineHeight: 1, marginBottom: 20 }}>
            NEXT<br/><span style={{ color: 'var(--accent)' }}>LEVEL</span><br/>FLAVOUR
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 400, margin: '0 auto 40px' }}>
            Vælg din model, smag og størrelse. Vi sender hjem til dig eller du henter selv.
          </p>
          <a href="#products">
            <button className="btn btn-primary btn-lg">Se alle produkter ↓</button>
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '0 0 80px' }}>
        <div className="container">
          <p className="section-title">{products.length} produkter</p>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <p style={{ fontSize: 16 }}>Ingen produkter endnu</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Opret produkter i admin-panelet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>© 2025 WASPE — Kontakt: {' '}
            <span style={{ color: 'var(--accent)' }}>0000 000</span>
          </p>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
