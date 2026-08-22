# GLANZ — Skin | Hair | Homoeopathy

Production-ready website for GLANZ (Dr. Sakshi Prajapati), Nikol, Ahmedabad.
Built with plain **HTML5 + CSS3 + vanilla JavaScript** — no frameworks, no build step,
no dependencies.

---

## 1. Structure

```
/
├── index.html            → https://www.glanzhealth.com/
├── service/index.html    → https://www.glanzhealth.com/service/
├── scan/index.html       → https://www.glanzhealth.com/scan/   (QR destination)
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── images/           placeholder editorial visuals (SVG)
│   ├── icons/            (icons are inline SVG in the markup)
│   └── logo/             logo mark, lockup, favicon
├── css/
│   ├── global.css        design tokens + shared components (nav, buttons, footer, forms)
│   ├── home.css
│   ├── service.css
│   └── scan.css
└── js/
    ├── main.js           site config, navigation, scroll reveal, contact form
    ├── service.js        treatment accordions + sticky category nav
    └── scan.js           digital-card content object + rendering
```

Clean URLs come from `index.html` inside each folder — any standard host
(Netlify, Vercel, cPanel, Nginx, Apache, GitHub Pages) serves `/service/` and
`/scan/` without configuration.

## 2. Running it locally

**VS Code "Go Live" (recommended)** — open this folder in VS Code and click
**Go Live** in the status bar (or right-click `index.html` → *Open with Live
Server*). Live Server serves the folder as a real web root, so the clean URLs
work exactly as they will in production:

```
http://127.0.0.1:5500/          → home
http://127.0.0.1:5500/service/  → services
http://127.0.0.1:5500/scan/     → digital card
```

Any other static server works too:

```bash
python -m http.server 8000      # then visit http://localhost:8000/
```

Double-clicking `index.html` (the `file://` protocol) also works — `js/main.js`
detects it and rewrites folder links to `folder/index.html` — but a server is
still the accurate preview.

## 2a. Design system at a glance

| Layer | Choice | Why |
|---|---|---|
| Reading surfaces | cream `#FBF6F0` / ivory `#FFFDFA` | keeps long text crisp, not muddy |
| Anchor surfaces | deep cocoa `#2B1B14` → `#33211A` | taken from the visiting-card photography; used for *Why GLANZ*, the final CTA and the footer so the page has rhythm instead of one flat cream tone |
| Action colour | copper `#B0724A` | reserved almost entirely for buttons, so "what do I click" is never ambiguous |
| Category accents | rose `#C0785E` (Skin) · amber `#A9743F` (Hair) · sage `#7E8A6F` (Homoeopathy) | small doses (dots, rules, hovers) so the three pillars are distinguishable at a glance |
| Display type | Cormorant Garamond 500/600 | editorial serif matching the card's engraved wordmark |
| Wordmark | Cinzel | closest match to the printed GLANZ lettering |
| UI & body type | Manrope 400–700 | high x-height, excellent small-size legibility on phones |

Mobile carries a sticky **Call · WhatsApp · Book** bar on every page, quick-action
buttons above the contact details, full-width CTAs and 44–62px tap targets.

## 3. Where to edit things

| What | File | Where |
|---|---|---|
| Phone, WhatsApp, email, Instagram, Maps link, booking link | `js/main.js` | `GLANZ_CONFIG` at the top |
| Everything on the QR/scan page (services, contact, statement) | `js/scan.js` | `scanContent` at the top |
| Colours, fonts, spacing, radii, shadows | `css/global.css` | `:root` design tokens |
| Treatment copy | `service/index.html` | inside each `.acc__item` |
| Homepage copy | `index.html` | section by section, commented |

### Placeholders that still need the real thing

1. **Logo** — done. The official artwork is in use everywhere (see below).
2. **Photography** — `assets/images/*.svg` are elegant brand-toned placeholders.
   Swap them for real photographs (same file names, or update the `src` and the
   `alt` text). The layout does not break if an image is missing — each frame
   keeps a blush gradient.
3. **Google Maps** — `mapsUrl` in `js/main.js` and `js/scan.js` currently uses a
   Maps *search* URL. Replace it with the clinic's exact Google Business Profile
   link when available.
4. **Booking** — `bookingUrl` currently points at the contact section. Point it
   at a booking platform or WhatsApp link when one exists.
5. **Contact form** — front-end only. It validates, but **nothing is sent**, and
   the on-screen message says so. The integration point is marked with
   `TODO — BACKEND / EMAIL INTEGRATION GOES HERE` in `js/main.js`.
6. **Social share image** — `og:image` currently points at the SVG lockup.
   Replace with a 1200×630 JPG/PNG for best results on WhatsApp/Facebook.

## 3a. Logo usage

Masters supplied by the client live in `assets/images/` (`nice_glanz.png`,
`nice_glanz_symbol_only.png`, `nice_glanz_name_only.png`,
`nice_glanz_name_only_with_subtitle.png`). The site loads optimised
derivatives generated from them, in `assets/logo/`:

| File | Made from | Used for |
|---|---|---|
| `glanz-symbol.png` (320²) | symbol only | navbar, hero badge, footer, scan card, apple-touch-icon |
| `glanz-wordmark.png` (620w) | name only | navbar and footer wordmark |
| `glanz-wordmark-tagline.png` (680w) | name + subtitle | scan-page card header |
| `glanz-lockup.png` (760w) | full logo | Open Graph / Twitter / schema.org image |
| `favicon.png` (64²) | symbol only | browser tab icon |

One deliberate rule: **the artwork's own "SKIN | HAIR | HOMOEOPATHY" line is
dark brown**, so it disappears on the dark cocoa footer. The footer therefore
pairs the rose-gold wordmark with a typeset champagne tagline, while light
surfaces (navbar, scan card) use the artwork as supplied. If the logo is ever
re-exported, regenerate the derivatives at the same file names and nothing else
needs to change.

## 4. The /scan/ page

This is the destination printed on the visiting-card QR code
(`https://www.glanzhealth.com/scan/`). It is deliberately lightweight,
mobile-first and conversion-focused:

- brand + Dr. Sakshi Prajapati identity block
- Book / Call / WhatsApp / Directions / Save Contact (vCard) actions
- expandable service categories
- website, Instagram, email and address rows
- sticky bottom bar (Call · WhatsApp · Book) on mobile

All of its content lives in the `scanContent` object in `js/scan.js`, so it can
be updated later without touching the markup — and the QR code never needs to be
reprinted.

## 5. Accessibility & performance notes

- Semantic landmarks, skip link, visible focus states, ARIA only where needed
  (accordions, mobile menu, live form status).
- `prefers-reduced-motion` is respected — all reveals and the ticker stop.
- No JS libraries; three Google Fonts families; images are lazy-loaded below the
  fold; SVG artwork keeps payloads small.
- Every page passes a clean console (no errors).

## 6. Medical content policy

All copy avoids guarantees or absolute claims. Wording such as "used for",
"may help", "designed to support", "subject to clinical evaluation" and "results
vary" is used deliberately, and a disclaimer appears in the footer of every page
plus in the homoeopathy and bridal sections of the services page. No prices,
credentials, statistics or testimonials have been invented.
