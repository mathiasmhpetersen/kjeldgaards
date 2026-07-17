# Genvind din glød på 8 uger

Landingpage til Meta-annoncer. Vi søger 100 danske kvinder, der vil bruge Barrier
Defense i 60 dage og tage et billede før og efter. Målet er billederne, ikke salget.

URL i produktion: `https://lp.kjeldgaards.com/genvind-din-gloed`
Åbnes også ved at dobbeltklikke `index.html` lokalt (alle stier er absolutte og
virker, når mappen serveres fra roden).

## Filer

```
genvind-din-gloed/
  index.html               Hele siden, 10 sektioner (§7 i briefen)
  styles.css               Design: Newsreader / Atkinson Hyperlegible / IBM Plex Mono
  script.js                Accordion, reviews-lightbox, tilmeldings-logik, sporing
  fotovejledning-kort.svg  Trykklar A6-vejledning til kortet i pakken
  assets-liste.md          Alle assets, jeg mangler at få leveret (rigtige fotos)
  mails.md                 Udkast til de fem mails i forløbet
  assets/
    bottle.{webp,jpg}      Flaskebillede i hero (pt. genbrugt fra produktsiden)
    morten.{webp,jpg}      PLACEHOLDER — skal erstattes med rigtigt foto af Morten
    og-image.jpg           Delebillede (1200×630) — pt. genereret placeholder
    pay/                   Betalingsikoner (MobilePay først)
    reviews/               Facebook-anmeldelser som WebP + manifest.js
```

## Skift priser

Priserne står som tekst i `index.html` (søg efter `749` og `940`) og som tal i
`script.js` (event-værdier). Der er kun ét tilbud: 2 flasker, 749 kr. Skal beløbet
ændres, ret begge steder.

## Skift anmeldelses-screenshots

Screenshots ligger i `assets/reviews/` som WebP og listes i `assets/reviews/manifest.js`.
**Antallet læses fra mappen — det er ikke hardcodet.** Sådan opdaterer du dem:

1. Læg de nye Facebook-screenshots i kildemappen.
2. Kør `python3 .context/make_reviews.py` (konverterer til WebP + genskriver `manifest.js`).
   Kildemappen står øverst i scriptet (`SRC`).
3. Griddet bygger sig selv ud fra det nye manifest ved næste page-load.

Griddet er et ujævnt masonry (2 kolonner mobil, 3 tablet, 4 desktop). Billederne
vises, som de er — klik zoomer et billede op.

## Hvor videoen sættes ind, når den er klar

Der er **ingen video** på siden nu, og der er bevidst ikke lavet en pladsholder til
den (§1 og §7 i briefen). Når videoen er klar, indsættes den i hero, mellem
`.hero-sub` og knappen i `index.html`. Byg den som et klikbart poster-billede, der
loader `<video preload="none">` ved klik — samme mønster som produktsiden bruger.

## Sporing (§9)

`script.js` pusher til `window.dataLayer`:

- `view_content` — ved load
- `photo_guide_view` — når fotovejledningen (sektion 5) kommer i syne
- `add_to_cart` — første gang en "Deltag nu"-knap klikkes
- `begin_checkout` — når checkout-knappen i tilmeldingen klikkes

Tilføj GTM-container eller gtag-snippet i `<head>` for at aktivere. ID-placeholder: `GA4_ID`.

## Tilmeldingens logik

Tre spørgsmål før betaling. **Svarer hun "Nej" til spørgsmål 3** (vil du tage
billederne), forsvinder betalingsknappen, og hun får en rolig besked med link til
den almindelige shop. Det er med vilje — billederne er hele grunden til, at siden findes.

## Checkout-URL

Placeholder i `script.js`: `CHECKOUT_URL` og `href` på `[data-checkout-btn]`.
Peg den på det rigtige checkout-flow for 2-flaske-tilbuddet.
