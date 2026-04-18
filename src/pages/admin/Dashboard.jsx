// src/pages/admin/Dashboard.jsx
import { getStats, getOrders, updateOrderStatus } from '../../store';
import { useLocalStore } from '../../hooks';

function StatCard({ label, value, className }) {
  return (
    <div className="card stat-card">
      <p className="stat-label">{label}</p>
      <p className={`stat-value ${className || ''}`}>{value}</p>
    </div>
  );
}

const STATUS_LABELS = { pending: 'Afventer', confirmed: 'Bekræftet', completed: 'Leveret', cancelled: 'Annulleret' };
const STATUS_BADGE = { pending: 'badge-amber', confirmed: 'badge-accent', completed: 'badge-green', cancelled: 'badge-red' };

export default function Dashboard() {
  useLocalStore();
  const stats = getStats();
  const orders = getOrders().slice().reverse();

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Realtidsoverblik over salg og lager</p>

      <div className="grid-4 mb-24">
        <StatCard label="Total omsætning" value={`${stats.totalRevenue.toLocaleString('da-DK')} kr`} className="accent" />
        <StatCard label="Fortjeneste" value={`${stats.profit.toLocaleString('da-DK')} kr`} className="green" />
        <StatCard label="Indkøbsomkostninger" value={`${stats.totalCost.toLocaleString('da-DK')} kr`} />
        <StatCard label="Antal ordrer" value={stats.orderCount} />
      </div>

      <div className="grid-2 mb-24">
        <div className="card">
          <p className="section-title">Top produkter</p>
          {stats.topProducts.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 14 }}>Ingen salg endnu</p>
          ) : stats.topProducts.map(([name, qty]) => (
            <div key={name} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14 }}>{name}</span>
              <span className="badge badge-accent">{qty} solgt</span>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="section-title">Top smage</p>
          {stats.topFlavors.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 14 }}>Ingen salg endnu</p>
          ) : stats.topFlavors.map(([name, qty]) => (
            <div key={name} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14 }}>{name}</span>
              <span className="badge badge-muted">{qty} solgt</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="section-title mb-16">Seneste ordrer</p>
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Ingen ordrer endnu</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Kunde</th>
                  <th>Produkt</th>
                  <th>Levering</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Handling</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontSize: 12, color: 'var(--text2)' }}>{new Date(o.createdAt).toLocaleString('da-DK', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{o.customerName}</div>
                      {o.customerPhone && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{o.customerPhone}</div>}
                      {o.customerAddress && <div style={{ fontSize: 12, color: 'var(--text3)' }}>{o.customerAddress}</div>}
                    </td>
                    <td>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ fontSize: 13 }}>
                          {item.productName} · {item.flavorName} · {item.puffs} · ×{item.qty}
                        </div>
                      ))}
                    </td>
                    <td>
                      <span className="badge badge-muted" style={{ fontSize: 11 }}>
                        {o.delivery === 'ship' ? '📦 Forsendelse' : '🛒 Afhentning'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{o.total} kr</td>
                    <td><span className={`badge ${STATUS_BADGE[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: 12, width: 130 }}
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
