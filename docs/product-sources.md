# Product evidence — 2026-10-05

2026-10-26: Owner-approved calories implementation case: constrain generative LLM use for operating cost; model judges input intent, while code handles food/quantity interpretation, nutrition-data lookup and calculation. Added to the calories case's engineering judgment paragraph. No measured cost reduction or model accuracy claim is made.

Current review (2026-10-23): [studio evidence](studio-evidence.md) supersedes the historical screenshot and availability notes below. New screenshots are direct public-service captures; HIS remains signed-out, and calorie data is a fresh anonymous example. Separate case pages distinguish verified public behavior from code implementation and unimplemented plans.

The home page and /products share `lib/products.ts`. Status describes availability, not a claim of production maturity. No usage numbers or business metrics are invented.

| Product | Public evidence | Repository evidence | Published scope |
| --- | --- | --- | --- |
| L‑Proof AI | https://l-proof-ai.xyz and /api/public/v1/articles?limit=1 returned 200; latest item was edition 5, `what-remains-when-models-change`, published 2026-10-04T23:50:32Z | `D:/2026_project/l-proof-ai/README.md`: subscriptions, human approval, publication, scheduled sending, delivery records | Live: public articles and subscription applications. No delivery-rate or subscriber-count claims. |
| HETRICH AI Secretary | https://hetrich.vercel.app/ returned 200, title `HIS · 말해두세요`; https://github.com/ipjaworld/HETRICH-ai-secretary returned 200 | Public showcase README and private HETRICH README/product-memory-contract describe memory, briefing and user approval; remote deployment and device Push require separate verification | Building; publicly accessible development version labelled HIS. Do not promise production notification delivery. |
| How Much Calories Left | https://how-much-calories-left.vercel.app/ returned 200, title `오늘 얼마 먹어도 돼?` | `D:/2026_project/HowMuchCaloriesLeft/README.md`: v0.2, natural-language add/modify/delete, improved food coverage and portions, goal settings, localStorage | MVP v0.2; records stay in the current browser. No medical advice or accuracy claims. |

Other saved projects were considered: minjae_toon is an illustration production folder; ai-book-u-can-do-it is not established here as a public HETRICH software product. Neither is promoted as a live product without public affiliation and availability evidence. GitHub profile remains available for broader work.

## Update checklist

- Verify both the public destination and repository documentation before changing a status.
- Keep implementation evidence distinct from publicly available functionality.
- Secretary production notifications: **확인 필요**. Keep the caveat in /products until actual delivery is verified.
- Add a new product to the shared catalog only after confirming name, description, public affiliation and destination.
- Existing site canonical origin is preserved; confirm the intended production domain before changing it.

Naming clarification (owner, 2026-10-05): **HIS** is the short name of **HETRICH AI Secretary**, not a separate development-only brand. Cards use HIS as the name and display the full name directly beneath it. The current Vercel project was verified as `hetrich-main` with production domain `hetrich.com` (confirmed by deployment alias and HTTP 200); canonical, robots and sitemap now use that origin.

## Feedback-to-implementation review — 2026-10-07

Reviewed public HowMuchCaloriesLeft HEAD f4c19b9e4ae650f1222598a5754c4fa1e5b85dd9 against owner-provided October 2 and October 6 feedback. Private conversation files are not copied into this repository. The homepage combines and paraphrases feedback anonymously; it is not a verbatim endorsement.

Implementation evidence (repository state, not a production deployment verification):
- src/ai/nutrition/quantity.ts: slash and Korean fractions; quantity.test.ts includes 햇반 1/2. foodPhrases.test.ts includes 햇반 1/2 + 제육 + 김치.
- src/application/addFood.test.ts: 1/2, 0.5 and 반 equivalence; representative packaged-product variant assumptions.
- src/components/replyText.ts and replyText.test.ts: per-food quantities/calories and explanations for assumed portions/variants.
- src/components/ConversationScreen.tsx: separate recent-30-day conversation view; navigation includes 대화 기록.
- README is older than current code (for example its claim of no streaks conflicts with HEAD). Do not use README alone to describe current functionality.
- No food-count target or accuracy improvement percentage is presented as a verified result. The external repository's tests were inspected, not executed.

Product visuals: owner-supplied L-Proof article list and HIS development screenshot. HIS preview uses the upper application area; no chat transcript is displayed. Calories panel is explicitly an input example, not an application screenshot. Actual calories screenshots and a current deployed-feature check remain needed before publishing a full visual case study.

### 실제 칼로리 화면 추가
사용자가 제공한 실제 기록 화면을 public/products/calories-record.png로 반영했다. 이전 입력 예시 패널을 교체하고, 목록에서는 남은 칼로리와 음식 기록 일부를 보여준다. 44px 이상의 '기록·수정 화면 크게 보기' 링크에서 원본 전체와 하단의 200g → 250g 수정 결과를 확인할 수 있다. 별도 목업이나 계산값을 합성하지 않았다. 칼로리 앱의 화면 자료 요청은 충족되었으며, 분수 입력 전후·별도 대화 기록 화면·현재 배포 기능 범위는 이 한 장만으로 확인하지 않는다.

## 레범몬 추가 — 2026-10-23

공개 서비스 https://www.rebemon.xyz/ 와 공개 저장소 https://github.com/ipjaworld/LeBemMon-FE 를 확인하고 자체 제품에 추가했습니다. 상태는 `Released · 출시 · 공개 이용 가능`입니다. 레벨 범위·지역 필터, 이벤트 알파벳 조회, 장비·추가 옵션 스탯 계산을 직접 조작했습니다. 지속적인 고도화, 현재 게임 이벤트 개최 여부나 이용자 수는 주장하지 않습니다. 상세 근거와 검증 한계는 [rebemon-evidence.md](rebemon-evidence.md)에 기록했습니다.
