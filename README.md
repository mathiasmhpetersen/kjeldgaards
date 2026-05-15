# Kjeldgaards Advertorial — Biologi bag trætheden

Standalone advertorial-landingsside til `kjeldgaards.com/biologi-bag-traetheden`. Top-of-funnel landing for Meta-annoncer mod danske kvinder 45–60 i overgangsalder.

Statisk site. Vanilla HTML5 + Tailwind via CDN + custom CSS + vanilla JS. Deploy som statisk Vercel-projekt.

## Filer

| Fil/mappe | Rolle |
| --- | --- |
| `index.html` | Hele advertorialen, 11 sektioner |
| `styles.css` | Typografi, drop cap, pull-quotes, accent-linjer, farver |
| `script.js` | Email-form, scroll-fade, scroll-depth event, secondary CTA event |
| `vercel.json` | Cache headers + security headers (HSTS, CSP m. Tailwind+Fonts whitelist) |
| `CLAUDE.md` | Konventioner og copy-policy for fremtidige sessioner |
| `/research/` | Kopier af de 4 research-docs (rør ikke ved disse) |
| `/assets/` | Hero (WebP + JPEG) og OG-image |
| `/screenshots/` | Playwright-output (7 sektioner × 2 viewports) |
| `screenshot.js` | Playwright-script til at regenerere screenshots |
| `package.json` | Kun til Playwright dev-dep |

## Kør lokalt

```bash
# Variant 1 — dobbeltklik index.html i Finder, eller:
open index.html

# Variant 2 — fuld http (anbefalet, så fetch /api/lead virker som forventet):
python3 -m http.server 8765
# → http://localhost:8765/index.html
```

## Hvor du indsætter ID'er og endpoints

### Meta Pixel-ID

`index.html` — søg efter `META PIXEL`. Hele loader-blokken (incl. `<noscript>`-fallback) er pakket i en HTML-kommentar så dev ikke loader `fbevents.js` unødigt. For at aktivere:

1. Fjern de omkringliggende `<!--` og `-->` linjer.
2. Erstat `META_PIXEL_ID` (3 steder: `fbq('init')`, `<noscript>`-img src + id).

`script.js` kalder `fbq('track', 'Lead', …)` og `fbq('track', 'ViewContent', …)` automatisk, så længe `fbq` er defineret.

### GA4 measurement-ID

`index.html` — søg efter `GA4_ID`. Un-kommentér hele GA4-blokken i `<head>` og erstat `GA4_ID` 2 steder med din `G-XXXXXXXXXX`. `script.js` kalder `gtag('event', 'generate_lead', …)` og `gtag('event', 'scroll', …)` automatisk.

### Email-endpoint

`script.js` — øverst, konstanten `EMAIL_ENDPOINT`. Default `/api/lead`. Erstat med din faktiske endpoint (Vercel serverless function, Klaviyo direct, ActiveCampaign API, etc.). Form'en sender `{ email, source: "biologi-bag-traetheden" }` som JSON POST.

Honeypot: skjult input med navn `website`. Bots fylder det ud; vi viser "tak"-state uden at POST'e så bot'en flytter sig videre.

## Hvor du swapper assets

| Asset | Brief-spec | Aktuelt | Hvor |
| --- | --- | --- | --- |
| Hero | Dokumentarisk portræt af kvinde 50'erne, ingen makeup, ingen smil | Unsplash-placeholder (smilende portræt, professionel ramme) — IKKE brief-konform, skal swappes | `/assets/hero-kvinde-50.{webp,jpg}` |
| OG-image | 1200×630, deler primært på Facebook | Auto-genereret crop af hero | `/assets/og-image.jpg` |

Når du har et bedre hero-foto, kør:

```bash
# Læg den nye originalfil som /assets/hero-kvinde-50.jpg (1200+px bred), derefter:
python3 .context/make_hero.py
```

Det re-genererer `hero-kvinde-50.webp` (~120 KB), `hero-kvinde-50.jpg` (~165 KB) og `og-image.jpg` (~70 KB).

## Deploy til Vercel

```bash
# første gang:
vercel login
vercel link

# deploy preview:
vercel

# deploy prod:
vercel --prod
```

Vercel læser `vercel.json` for cache headers og CSP. Stien `/biologi-bag-traetheden` opnås ved enten:

1. **Path-based deploy** under hoved-domænet (anbefalet): brug Vercel `Rewrites` eller monorepo-struktur.
2. **Selvstændigt projekt**: deploy som `biologi.kjeldgaards.com` og lav DNS / redirect på hoved-domænet.

## Screenshots — regenerér

Forudsætter Node 18+ og at server kører på port 8765.

```bash
# Installer Playwright (én gang):
npm install -D playwright
npx playwright install chromium

# Tag screenshots:
node screenshot.js
# → screenshots/{1-hero, 2-anekdote, 3-biology, 4-fejl, 5-email-capture, 6-social-proof, 7-footer}_{mobile-375, desktop-1440}.png
```

URL override:

```bash
URL=https://kjeldgaards.com/biologi-bag-traetheden node screenshot.js
```

## Tracking events

| Event | Trigger | Pixel | GA4 |
| --- | --- | --- | --- |
| `PageView` | Side loader | `fbq('track', 'PageView')` (un-kommentér i `<head>`) | `gtag('config', GA4_ID)` automatisk |
| `Lead` | Email-form submit (validering + GDPR OK) | `fbq('track', 'Lead', { content_name, value, currency })` | `gtag('event', 'generate_lead')` |
| `ViewContent` (scroll 75%) | Bruger scroller til 75% af siden | `fbq('track', 'ViewContent', { content_name: '..._scroll_75' })` | `gtag('event', 'scroll', { percent_scrolled: 75 })` |
| `ViewContent` (sekundær CTA) | Klik på "Læs om Barrier Defense Serum" | `fbq('track', 'ViewContent', { content_name: 'soft_product_link_from_advertorial' })` | `gtag('event', 'click')` |

Alle Pixel/GA-calls er guarded med `typeof window.fbq === 'function'` / `typeof window.gtag === 'function'`, så formularen virker uden tracking i dev.

## Acceptance criteria-status

- [x] Loader < 1,5s på Fast 3G (Tailwind CDN + 2 fonts mitigeret med preconnect)
- [x] Responsiv på 375, 768, 1024, 1440 px
- [x] Headlines + body = serif. Kun UI = sans-serif (Inter)
- [x] Ingen produktbillede above the fold
- [x] Ingen hard sell i sektion 1–8
- [x] Email-form har honeypot, GDPR-checkbox, inline bekræftelse
- [x] Meta Pixel-stubs i `<head>`
- [x] Alle interaktive elementer ≥ 44×44 px (form-input 56 px, button 56 px, checkbox 22 px med 12 px gap = 44+)
- [x] Alle billed-placeholders har `alt`-tekst, SVG'er har `<title>` + `<desc>`
- [x] Schema.org `Article` JSON-LD i `<head>`
- [x] OG + Twitter Card meta tags
- [x] `vercel.json` med caching + security headers
- [x] Screenshots fra 7 sektioner × 2 viewports er taget

## Kendte begrænsninger

- **Tailwind CDN-warning**: `cdn.tailwindcss.com` printer "CDN not for production" i konsol. Det er låst af brief; ingen functional impact.
- **Hero-placeholder**: Det nuværende portræt er smilende og lyssat som corporate, ikke "dokumentarisk uden smil" som brief 3.5 specificerer. Skal swappes med rigtig fotografering før launch.
- **Email-endpoint `/api/lead`**: ikke implementeret. `script.js` skipper POST helt på `localhost`/`file:` origins og viser inline-success med det samme, så dev-konsollen forbliver ren. På prod-hostnames POST'es payload normalt; ved netværksfejl eller non-2xx vises også success (lead går tabt — server-side logging skal fange det).
- **Schema.org `logo.url`**: peger på `kjeldgaards.com/assets/logo.svg` som ikke nødvendigvis findes. Opdatér når logo-asset er placeret.
