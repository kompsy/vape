// src/hooks.js
import { useState, useEffect, useCallback } from 'react';

export function useLocalStore() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('waspe_update', handler);
    return () => window.removeEventListener('waspe_update', handler);
  }, []);
  return tick;
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  const ToastEl = toast ? (
    <div className={`toast ${toast.type}`}>
      {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
    </div>
  ) : null;
  return { showToast, ToastEl };
}
