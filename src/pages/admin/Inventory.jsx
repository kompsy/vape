// src/pages/admin/Inventory.jsx
import { getProducts, updateProduct } from '../../store';
import { useLocalStore, useToast } from '../../hooks';

export default function Inventory() {
  useLocalStore();
  const products = getProducts();
  const { showToast, ToastEl } = useToast();

  function updateStock(productId, variantId, delta) {
    const p = products.find(pp => pp.id === productId);
    if (!p) return;
    const variants = p.variants.map(v =>
      v.id === variantId ? { ...v, stock: Math.max(0, (v.stock || 0) + delta) } : v
    );
    updateProduct(productId, { ...p, variants });
    showToast('Lager opdateret');
  }

  function setStock(productId, variantId, val) {
    const p = products.find(pp => pp.id === productId);
    if (!p) return;
    const variants = p.variants.map(v =>
      v.id === variantId ? { ...v, stock: Math.max(0, parseInt(val) || 0) } : v
    );
    updateProduct(productId, { ...p, variants });
  }

  const allVariants = products.flatMap(p =>
    (p.variants || []).map(v => ({ ...v, productId: p.id, productName: p.name }))
  );
  const totalValue = allVariants.reduce((s, v) => s + (v.costPrice || 0) * (v.stock || 0), 0);
  const totalSaleValue = allVariants.reduce((s, v) => s + (v.salePrice || 0) * (v.stock || 0), 0);
  const totalStock = allVariants.reduce((s, v) => s + (v.stock || 0), 0);

  return (
    <div>
      <h1 className="admin-page-title">Lagerstyring</h1>
      <p className="admin-page-sub">Live overblik over alle varianter</p>

      <div className="grid-3 mb-24">
        <div className="card stat-card">
          <p className="stat-label">Total lager</p>
          <p className="stat-value accent">{totalStock} stk.</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Lagerværdi (kostpris)</p>
          <p className="stat-value">{totalValue.toLocaleString('da-DK')} kr</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Potentiel omsætning</p>
          <p className="stat-value green">{totalSaleValue.toLocaleString('da-DK')} kr</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <p>Ingen produkter oprettet endnu</p>
        </div>
      ) : (
        products.map(p => (
          <div key={p.id} className="card mb-16">
            <div className="flex-between mb-16">
              <h3 style={{ fontSize: 16, fontFamily: 'Syne, sans-serif' }}>{p.name}</h3>
              <span className="badge badge-muted" style={{ fontSize: 11 }}>{p.variants?.length || 0} varianter</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Smag</th>
                    <th>Sug</th>
                    <th>Lager</th>
                    <th>Kostpris</th>
                    <th>Salgspris</th>
                    <th>Fortjeneste</th>
                    <th>Lagerværdi</th>
                    <th>Juster</th>
                  </tr>
                </thead>
                <tbody>
                  {(p.variants || []).map(v => {
                    const profit = (v.salePrice || 0) - (v.costPrice || 0);
                    const stockVal = (v.costPrice || 0) * (v.stock || 0);
                    return (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 500 }}>{v.flavor}</td>
                        <td>{v.puffs}</td>
                        <td>
                          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: v.stock > 10 ? 'var(--green)' : v.stock > 0 ? 'var(--amber)' : 'var(--red)' }}>
                            {v.stock || 0}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text2)' }}>{v.costPrice || 0} kr</td>
                        <td style={{ color: 'var(--accent)' }}>{v.salePrice || 0} kr</td>
                        <td style={{ color: profit > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{profit} kr</td>
                        <td style={{ color: 'var(--text2)' }}>{stockVal.toLocaleString('da-DK')} kr</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={() => updateStock(p.id, v.id, -1)}
                              style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)', width: 28, height: 28, borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
                            >−</button>
                            <input
                              type="number"
                              min="0"
                              value={v.stock || 0}
                              onChange={e => setStock(p.id, v.id, e.target.value)}
                              className="form-input"
                              style={{ width: 64, padding: '4px 8px', textAlign: 'center', fontSize: 13 }}
                            />
                            <button
                              onClick={() => updateStock(p.id, v.id, 1)}
                              style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text)', width: 28, height: 28, borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
                            >+</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      {ToastEl}
    </div>
  );
}
