# Kjeldgaards Landingpages — CLAUDE.md

Subdomæne `lp.kjeldgaards.com` huser alle advertorial- og campaign-landingsider. Roden (`lp.kjeldgaards.com/`) er en intern hub (noindex) der lister aktive sider. Hver landingpage bor i sin egen slug-mappe, fx `lp.kjeldgaards.com/biologi-bag-traetheden`.

Første landingpage: Biologi bag trætheden — top-of-funnel for Meta-annoncer mod danske kvinder 45–60 i overgangsalder. Kjeldgaards Barrier Defense Serum.

## Sandheds-hierarki ved konflikt

1. Filerne i `/research/` (de 4 .docx, identiske kopier af `.context/attachments/`)
2. Den oprindelige brief (sendt af bruger som pasted_text i `.context/attachments/`)
3. Denne CLAUDE.md
4. Eksisterende kode

Hvis noget konflikter, slå op i research-dokumenterne — ikke i intuition.

## Locked tech-stack (rør ikke uden eksplicit accept)

- Vanilla HTML5, én fil per landingpage (`<slug>/index.html`)
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) — INGEN build step
- Custom CSS i `<slug>/styles.css` (typografi, drop cap, pull-quotes, accent, farver)
- Vanilla JS i `<slug>/script.js` — ingen frameworks
- Hub-siden i roden (`/index.html`) er standalone med inline CSS, ingen Tailwind
- Deploy-target: Vercel statisk (`cleanUrls: true` → `/biologi-bag-traetheden` serverer `/biologi-bag-traetheden/index.html`)
- Skal kunne åbnes ved at dobbeltklikke `<slug>/index.html` lokalt

Tailwind CDN advarer i konsol om "not for production". Det er accepteret af bruger.

## Copy-policy

Briefen leverer copy ord-for-ord til alle 11 sektioner. Placér **verbatim**. Ingen omskrivning, ingen "forbedringer".

### Ord der må bruges
biologisk, barriere, vedligehold, specifik, dokumenteret, indkapslet, slow-release, 8 uger, 28-dages cyklus, 0,02 mm, 30%

### Ord der ALDRIG må bruges
anti-age, klinisk testet, reducerer rynker, du fortjener, se yngre ud, ungdomelig glød, revolutionerende, forskønnelse

### Form
- "du", ikke "De" eller "man"
- Korte sætninger blandet med længere
- Tal-specificitet over påstande
- Janteloven-immunt: vedligehold, ikke forskønnelse

## Avatar (kun denne side)

Marianne 48–60, sweet spot 51–56. Sygeplejerske/lærer/butiksleder. Provinsby/omegnen af KBH. Vild med Dans-publikum. Hun er **problem-aware**, ikke solution-aware. Hun lander her fra hooket *"Hvor mange gange er du blevet spurgt om du er træt — selvom du har sovet 8 timer?"*.

Master-smerte: at blive set som "den trætte version af mig selv" — research-dokumentets sektion 3, smerte #1.

Schwartz stadie 4–5. Mekanisme-dramatisering (indkapslet retinol som "drypvanding vs. spand vand") er stadig ny information.

## Tracking

- Meta Pixel: `PageView` (load), `Lead` (email-capture), `ViewContent` (75% scroll + sekundær CTA-klik med `content_name: "soft_product_link_from_advertorial"`)
- GA4: tilsvarende `generate_lead` ved email-capture
- ID'er er placeholders i `<head>` — søg efter `META_PIXEL_ID` og `GA4_ID`

## Email-capture

- Endpoint placeholder: `POST /api/lead` med `{email, source: "biologi-bag-traetheden"}`
- Honeypot mod bots (skjult `website`-felt)
- Inline bekræftelses-state (ingen redirect)
- GDPR-checkbox med absolut link til `https://kjeldgaards.com/privatlivspolitik`

## Performance-budget

- Above-the-fold paint < 1,5s på 3G
- Hero-billede < 200 KB (faktisk: WebP 148 KB, JPEG fallback 172 KB)
- Mobile-first — 375 px viewport er primær (70% af trafik = Facebook in-app mobil)

## Tilgængelighed

- WCAG AA
- Min font-size 17 px på mobil for body
- Kontrast min 4.5:1
- Aria-labels på alle inputs
- 44×44 px min tap-target på interaktive elementer

## Brand-fakta (verificeret)

- Kjeldgaards Barrier Defense Serum, 30 ml, 399,50 DKK
- Hovedingredienser: indkapslet retinol (slow-release) + peptider + bakuchiol
- Trustpilot 4,7/5 (209 anmeldelser) — siden bruger dette tal
- CVR 43509829, Nørresundby
- Grundlagt af Morten Kjeldgaard (kendt fra Vild med Dans)

## Build-noter

- Node+npm: ikke globalt installeret. Brugt portable Node fra `/tmp/node-v20.18.1-darwin-arm64/bin` (skal re-installeres ved fremtidige sessioner via `brew install node` eller download fra nodejs.org).
- Playwright installeret som dev-dep i `package.json`. Screenshots i `/screenshots/`.
- Pillow brugt til at konvertere hero til WebP + JPEG fallback + OG-image. Script: `.context/make_hero.py`.

## Filstruktur

```
index.html                       — Hub-side (intern, noindex). Lister alle landingpages.
vercel.json                      — Cache + security headers, cleanUrls
CLAUDE.md                        — Denne fil
README.md                        — Onboarding + deploy
/biologi-bag-traetheden/
    index.html                   — Hele advertorialen, 11 sektioner
    styles.css                   — Typografi, farver, layout
    script.js                    — Email, scroll observer, Pixel/GA4 events
    /assets/                     — hero-kvinde-50.{webp,jpg}, og-image.jpg
/research/                       — 4 docs (sandheds-kilde, rør ikke ved disse)
/screenshots/                    — Playwright output
```

### Tilføj ny landingpage

1. Opret mappe `/<slug>/` med `index.html`, evt. `styles.css`, `script.js`, `assets/`
2. Tilføj et `<a class="card">`-kort i `/index.html` under "Aktive landingpages"
3. Sæt canonical/OG URLs i den nye `index.html` til `https://lp.kjeldgaards.com/<slug>`
4. `cleanUrls` håndterer routing — sidens URL bliver `lp.kjeldgaards.com/<slug>`
