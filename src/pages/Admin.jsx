// src/pages/Admin.jsx
import { useState } from 'react';
import AdminLogin from './AdminLogin';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Inventory from './admin/Inventory';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'products', label: 'Produkter', icon: '⊞' },
  { id: 'inventory', label: 'Lager', icon: '⊟' },
];

export default function Admin({ onShopClick }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('waspe_admin') === '1');
  const [page, setPage] = useState('dashboard');

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const pageEl = page === 'dashboard' ? <Dashboard />
    : page === 'products' ? <Products />
    : page === 'inventory' ? <Inventory />
    : <Dashboard />;

  function logout() {
    sessionStorage.removeItem('waspe_admin');
    setAuthed(false);
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent)', marginBottom: 2 }}>WASPE</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`admin-nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onShopClick}>
            ← Til shop
          </button>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--red)' }} onClick={logout}>
            Log ud
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {pageEl}
      </main>
    </div>
  );
}
