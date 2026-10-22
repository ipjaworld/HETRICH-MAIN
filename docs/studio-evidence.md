# Studio portfolio — evidence and design decisions

Reviewed 2026-10-23 KST. Baseline: `4ff7322` on `ipjaworld/HETRICH-MAIN/main`, clean local checkout. Work is isolated on `feat/studio-portfolio`. No product repositories or operational data are modified.

## Existing application and delivery

- Next.js 16.3.4 App Router, React 19, TypeScript; server-rendered pages, local Fontsource fonts, next/image. Existing paper/ink/blue palette and sage/sand product accents retained. There is no existing dark-mode control; the light color scheme remains.
- Routes `/`, `/products`, `/work`, `/about`, `/contact`, `/insights`, `/api/contact`, sitemap/robots retained. Insights continues to use L-Proof's public API with 300-second revalidation and failure UI. Contact keeps server validation, spam boundary and honest email fallback when webhook is absent.
- Vercel project `hetrich-main` / `prj_hm5u6lOfzo8yy3QBUlWOotz1QtMT`, team `team_6lcsmbdEX5gIiGzGiz2lN6vV`: CLI read-only project/API inspection confirms GitHub `ipjaworld/HETRICH-MAIN`, production branch `main`, Next.js framework. No GitHub Actions workflow exists in the baseline. Use a Git branch/PR; do not manually deploy or alter production configuration.

## Product evidence

All four public sites returned HTTP 200 in a fresh Chrome context. Browser screenshots are real captures, not reconstructed interfaces. No login session, private conversation, personal record or company screen is used.

| Product | Evidence and published scope | Screenshot |
| --- | --- | --- |
| L-Proof AI | https://l-proof-ai.xyz/ ; public articles and subscription UI. Local README and published site support human-reviewed briefings, publication and scheduled delivery. No subscription or email was sent in this review. | Public page, captured 2026-10-23. |
| HIS / HETRICH AI Secretary | https://hetrich.vercel.app/ ; public assistant and input UI. Local README and product-memory-contract describe memory precision, edits/cancellation, briefing and notification implementation. Authenticated storage and actual device delivery were not tested. | Fresh signed-out mobile page; replace previous supplied development crop. |
| How Much Calories Left | https://how-much-calories-left.vercel.app/ ; fresh anonymous browser: goal 2000, input `햇반 1/2 먹었어`, actual result 158 kcal and 1842 remaining. STATE/DECISIONS and quantity/reply implementation support correction, assumptions and history. | Actual UI with clearly labelled example input; no account data. No nutrition accuracy claim or account rollout claim. |
| 악역영애 말포이 — 은빛 서약 | https://ipjaworld.github.io/malfoy-silver-vow/ ; `MalpoyeeMiyeonsi` README, engine.js, story.js and app.js, then public engine.js/app.js checked. Same project as TS 말포이; one entry only. First choice played through UI. | Public first-choice scene, generic player name 여행자. Noncommercial/unofficial fan work clearly labelled. |

Game: three chapters, 15 scenes and nine endings in source. First romance checks trust, clues and final choice. Public `engine.js` requires all `vow`, `friend`, `sealed` endings of the previous chapter to unlock the next. Success-only unlocking and optional full collection remain explicitly **unimplemented proposals**. Save/backlog/skip/settings are implemented; no game system change is included. Existing game assets are shown only as the actual game screen. No official stills, artwork, text or music are newly imported.

## Career evidence and boundaries

Compared the existing `docs/work-sources.md`, owner-corrected career facts (2026-10-22), and the 2026-10-21 career portfolio/resume. Private originals remain outside the repository.

- TalkGate and 꼬순박스: entire frontend and frontend API integration owned by the developer, design/UX collaborative. Preserve this scope; do not inflate to sole product/backend direction.
- TalkGate: MVP review, observation of agents' memo input patterns, sharing UX issues with designer/team lead and participation in common memo UI improvement. Do not claim sole input-model redesign.
- 빨리줘: February 2025, TPLEND, Next.js/NestJS monorepo; backend authentication/payment APIs, PG integration, payment-state handling. The prompt's conditional business-flow examples were not independently established and are not added.
- E-PARTS and 모하N retained with their existing verified scope. EC2/Nginx/Docker/ECR/Shell is supported; a new claim about Docker Compose architecture is not added without evidence.
- Existing Kkosunbox 34 E2E scenarios and desktop Lighthouse 57→88 retain their historical measurement caveat. They are not the results of this site's new QA.

## Five live design references

All were opened in Chrome at 1440px. Initial screenshots, actual visible-link hover and an 800px wheel scroll were recorded. The notes describe observed presentation, not claims about a site's implementation internals. No third-party assets are shipped.

| URL | Observed element | Fit / apply | Do not apply |
| --- | --- | --- | --- |
| https://linear.app/ | Short left-aligned hierarchy followed by a large product interface, quiet dark surfaces | Make actual product UI and a clear action carry the proof; short headline and image-first discovery | Dense simulated dashboard, brand-specific dark styling or a borrowed product UI |
| https://basement.studio/ | Distinctive full-screen spatial scene, persistent navigation, separate Showcase and Services | Distinguish software products, interactive experiment and capabilities; give the game its own visual identity | WebGL world, chat shortcut and interaction cost before viewing work |
| https://work.co/ | Editorial label/content columns; concise problem statement and large work preview | Scope and contribution summaries with links to fuller cases | Large-client claims, long client lists or agency-scale positioning |
| https://rauno.me/ | Oversized type, a personally identifiable voice, project panels and interaction details | Preserve the one-person identity; careful hover/focus feedback and readable project details | Horizontal-only exploration, custom cursor or reproducing the yellow graphic |
| https://vercel.com/ | Concise product proposition, adjacent primary/secondary actions, ample space | Product discovery and development contact are visible early; use consistent action hierarchy | Infrastructure-scale promises, animated hero machinery and customer-logo proof |

## Applied information architecture and motion

Hero → three real products → separate noncommercial game → professional work summary → capabilities and development inquiry → existing feedback/build notes → Insights → founder. Four `/products/[slug]` case pages explain need, decision, implementation and limitations. Navigation, external destinations, existing portrait and calorie correction screenshot remain available.

No new runtime dependency. Content remains server-rendered. Image dimensions reserve layout space; four WebP captures total approximately 154 KiB before Next image variants. CSS transform entrance is progressive enhancement using view timelines; unsupported browsers show static content. Text remains fully opaque throughout the animation to retain contrast. Hover feedback does not move text or change layout. Reduced motion disables entrance and image movement; keyboard focus stays visible.

Verification and before/after captures are recorded in the final delivery report. Login-only product flows, actual device Push delivery, email delivery and physical-device Safari are explicitly outside this site's verification.
