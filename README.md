# WASPE — Vape Shop + Admin Panel

## Deploy på Vercel (gratis, ingen domæne nødvendigt)

### Første gang

1. Gå til [github.com](https://github.com) → opret gratis konto hvis du ikke har en
2. Opret et **nyt repository** → kald det `waspe`
3. Upload alle filerne fra dette projekt (eller brug GitHub Desktop)
4. Gå til [vercel.com](https://vercel.com) → log ind med GitHub
5. Klik **"New Project"** → import `waspe` repo
6. Vercel auto-detekterer React → klik **Deploy**
7. Du får en URL: `waspe-xxx.vercel.app` — del den med kunder!

### Opdater siden fremover

Upload ændrede filer til GitHub → Vercel deployer automatisk inden for ~30 sekunder.

---

## Admin-panel

- Tryk **"Admin"** i øverste højre hjørne på shoppen
- PIN: **3600**
- Kun Ash & Nicklas kender PIN

---

## Funktioner

### Shop (kunde-siden)
- Vælg model, smag, antal sug, antal stk.
- Vælg forsendelse eller afhentning
- Simpelt checkout-flow (3 klik)
- Kontaktnummer vises ved afslutning (pt. 0000 000 — skift i `ProductModal.jsx` linje 6)

### Admin
- **Dashboard**: Omsætning, fortjeneste, top produkter/smage, alle ordrer
- **Produkter**: Opret/rediger/slet produkter med billede + video upload
- **Lager**: Realtidsoversigt, juster lager pr. variant

---

## Skift telefonnummer

Åbn `src/components/ProductModal.jsx` → linje 6:
```js
const CONTACT_PHONE = '0000 000'; // ← skift her
```

---

## Tilføj det første produkt

1. Log ind i admin (PIN: 3600)
2. Klik **Produkter** → **+ Nyt produkt**
3. Udfyld navn: `WASPE BAR - 60.000 SUG`
4. Tilføj beskrivelse
5. Upload billede og/eller video
6. Tilføj varianter (smag + sug + lager + priser)
7. Gem → produktet vises straks i shoppen

---

## Tech stack
- React 18 (Create React App)
- 100% localStorage — ingen backend, ingen database
- Vercel hosting (gratis)
