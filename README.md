# Vanità Boutique — Setup Snipcart

## File modificati

| File | Stato |
|------|-------|
| `js/catalogo.js` | Aggiornato — bottoni con attributi Snipcart |
| `css/checkout.css` | Aggiornato — stili icona carrello + tema oro |
| `index.html` | Aggiornato — script Snipcart + icona carrello |
| `catalogo.html` | Aggiornato — script Snipcart + icona carrello |

---

## Attivare Snipcart in 3 passi

### Passo 1 — Crea un account
Vai su https://snipcart.com → Sign Up (gratis, nessuna carta richiesta)

### Passo 2 — Copia la tua API Key pubblica
Dashboard Snipcart → Account → API Keys → copia la **Public Test API Key**

### Passo 3 — Incolla la chiave nel sito
In **index.html** e **catalogo.html**, cerca questa riga:

```html
<div hidden id="snipcart" data-api-key="YOUR_SNIPCART_API_KEY" data-currency="eur"></div>
```

Sostituisci `YOUR_SNIPCART_API_KEY` con la tua chiave. Es:

```html
<div hidden id="snipcart" data-api-key="MjE1ZjI4OTctY..." data-currency="eur"></div>
```

**Fatto!** Il carrello è attivo. Snipcart gestisce pagamento (Stripe/PayPal), email di conferma, e dashboard ordini.

---

## Come passare in produzione

1. Dashboard Snipcart → sostituisci la chiave test con la **Live API Key**
2. Collega Stripe o PayPal dalla dashboard Snipcart → Payment
3. Carica il sito su hosting pubblico (GitHub Pages, Netlify, ecc.)

> **Nota:** In produzione, `data-item-url` deve puntare a un URL pubblico
> accessibile da Snipcart per la verifica prezzi. Il JS già costruisce
> l'URL in base a `window.location.origin`, quindi funziona automaticamente
> se il sito è online.

---

## Aggiungere prodotti

Modifica `data/prodotti.json`:
```json
{
  "id": 5,
  "foto": "img/mio-prodotto.jpg",
  "nome": "Nome Prodotto",
  "marca": "Brand",
  "prezzo": "75,00€",
  "descrizione": "Descrizione.",
  "categoria": "Gioielli"
}
```

## Costi Snipcart
- **Gratis** fino a €500/mese di vendite
- Poi **1% per transazione** (+ commissioni Stripe/PayPal ~1.4%+25¢)
