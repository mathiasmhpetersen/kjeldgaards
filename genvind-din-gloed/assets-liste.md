# Assets — leveret vs. mangler

Ingen placeholders i produktion. Alt herunder er enten rigtige filer, genbrugt fra
produktsiden, eller markeret som noget der skal leveres.

## Skal leveres / bekræftes

| Fil / felt | Hvad det skal være | Status nu |
|---|---|---|
| `assets/bottle-hero.{webp,jpg}` | Flasken i en hånd, udendørs, naturligt lys, stort. | Genbrugt fra produktsiden — udskift hvis der ønskes et dedikeret foto til denne side |
| `assets/before-after-1..3.webp` + `thumbs/` | Rigtige før/efter i hero-thumbnail-striben. | Genbrugt fra produktsiden |
| `assets/klinisk-studie.webp`, `assets/reviews.webp` | Thumbnails i hero-striben (klinisk graf, anmeldelses-billede). | Genbrugt fra produktsiden |
| `assets/og-image.jpg` | Delebillede 1200×630. | Genbrugt fra produktsiden — kan laves dedikeret |
| Footer: telefon + åbningstider | `70 00 00 00`, `Man–fre 9–15` er placeholders | Bekræft rigtige tal |
| Footer: mail | `kundeservice@kjeldgaards.com` | Bekræft |
| Links | handelsbetingelser, betingelser for deltagelse, fortrydelsesret (persondatapolitik peger korrekt) | Bekræft URL'er |
| Checkout-URL | Rigtig checkout for 2-flaske-tilbuddet | Placeholder i `script.js` |

## På plads

| Fil | Hvad |
|---|---|
| `assets/reviews/*.webp` (48) | Facebook-anmeldelser fra de uploadede screenshots |
| `assets/reviews/manifest.js` | Autogenereret liste — antal læses fra mappen |
| `assets/pay/{mobilepay.png, visa.png, mastercard.svg, apple-pay.png}` | Betalingsikoner (MobilePay først) |

Fotovejledningen ligger i mail 1 (`mails.md`), ikke på siden — som briefen kræver.
