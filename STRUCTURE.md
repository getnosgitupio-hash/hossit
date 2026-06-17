# Hoisst landing page · component structure

The page was one file (`HoisstLanding.jsx`, 1894 lines). It is now one component
per section plus a pop-up lead form. The rendered output is byte-for-byte the same
page. No design, copy, colour, or spacing changed.

## Layout

```
src/
  HoisstLanding.jsx              composition root (renders fonts + styles + 16 sections + modal)
  components/
    HoisstStyles.jsx             injects the design stylesheet
    LeadFormModal.jsx            NEW pop-up lead form ("choose type" -> details -> done)
    sections/
      Welcome.jsx  + welcome.html
      Nav.jsx      + nav.html
      Hero.jsx     + hero.html
      ProofBar.jsx + proofbar.html
      Testimonials.jsx + testimonials.html
      Badges.jsx   + badges.html
      FeatureReplace.jsx + feature-replace.html
      FeatureTax.jsx + feature-tax.html
      CtaStrip.jsx + cta-strip.html
      Bullets.jsx  + bullets.html
      Steps.jsx    + steps.html
      Guarantee.jsx + guarantee.html
      CaseFile.jsx + case-file.html
      Faq.jsx      + faq.html
      FinalCta.jsx + final-cta.html
      Footer.jsx   + footer.html
  styles/
    hoisst-design.css            the original design system (extracted verbatim)
    lead-form.css                NEW, scoped under .hl-modal only
```

Each section component imports its `.html` slice as a raw string and renders it
inside a `display:contents` wrapper, so no extra layout box is introduced. The
slices are the original markup, cut only at the section comment boundaries. The
generator hard-asserted that the slices recombine to the original body exactly.

## The pop-up form

`LeadFormModal.jsx` is a self-contained two-state flow:

1. **Choose type** — five build types (Multi-Outlet F&B, Retail / Distribution,
   Manufacturing / FMCG, Services / EdTech, Something Else). Picking one advances.
2. **Details** — name, company, work email, country-code phone (37 countries,
   searchable, +91 default), annual revenue, biggest headache, consent. Full
   inline validation. 3D blue submit that mirrors the page `.cta-3d`.
3. **Done** — confirmation seal, recap of the chosen build type, what happens next.

It is painted entirely in the Hoisst palette (navy / mint / blue, Anton +
Instrument Serif + Inter + JetBrains Mono). Every selector is scoped under
`.hl-modal`, so it cannot affect the page.

## Wiring (two constants in HoisstLanding.jsx)

```js
const BOOKING_URL  = '{{SCOPE_CALL_BOOKING_URL}}'; // stays as no-JS fallback on the CTA anchors
const LEAD_ENDPOINT = '';                          // set to your Apps Script / Pabbly URL to capture leads
```

- Every primary CTA (`.cta-3d` in hero / interstitial / final, `.nav-cta` in the
  header) opens the pop-up. This is done with one delegated click handler on the
  page wrapper, so the section markup was never edited and the booking URL still
  works if JS is off.
- While `LEAD_ENDPOINT` is empty the form skips the network call and just shows
  the confirmation (the payload is logged to the console). Drop your endpoint in
  and submissions POST as `text/plain;charset=utf-8` with `keepalive`.

## Run

```
npm install
npm run dev      # local
npm run build    # production -> dist/
```

A built `dist/` is included so you can open it without installing anything.
