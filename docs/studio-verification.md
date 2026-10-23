# Studio expansion verification — 2026-10-23

Baseline `4ff7322`; feature branch `feat/studio-portfolio`.

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, including four prerendered `/products/[slug]` routes.
- `npm test`: **57 passed (2.2 minutes)**. Chrome, Windows WebKit, iPhone SE, iPhone 13 and Pixel 7 browser emulations. These are not physical-device tests.
- `git diff --check`: passed. Git's LF/CRLF normalization notices are not code failures.

Coverage includes 320–1440px homepage layout, 320–1920px founder/work pages, portrait/landscape mobile navigation, 44px actions, skip link and keyboard menu, reduced motion, external product destinations, Insights rows, all existing page routes, new case-study navigation/contact, canonical URLs, image loading, WCAG A/AA automated scans of home/work/new cases, a real unknown-product 404 and sitemap entries.

The first pass found contrast loss while offscreen cards were at reduced opacity. The entrance effect now changes only transform, retaining full text opacity. The entire 57-test suite passed after that repair. Windows cross-drive dependency junctions also caused the first local development startup to fail; a complete local dependency copy resolved that environment issue. No dependency manifests or production configuration were changed for it.

Independent production-build Chrome captures covered eight updated routes at 390px and 1440px. Every captured route returned 200, all main images loaded, no page exceptions or horizontal overflow occurred. The largest measured cumulative layout-shift sum was 0.084 on the first mobile home load; other captures were 0–0.0031. Local observed LCP values were 48–308ms without throttling. These are diagnostic single runs, not field Core Web Vitals, Lighthouse scores, or a valid performance comparison with the remote baseline. Images have explicit dimensions; the four new source WebPs total 155,390 bytes.

No real contact submission, subscription, account signup or private data was used. Public product inspection used fresh browser contexts. Calories sample data was entered in an anonymous browser; HIS authenticated memory/briefing and physical-device notifications are unverified. Existing external services and fan-game source were not modified.

Remaining work classes:

- Immediate defects: none known within the tested website scope.
- Valuable UX follow-up: verify HIS's authenticated flow and actual notification delivery with an appropriate test account/device; physical Safari and assistive-technology review; real-world performance monitoring.
- Deferred experiments: game success-only chapter unlocking, optional full-ending rewards, richer failure hints, interactive demos/video. These are not presented as shipped features.

Before/after PNG captures, the Playwright HTML report, raw browser metrics and a delivery report are retained in the task's output folder. Deployment/PR status is recorded separately when GitHub checks finish. Do not treat local tests as proof of production release.
