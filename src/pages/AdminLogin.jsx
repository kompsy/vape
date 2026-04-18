// src/pages/AdminLogin.jsx
import { useState } from 'react';

const ADMIN_PIN = '3600';

export default function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('waspe_admin', '1');
      onLogin();
    } else {
      setError('Forkert PIN-kode');
      setPin('');
    }
  }

  return (
    <div className="login-screen">
      <div className="card card-lg login-card">
        <div className="login-logo">WASPE</div>
        <p className="login-sub">Admin-panel — Kun for Ash & Nicklas</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            className="pin-input"
            placeholder="• • • •"
            value={pin}
            maxLength={8}
            onChange={e => { setPin(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full btn-lg">Log ind →</button>
        </form>
        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
          <button className="btn-ghost btn-sm" style={{ display: 'inline', padding: '4px 8px' }}
            onClick={() => window.history.back()}>← Tilbage til shop</button>
        </p>
      </div>
    </div>
  );
}
