// src/pages/admin/Products.jsx
import { useState } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../store';
import { useLocalStore, useToast } from '../../hooks';

const EMPTY_VARIANT = { id: '', flavor: '', puffs: '', stock: 0, salePrice: 0, costPrice: 0 };

function newVariant() {
  return { ...EMPTY_VARIANT, id: crypto.randomUUID() };
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', description: '', imageUrl: '', videoUrl: '', active: true, variants: [newVariant()]
  });
  const { showToast, ToastEl } = useToast();

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function setVariant(id, k, v) {
    setForm(f => ({ ...f, variants: f.variants.map(vv => vv.id === id ? { ...vv, [k]: v } : vv) }));
  }

  function addVariant() { setForm(f => ({ ...f, variants: [...f.variants, newVariant()] })); }
  function removeVariant(id) { setForm(f => ({ ...f, variants: f.variants.filter(v => v.id !== id) })); }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Billedet må max. være 5MB', 'error'); return; }
    const b64 = await fileToBase64(file);
    setField('imageUrl', b64);
  }

  async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) { showToast('Video må max. være 30MB', 'error'); return; }
    const b64 = await fileToBase64(file);
    setField('videoUrl', b64);
  }

  function handleSave() {
    if (!form.name.trim()) { showToast('Produkt skal have et navn', 'error'); return; }
    if (form.variants.length === 0) { showToast('Tilføj mindst én variant', 'error'); return; }
    for (const v of form.variants) {
      if (!v.flavor.trim()) { showToast('Alle varianter skal have en smag', 'error'); return; }
      if (!v.puffs.toString().trim()) { showToast('Alle varianter skal have antal sug', 'error'); return; }
    }
    onSave(form);
  }

  return (
    <div className="card card-lg" style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 20, fontSize: 18 }}>{initial ? 'Rediger produkt' : 'Nyt produkt'}</h3>

      <div className="grid-2 mb-16">
        <div className="form-group">
          <label className="form-label">Produktnavn *</label>
          <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="fx WASPE BAR - 60.000 SUG" />
        </div>
        <div className="form-group">
          <label className="form-label">Vis i shop</label>
          <select className="form-select" value={form.active ? 'yes' : 'no'} onChange={e => setField('active', e.target.value === 'yes')}>
            <option value="yes">Aktiv (vises i shop)</option>
            <option value="no">Skjult (vises ikke)</option>
          </select>
        </div>
      </div>

      <div className="form-group mb-20">
        <label className="form-label">Produktbeskrivelse</label>
        <textarea className="form-textarea" value={form.description} onChange={e => setField('description', e.target.value)}
          placeholder="Beskriv produktet kort — smag, oplevelse, størrelse osv." style={{ minHeight: 90 }} />
        <span className="form-hint">Vises på produktkortet i shoppen</span>
      </div>

      {/* Media */}
      <div className="grid-2 mb-24">
        <div>
          <label className="form-label mb-8">Produktbillede</label>
          {form.imageUrl ? (
            <div className="media-preview">
              <img src={form.imageUrl} alt="preview" />
              <button className="media-remove" onClick={() => setField('imageUrl', '')}>×</button>
            </div>
          ) : (
            <div className="media-upload">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', opacity: 0.4 }}>
                <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>Klik eller træk billede hertil</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>JPG, PNG · max 5MB</p>
            </div>
          )}
        </div>
        <div>
          <label className="form-label mb-8">Produktvideo (valgfri)</label>
          {form.videoUrl ? (
            <div className="media-preview">
              <video src={form.videoUrl} controls style={{ maxHeight: 140 }} />
              <button className="media-remove" onClick={() => setField('videoUrl', '')}>×</button>
            </div>
          ) : (
            <div className="media-upload">
              <input type="file" accept="video/*" onChange={handleVideoUpload} />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', opacity: 0.4 }}>
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>Klik eller træk video hertil</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>MP4, MOV · max 30MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      <div className="flex-between mb-16">
        <p className="section-title" style={{ margin: 0 }}>Varianter (smag + sug)</p>
        <button className="btn btn-outline btn-sm" onClick={addVariant}>+ Tilføj variant</button>
      </div>

      <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 32px', gap: 10, fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          <span>Smag</span><span>Antal sug</span><span>Lager</span><span>Salg/Kost (kr)</span><span></span>
        </div>
      </div>

      {form.variants.map(v => (
        <div key={v.id} className="variant-row">
          <input className="form-input" value={v.flavor} onChange={e => setVariant(v.id, 'flavor', e.target.value)} placeholder="fx Blueberry Ice" />
          <input className="form-input" value={v.puffs} onChange={e => setVariant(v.id, 'puffs', e.target.value)} placeholder="60.000" />
          <input className="form-input" type="number" min="0" value={v.stock} onChange={e => setVariant(v.id, 'stock', +e.target.value)} placeholder="0" />
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="form-input" type="number" min="0" value={v.salePrice} onChange={e => setVariant(v.id, 'salePrice', +e.target.value)} placeholder="Salgspris" title="Salgspris (kr)" />
            <input className="form-input" type="number" min="0" value={v.costPrice} onChange={e => setVariant(v.id, 'costPrice', +e.target.value)} placeholder="Kostpris" title="Kostpris (kr)" />
          </div>
          <button
            onClick={() => removeVariant(v.id)}
            style={{ background: 'var(--red-dim)', border: 'none', color: 'var(--red)', width: 32, height: 32, borderRadius: 6, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >×</button>
        </div>
      ))}

      {form.variants.length > 0 && (
        <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text2)', marginTop: 8 }}>
          Fortjeneste per variant:{' '}
          {form.variants.filter(v => v.salePrice && v.costPrice).map(v => (
            <span key={v.id} style={{ marginRight: 12 }}>
              <span style={{ color: 'var(--text)' }}>{v.flavor || '?'}</span>:{' '}
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>{v.salePrice - v.costPrice} kr</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-8 mt-24">
        <button className="btn btn-outline" onClick={onCancel}>Annuller</button>
        <button className="btn btn-primary" onClick={handleSave}>Gem produkt →</button>
      </div>
      {ToastEl}
    </div>
  );
}

export default function Products() {
  useLocalStore();
  const products = getProducts();
  const [editing, setEditing] = useState(null); // null | 'new' | product.id
  const [editData, setEditData] = useState(null);
  const { showToast, ToastEl } = useToast();

  function handleSave(form) {
    if (editing === 'new') {
      addProduct(form);
      showToast('Produkt oprettet!');
    } else {
      updateProduct(editing, form);
      showToast('Produkt opdateret!');
    }
    setEditing(null);
    setEditData(null);
  }

  function handleEdit(p) {
    setEditing(p.id);
    setEditData(p);
  }

  function handleDelete(id) {
    if (!window.confirm('Slet dette produkt? Det kan ikke fortrydes.')) return;
    deleteProduct(id);
    showToast('Produkt slettet');
  }

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="admin-page-title">Produkter</h1>
          <p className="admin-page-sub">{products.length} produkter oprettet</p>
        </div>
        {editing !== 'new' && (
          <button className="btn btn-primary" onClick={() => { setEditing('new'); setEditData(null); }}>+ Nyt produkt</button>
        )}
      </div>

      {editing === 'new' && (
        <ProductForm onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      {products.length === 0 && editing !== 'new' ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>Ingen produkter endnu</p>
          <p style={{ fontSize: 13 }}>Klik "+ Nyt produkt" for at tilføje dit første produkt</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => {
            const totalStock = p.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0;
            const prices = p.variants?.map(v => v.salePrice).filter(Boolean) || [];
            const minPrice = prices.length ? Math.min(...prices) : null;

            return editing === p.id ? (
              <ProductForm key={p.id} initial={editData} onSave={handleSave} onCancel={() => setEditing(null)} />
            ) : (
              <div key={p.id} className="card" style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: 10, background: 'var(--bg4)', overflow: 'hidden', flexShrink: 0 }}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : p.videoUrl
                    ? <video src={p.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 20 }}>?</div>
                  }
                </div>
                <div>
                  <div className="flex gap-8 mb-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                    <span className={`badge ${p.active !== false ? 'badge-green' : 'badge-muted'}`} style={{ fontSize: 11 }}>
                      {p.active !== false ? 'Aktiv' : 'Skjult'}
                    </span>
                  </div>
                  {p.description && <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6, maxWidth: 500 }}>{p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}</p>}
                  <div className="flex gap-12" style={{ fontSize: 12, color: 'var(--text3)', flexWrap: 'wrap' }}>
                    <span>{p.variants?.length || 0} varianter</span>
                    <span>Lager: <span style={{ color: totalStock > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{totalStock} stk.</span></span>
                    {minPrice && <span>Fra <span style={{ color: 'var(--accent)' }}>{minPrice} kr</span></span>}
                  </div>
                </div>
                <div className="flex gap-8">
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Rediger</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Slet</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {ToastEl}
    </div>
  );
}
