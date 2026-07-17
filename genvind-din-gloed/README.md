# Genvind din glød på 60 dage

Salgs-landingpage til Meta-annoncer. Ét job: få hende til at købe. Seks sektioner,
ingen video. Designet er bygget med samme håndværk som
`lp.kjeldgaards.com/barrier-defense-serum`; sproget følger den korte, konkrete brief.

URL i produktion: `https://lp.kjeldgaards.com/genvind-din-gloed`
(Åbnes også ved at dobbeltklikke `index.html` — stierne er absolutte.)

## Sektioner
0. Topbjælke + masthead
1. Hero / købsspalte (produktbillede med chips + thumbnails · badge · H1 · pris­modul · Deltag nu)
2. Sådan deltager du (fire trin)
3. Anmeldelser — sidens største flade (Facebook-screenshots i masonry)
4. Spørgsmål og svar (fem)
5. Sådan ender det (de to udfald) + sidste knap
6. Footer

## Filer
```
genvind-din-gloed/
  index.html      Hele siden
  styles.css      Reference-designet + tilføjede komponenter nederst i filen
  script.js       Galleri/lightbox, accordion, sticky bar, reviews-masonry, sporing
  assets-liste.md Assets jeg mangler at få leveret
  mails.md        De fem mails (fotovejledningen ligger i mail 1)
  assets/
    bottle-hero.{webp,jpg}, before-after-1..3.webp, klinisk-studie.webp, reviews.webp
    thumbs/       Thumbnails til hero-striben
    pay/          Betalingsikoner (MobilePay først)
    reviews/      Facebook-anmeldelser som WebP + manifest.js
    og-image.jpg  Delebillede
```

## Skift priser
Ét tilbud: 2 flasker, 749 kr (normalpris 940 kr). Priserne står som tekst i
`index.html` (søg efter `749` og `940`) og som tal i `script.js` (`PRICE_2PACK`,
event-værdier). Ret begge steder.

## Skift anmeldelses-screenshots
Screenshots ligger i `assets/reviews/` som WebP og listes i `assets/reviews/manifest.js`.
**Antallet læses fra mappen — det er ikke hardcodet.**
1. Læg de nye screenshots i kildemappen.
2. Kør `python3 .context/make_reviews.py` (kildemappe = `SRC` øverst i scriptet;
   konverterer til WebP og genskriver `manifest.js`).
3. Masonry-griddet bygger sig selv ved næste page-load. Klik zoomer et billede op.

## Hvor videoen sættes ind, når den er klar
Der er ingen video nu, og der er bevidst ingen pladsholder. Når en video er klar,
er det naturlige sted øverst i hero-galleriet (venstre spalte): erstat/tilføj et
poster-billede, der loader `<video preload="none">` ved klik.

## Sporing (§7)
`script.js` pusher til `window.dataLayer`: `view_content` (load), `add_to_cart`
(første CTA-klik), `begin_checkout` (checkout-knap). Hver knap sender `button`
(masthead / hero / steps / reviews / final / sticky). Tilføj GTM/gtag i `<head>` for
at aktivere (placeholder: `GA4_ID`).

## Checkout-URL
Placeholder i `script.js` (`CHECKOUT_URL`) og på hero- og final-knappen:
`https://kjeldgaards.com/checkout/genvind-din-gloed`. Peg den på det rigtige flow.
