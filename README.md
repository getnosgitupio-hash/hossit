# Hoisst Landing Page

Production-ready React + Tailwind landing page for Hoisst, built on Vite.

## Quick start

```bash
# Install dependencies
npm install

# Run dev server (auto-opens http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

After `npm run build`, the static site lives in `dist/`. It can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, S3, etc.).

## Project structure

```
hoisst-app/
├── index.html                  # Vite entry HTML
├── package.json                # deps + scripts
├── vite.config.js              # Vite + React plugin
├── tailwind.config.js          # Tailwind v3 + Hoisst brand colors
├── postcss.config.js           # PostCSS for Tailwind
└── src/
    ├── main.jsx                # React entry (mounts <App />)
    ├── App.jsx                 # Renders <HoisstLanding />
    ├── HoisstLanding.jsx       # The full landing page component
    └── index.css               # Tailwind directives
```

## How the landing page is wired

`HoisstLanding.jsx` is a React component that preserves the full v3 HTML+CSS verbatim:

- The 35 KB of tuned CSS (gradients, shadows, 3D button physics, mobile `clamp()` typography) lives in a `<style>` tag inside the component.
- The 72 KB of body markup (hero, dashboard mockup, testimonials, feature blocks, case file, FAQ, footer with light-chip canonical logo) renders through `dangerouslySetInnerHTML`.
- A `useEffect` ports the welcome-bar opt-in script: reads `?name=` and `?email=` from the URL, substitutes them into the welcome bar, and wires the dismiss button.

This wrapping approach keeps the page pixel-identical to the standalone v3 HTML while giving it a proper React component lifecycle.

## Tailwind setup

Tailwind v3 is fully wired with Hoisst's brand colors registered in `tailwind.config.js`:

```js
'hoisst-mint':       '#0ccca8'
'hoisst-mint-dark':  '#089b80'
'hoisst-navy':       '#0c3060'
'hoisst-navy-deep':  '#091f42'
'hoisst-paper':      '#fafaf2'
'hoisst-cream':      '#f5f1e8'
'hoisst-ink':        '#0a0a0a'
```

Plus font families: `font-display` (Anton), `font-serif` (Instrument Serif italic), `font-mono` (JetBrains Mono), `font-sans` (Inter).

These don't conflict with the embedded LP styles. Use them freely for any sections you add around the landing page.

## Extending the page

If you need to convert a specific section from `dangerouslySetInnerHTML` into proper JSX (e.g., to bind a form to React state), pull that section's markup out of the body template literal and replace it with a regular JSX component. Everything else stays untouched.

## Notes

- Bundle size: 254 KB JS (96 KB gzipped). Bigger than a minimal React page because the LP's CSS + markup are inlined as strings, but well within normal landing-page budgets.
- Mobile-ready: every breakpoint inherited from v3 (`clamp()` typography, mobile-first layout).
- 3D CTA buttons: real depth via stacked box-shadows, press-down on click, hover lift. No JS needed — pure CSS.

## To replace the booking URL

Search for `href="#book-call"` in `src/HoisstLanding.jsx` and replace with your TidyCal/Calendly link. There are multiple CTAs across the page; do a project-wide search/replace.
