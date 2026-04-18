// src/App.jsx
import { useState } from 'react';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import './index.css';

export default function App() {
  const [view, setView] = useState('shop'); // 'shop' | 'admin'

  return view === 'admin'
    ? <Admin onShopClick={() => setView('shop')} />
    : <Shop onAdminClick={() => setView('admin')} />;
}
