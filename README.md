# HETRICH — Official Site

HETRICH의 제품, 관점, 기록을 한곳에 모은 공식 브랜드 사이트입니다. 기존 한 페이지 랜딩의 시각 언어를 유지하면서, 제품 포트폴리오와 L‑Proof AI 아카이브를 장기적으로 확장할 수 있도록 Next.js App Router 기반의 다중 페이지 사이트로 재구성했습니다.

**Live:** [hetrich.com](https://hetrich.com/)

## 무엇을 담고 있나요?

- HETRICH의 방향과 핵심 원칙
- L‑Proof AI, HIS (HETRICH AI Secretary), How Much Calories Left 제품 소개
- L‑Proof‑AI 공개 API와 연결된 최신 발행물 및 전체 아카이브
- L‑Proof‑AI canonical 원문으로 이어지는 안전한 외부 링크
- Founder 이건하와 HETRICH 소개
- 서버 검증과 스팸 방지 경계를 포함한 Contact 폼

## 기술 구성

- Next.js 16 App Router
- React 19 + TypeScript
- Vercel 배포를 기준으로 한 Next.js 서버 렌더링과 5분 재검증
- Zod를 이용한 Contact API 입력 검증
- 자체 제공 폰트(Fontsource), `next/image`, Metadata API
- L‑Proof‑AI 공개 Articles API

L‑Proof‑AI가 아티클의 유일한 원본 발행처입니다. HETRICH는 공개 API에서 목록과 미리보기만 가져오며 본문, CMS, 데이터베이스를 복제하지 않습니다.

## 라우트

| 경로 | 역할 |
| --- | --- |
| `/` | 이건하의 작업실, 제품·실무·최근 글 목록 |
| `/products` | 제품 포트폴리오와 현재 상태 |
| `/products/[slug]` | L-Proof, HIS, 칼로리 앱의 설계·구현 사례 및 은빛 서약 팬게임 기록 |
| `/work` | 이전 조직에서의 개인 기여와 실무 개발 경험 |
| `/insights` | L‑Proof‑AI 공개 발행물을 보여주는 HETRICH Hub |
| `/about` | HETRICH와 Founder 소개, 개발 경험 노트 |
| `/contact` | 문의 폼, 직접 이메일 안내, 함께 만들 수 있는 것 |
| `/api/contact` | 문의 검증 및 서버 측 전달 API |

`sitemap.xml`, `robots.txt`, 404 화면도 App Router에서 생성합니다.

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm ci
npm run dev
```

품질 검사는 다음 명령으로 실행합니다.

```bash
npm run lint
npm run typecheck
npm run build
```

프로덕션 빌드를 로컬에서 확인하려면 먼저 빌드한 뒤 실행합니다.

```bash
npm run build
npm start
```

## Insights 연동

- Endpoint: `GET https://l-proof-ai.xyz/api/public/v1/articles`
- Main은 최신 3건을 서버에서 조회합니다.
- Hub는 첫 페이지를 서버에서 렌더링하고, `nextCursor`가 있으면 브라우저에서 다음 페이지를 이어 붙입니다.
- 서버 요청은 300초마다 재검증합니다. 브라우저의 추가 요청은 API의 `Cache-Control`과 `ETag`를 사용합니다.
- 외부 링크는 응답의 `url`을 그대로 사용하되 HTTPS와 `l-proof-ai.xyz` hostname을 통과한 경우에만 활성화합니다.
- API 실패 시 기존 페이지는 유지하고 해당 섹션 안에서만 오류·재시도 상태를 보여줍니다.

## Contact 폼 설정

Contact 폼은 이름, 이메일, 문의 유형, 본문 길이를 브라우저와 서버 양쪽에서 검사합니다. 숨은 honeypot 필드와 요청 크기 제한도 적용되어 있습니다.

Resend로 직접 이메일을 전달하려면 발송 도메인을 인증한 뒤 아래 서버 전용 환경 변수를 Vercel에 설정합니다. 실제 비밀 값은 채팅이나 저장소에 넣지 않고 Vercel 환경 변수 화면에 직접 등록합니다.

```bash
RESEND_API_KEY=your-sending-access-key
CONTACT_FROM_EMAIL=HETRICH <contact@your-verified-domain.example>
```

- 수신자는 `this_is_laugh@naver.com`으로 고정됩니다. 방문자 이메일은 `Reply-To`로만 사용하며 임의 수신자에게 발송하지 않습니다.
- Production에 설정하고 기존 GitHub → Vercel 배포를 거쳐 적용합니다. Preview 테스트에는 별도의 테스트 설정을 사용합니다.
- Resend의 메일 ID가 반환되어야 접수 성공으로 처리합니다. 공급자 접수와 실제 받은편지함 도착은 구분하며, 최초 활성화 후 수신 확인이 필요합니다.
- 전송 중 입력과 재전송을 막고, 실패하면 입력을 보존합니다. 서버는 최대 10초, 브라우저는 최대 15초 대기합니다.
- JSON 본문 크기(24KB)는 Content-Length가 없는 요청에도 적용됩니다. 입력 검증, honeypot, 브라우저 Origin/Host 검사도 적용합니다. 공개 API이므로 이 검사가 분산 스팸 제한을 대체하지는 않습니다. 운영 시 Vercel Firewall에서 `/api/contact`의 요청 제한을 설정할 수 있습니다.
- `npm run test:contact`는 실제 메일을 보내지 않고 입력·전달·실패 경계를 검증합니다.
- 공식 설정 문서: [Resend 도메인 인증](https://resend.com/docs/dashboard/domains/introduction), [메일 발송 API](https://resend.com/docs/api-reference/emails/send-email).

기존 JSON 웹훅도 대안으로 지원합니다. 두 방식이 모두 설정되어 있으면 Resend가 우선합니다.

```bash
CONTACT_WEBHOOK_URL=https://example.com/contact-webhook
CONTACT_WEBHOOK_BEARER_TOKEN=optional-secret
```

- `CONTACT_WEBHOOK_URL`은 JSON `POST`를 받을 수 있는 HTTPS 엔드포인트입니다.
- `CONTACT_WEBHOOK_BEARER_TOKEN`은 선택 사항이며 설정 시 `Authorization: Bearer ...` 헤더로 전달됩니다.
- 두 전송 방식 모두 미설정이면 API는 `503 not_configured`를 반환합니다. 폼을 숨기고 직접 이메일을 안내합니다. 설정 이름만 등록된 빈 값은 활성화로 취급하지 않습니다.
- 비밀 값은 저장소에 커밋하지 않습니다. `.env.example`에는 변수 이름만 포함되어 있습니다.

## 주요 디렉터리

```text
app/                  페이지, 메타데이터, Route Handler
components/           공통 UI, L-Proof 카드·아카이브, Contact 인터랙션
lib/l-proof.ts        공개 API 타입, 검증, 포맷 및 공유 fetch 계층
lib/l-proof-server.ts 5분 재검증이 적용된 서버 fetch 계층
public/               제품 이미지와 파비콘
app/insights/         SubHeader, Hub 목록, 로딩·오류 상태
```

## 설계 원칙

- 레퍼런스 비교에 따른 여백 중심의 스튜디오 디자인을 적용합니다. 폰트·색상·간격과 선정 근거는 [디자인 방향](docs/design-direction.md)에 정리했습니다.
- 페이지 기본값은 Server Component로 두고, 메뉴·복사 버튼·폼만 Client Component로 분리합니다.
- HETRICH 내부 아티클 상세 페이지를 만들지 않고 L‑Proof‑AI canonical 페이지로 연결합니다.
- 제품의 현재 상태와 사용할 수 없는 기능을 과장하지 않습니다.
- 콘텐츠 양이 적은 단계에서는 복잡한 CMS·관리자·인증을 도입하지 않습니다.

## 현재 의도적으로 제외한 범위

- CMS 및 관리자 화면
- 사용자 계정과 인증
- 검색, 태그 필터, 댓글
- 분석 SDK와 마케팅 트래커
- HETRICH 측 아티클 데이터베이스와 본문 복제
- Contact 웹훅 공급자 자체 구현

이 기능들은 실제 운영 필요가 생겼을 때 콘텐츠 접근 계층과 Contact API 경계를 기준으로 확장할 수 있습니다.

## 관련 프로젝트

- [L‑Proof AI](https://github.com/ipjaworld/l-proof-ai)
- [HETRICH AI Secretary](https://github.com/ipjaworld/HETRICH-ai-secretary)
- [How Much Calories Left](https://github.com/ipjaworld/HowMuchCaloriesLeft)

## License

All rights reserved. © 2026 HETRICH.

## Landing verification

The homepage and `/products` use the shared catalog in `lib/products.ts`. Product evidence and unresolved availability details are recorded in `docs/product-sources.md`.

The 2026-10-23 studio expansion adds real public-service captures, concise product case studies, a separately attributed noncommercial fan-game experiment, professional work and development capabilities. Current source evidence, design-reference comparisons and the preserved GitHub deployment path are documented in [studio evidence](docs/studio-evidence.md). The original product apps and game rules are unchanged.

Browser regression tests use Playwright and axe. Chrome must be installed; install WebKit with `npx playwright install webkit`.

```bash
npm run build
npm start -- --port 3101
# In a separate terminal:
npm test
```

Tests cover 320, 375, 390, 430, 768, 1024 and 1440px in Chrome and WebKit, overflow, CTA size, WCAG A/AA checks, reduced motion, menu keyboard operation, skip navigation and existing page routes. Set `TEST_BASE_URL` to test another running local server. Screenshots and the HTML report are written to ignored `outputs/`.

Three additional device projects use the installed Playwright profiles for iPhone SE (first generation), iPhone 13 and Pixel 7. They check touch navigation, product discovery, accessibility and all page routes in portrait and landscape. These are browser emulations, not physical-device tests. Run them with `npm test -- --project=iphone-se --project=iphone-13 --project=pixel-7`.
