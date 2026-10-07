# Landing audit and verification — 2026-10-05

## 1. Existing issues

- Three products already existed, but full-width, very tall product sections, an oversized wordmark and five philosophy rows delayed comparing them.
- The hero emphasized AI rather than identifying the individual behind the product studio.
- Main and Products maintained duplicate descriptions; L-Proof publication and calories v0.2 information lagged repository evidence.
- Product counts/statuses were hardcoded. Mobile navigation lacked Escape/focus return and viewport-change handling.
- Large minimum grid tracks risked intermediate tablet widths. Header/footer links had inconsistent touch areas.

## 2. Information structure

Hero with maker identity and direct product index → selected products → three working principles → live publication feed → maker/contact → footer. L-Proof is featured; the other products share a two-column layout on wider screens and stack on phones. Product information is centralized in `lib/products.ts`.

## 3. Visual and UX changes

Retained ivory, ink, blue and lime. Used restrained green and warm neutral cards to differentiate memory and nutrition. Removed oversized phone mockups and illustrative calorie output from the home page; these could imply a current live UI or fresh data. Cards now show name, concise explanation, stage, three features and service/GitHub links. Development caveats appear with the relevant product.

## 4. Responsive checks

Chrome and WebKit: 320, 375, 390, 430, 768, 1024, 1440px. All had viewport-matching document width and no detected heading/paragraph/card clipping. Product and hero CTAs plus the mobile menu meet 44px minimum height. Touch/mobile viewport emulation (390×844) and landscape rotation (844×390) also passed. Hero uses content height, not a fixed viewport height; mobile menu height is bounded by 100dvh.

Screenshots in `outputs/chrome-*.png` and `outputs/webkit-*.png`; full-page captures were visually inspected. A scroll-in-progress screenshot artifact was fixed by disabling motion and resetting scroll before capture.

## 5. Performance and accessibility

Home and product cards remain Server Components. Removed scroll-driven header state and backdrop blur. Kept optimized `next/image` with reserved dimensions and lazy loading, cached server-side article feed, and self-hosted next/font Latin typography. Korean uses platform fonts to avoid large font CSS/downloads. No animation library or runtime client dependency added.

Added Escape close/focus return, outside-click/focus-leave close, desktop resize reset, explicit new-tab announcements and dark-surface focus colors. Preserved skip navigation, headings, reduced motion and semantic links. Removed article link aria-label overrides that omitted visible text.

## 6. Results

- `npm run lint`: passed. Generated browser reports excluded from lint.
- `npm run typecheck`: passed.
- `npm run build`: passed; home and Insights retain 5-minute revalidation.
- `npm test`: **22 passed**, Chrome + WebKit, no retries.
- axe WCAG A/AA: zero violations at all seven widths in both engines.
- Existing /products, /about, /contact, /insights route and width checks passed.
- Public product service URLs: HTTP 200 at verification time. L-Proof public feed returned edition 5.
- `git diff --check`: passed.

Lighthouse, local production server, single final run per profile:

| Profile | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Mobile | 97 | 100 | 100 | 100 | 2.6s | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0.5s | 0 |

The first revised mobile run, before font optimization, scored 79 Performance; this is not a before/after comparison with the original website. Raw reports are `outputs/lighthouse-mobile-final.json` and `outputs/lighthouse-desktop-final.json`.

## 7. Limits and follow-ups

- WebKit emulation is not a physical iPhone Safari test. Real address-bar collapse, notches and the on-screen keyboard still need device validation.
- Windows WebKit does not Tab through native links in this runner. Chrome tests real sequential Tab navigation; WebKit tests programmatic focus followed by Enter/Escape activation. See https://github.com/microsoft/playwright/issues/5609 .
- Secretary notification delivery is not verified; /products explicitly marks it as requiring confirmation.
- Contact submission delivery depends on existing webhook configuration; no real message was sent. Existing form/backend were preserved.
- No production deployment or commit was performed. Local preview: http://localhost:3101 . Production performance can vary with hosting and network.
- System Korean font appearance varies by OS. This is an intentional performance tradeoff.
- Product evidence and the decision not to invent additional public products are in `docs/product-sources.md`.

## Follow-up: HIS naming and production release

Owner clarified that HIS abbreviates HETRICH AI Secretary. Main and Products now use HIS as the primary name with the full name beneath it; the initial product index uses HIS. The development-stage caveat remains. Lint, typecheck, production build and all 22 Chrome/WebKit tests passed again after the naming change.

Deployed to the existing Vercel `hetrich-main` project. Its deployment output identified `https://hetrich.com` as the production alias; canonical, robots and sitemap were aligned to this domain. Earlier no-deployment notes above describe the initial audit handoff, before this owner-approved release.
