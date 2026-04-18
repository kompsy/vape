// src/components/ProductModal.jsx
import { useState } from 'react';
import { addOrder } from '../store';
import { useToast } from '../hooks';

const CONTACT_PHONE = '0000 000';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [selFlavor, setSelFlavor] = useState(null);
  const [selPuffs, setSelPuffs] = useState(null);
  const [delivery, setDelivery] = useState('pickup');
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState('select'); // 'select' | 'checkout' | 'success'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { showToast, ToastEl } = useToast();

  const allFlavors = [...new Set(product.variants.map(v => v.flavor))];
  const allPuffs = selFlavor
    ? [...new Set(product.variants.filter(v => v.flavor === selFlavor).map(v => v.puffs))]
    : [...new Set(product.variants.map(v => v.puffs))];

  const selectedVariant = product.variants.find(
    v => v.flavor === selFlavor && v.puffs === selPuffs
  );
  const hasStock = selectedVariant && selectedVariant.stock > 0;
  const totalPrice = selectedVariant ? selectedVariant.salePrice * qty : 0;

  function handleFlavorClick(f) {
    setSelFlavor(f);
    setSelPuffs(null);
  }

  function isPuffAvail(p) {
    if (!selFlavor) return true;
    const v = product.variants.find(vv => vv.flavor === selFlavor && vv.puffs === p);
    return v && v.stock > 0;
  }

  function canProceed() {
    return selFlavor && selPuffs && hasStock;
  }

  function handleOrder() {
    if (!name.trim()) { showToast('Indtast dit navn', 'error'); return; }
    if (delivery === 'ship' && !address.trim()) { showToast('Indtast din adresse', 'error'); return; }

    const order = {
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      delivery,
      items: [{
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        flavorName: selectedVariant.flavor,
        puffs: selectedVariant.puffs,
        qty,
        salePrice: selectedVariant.salePrice,
        costPrice: selectedVariant.costPrice || 0,
      }],
      total: totalPrice,
    };
    addOrder(order);
    setStep('success');
  }

  const mediaEl = product.videoUrl
    ? <video src={product.videoUrl} autoPlay muted loop playsInline className="w-full" style={{ maxHeight: 280, objectFit: 'cover' }} />
    : product.imageUrl
    ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: 280, objectFit: 'cover' }} />
    : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>

        {mediaEl && <div className="modal-media">{mediaEl}</div>}

        <div className="modal-body">
          {step === 'success' ? (
            <div className="checkout-success">
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2>Ordre modtaget!</h2>
              <p>{delivery === 'ship'
                ? 'Vi sender din vare hurtigst muligt. Kontakt os for betaling:'
                : 'Din ordre er registreret. Kontakt os for aftale om afhentning:'
              }</p>
              <div className="phone">{CONTACT_PHONE}</div>
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>Skriv til os på WhatsApp eller SMS</p>
              <button className="btn btn-outline mt-24" onClick={onClose}>Luk</button>
            </div>
          ) : step === 'checkout' ? (
            <>
              <h2 className="modal-title mb-8">{product.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>
                {selFlavor} · {selPuffs} · {qty} stk.
              </p>

              <div className="form-group mb-16">
                <label className="form-label">Dit navn *</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Fulde navn" />
              </div>
              <div className="form-group mb-16">
                <label className="form-label">Telefon (valgfri)</label>
                <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+45 00 00 00 00" />
              </div>
              {delivery === 'ship' && (
                <div className="form-group mb-16">
                  <label className="form-label">Leveringsadresse *</label>
                  <input className="form-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Vej, by, postnr." />
                </div>
              )}

              <div className="order-summary">
                <div className="order-summary-row"><span>{product.name}</span><span>{selectedVariant?.salePrice} kr</span></div>
                <div className="order-summary-row"><span>Antal</span><span>× {qty}</span></div>
                <div className="order-summary-row"><span>Levering</span><span>{delivery === 'ship' ? 'Forsendelse' : 'Afhentning'}</span></div>
                <div className="order-summary-row total"><span>Total</span><span>{totalPrice} kr</span></div>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
                {delivery === 'ship'
                  ? '💳 Betaling aftales via SMS/WhatsApp efter bestilling.'
                  : '💵 Betaling sker ved afhentning (kontant/MobilePay).'}
              </p>

              <div className="flex gap-8">
                <button className="btn btn-outline btn-sm" onClick={() => setStep('select')}>← Tilbage</button>
                <button className="btn btn-primary btn-full" onClick={handleOrder}>Bekræft ordre</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="modal-title">{product.name}</h2>
              {product.description && <p className="modal-desc">{product.description}</p>}

              {allFlavors.length > 0 && (
                <>
                  <p className="selector-label">Smag</p>
                  <div className="pill-group">
                    {allFlavors.map(f => (
                      <button key={f} className={`pill ${selFlavor === f ? 'active' : ''}`} onClick={() => handleFlavorClick(f)}>{f}</button>
                    ))}
                  </div>
                </>
              )}

              {allPuffs.length > 0 && (
                <>
                  <p className="selector-label">Antal sug</p>
                  <div className="pill-group">
                    {allPuffs.map(p => (
                      <button
                        key={p}
                        className={`pill ${selPuffs === p ? 'active' : ''} ${!isPuffAvail(p) ? 'oos' : ''}`}
                        onClick={() => isPuffAvail(p) && setSelPuffs(p)}
                        disabled={!isPuffAvail(p)}
                      >{p}</button>
                    ))}
                  </div>
                </>
              )}

              <p className="selector-label">Antal</p>
              <div className="qty-control mb-16">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div className="qty-display">{qty}</div>
                <button className="qty-btn" onClick={() => {
                  if (selectedVariant && qty >= selectedVariant.stock) return;
                  setQty(q => q + 1);
                }}>+</button>
              </div>

              <p className="selector-label mb-8">Levering</p>
              <div className="delivery-options">
                <button className={`delivery-opt ${delivery === 'pickup' ? 'active' : ''}`} onClick={() => setDelivery('pickup')}>
                  <div className="delivery-opt-title">🛒 Afhentning</div>
                  <div className="delivery-opt-sub">Du henter selv</div>
                </button>
                <button className={`delivery-opt ${delivery === 'ship' ? 'active' : ''}`} onClick={() => setDelivery('ship')}>
                  <div className="delivery-opt-title">📦 Forsendelse</div>
                  <div className="delivery-opt-sub">Vi sender til dig</div>
                </button>
              </div>

              {selectedVariant && (
                <div className="order-summary">
                  <div className="order-summary-row"><span>Pris pr. stk.</span><span>{selectedVariant.salePrice} kr</span></div>
                  {selectedVariant.stock <= 5 && <div className="order-summary-row"><span style={{ color: 'var(--amber)' }}>⚠ Kun {selectedVariant.stock} tilbage</span><span></span></div>}
                  <div className="order-summary-row total"><span>Total</span><span>{totalPrice} kr</span></div>
                </div>
              )}

              <button
                className={`btn btn-primary btn-full btn-lg ${!canProceed() ? 'disabled' : ''}`}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.4 }}
                onClick={() => setStep('checkout')}
              >
                {!selFlavor ? 'Vælg smag' : !selPuffs ? 'Vælg antal sug' : !hasStock ? 'Udsolgt' : 'Fortsæt til bestilling →'}
              </button>
            </>
          )}
        </div>
      </div>
      {ToastEl}
    </div>
  );
}
