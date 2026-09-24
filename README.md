# HETRICH — Official Site

HETRICH의 제품, 관점, 기록을 한곳에 모은 공식 브랜드 사이트입니다. 기존 한 페이지 랜딩의 시각 언어를 유지하면서, 제품 포트폴리오와 L‑Proof AI 아카이브를 장기적으로 확장할 수 있도록 Next.js App Router 기반의 다중 페이지 사이트로 재구성했습니다.

**Live:** [hetrich.ipjaworld.chatgpt.site](https://hetrich.ipjaworld.chatgpt.site/)

## 무엇을 담고 있나요?

- HETRICH의 방향과 핵심 원칙
- L‑Proof AI, HETRICH AI Secretary, How Much Calories Left 제품 소개
- L‑Proof‑AI 공개 API와 연결된 최신 발행물 및 전체 아카이브
- L‑Proof‑AI canonical 원문으로 이어지는 안전한 외부 링크
- Founder 이건하와 HETRICH 소개
- 서버 검증과 스팸 방지 경계를 포함한 Contact 폼

## 기술 구성

- Next.js 16 App Router
- React 19 + TypeScript
- Vercel 배포를 기준으로 한 Next.js 서버 렌더링과 5분 재검증
- Zod를 이용한 Contact API 입력 검증
- `next/font`, `next/image`, Metadata API
- L‑Proof‑AI 공개 Articles API

L‑Proof‑AI가 아티클의 유일한 원본 발행처입니다. HETRICH는 공개 API에서 목록과 미리보기만 가져오며 본문, CMS, 데이터베이스를 복제하지 않습니다.

## 라우트

| 경로 | 역할 |
| --- | --- |
| `/` | 브랜드 소개, 제품 요약, 최신 Insights |
| `/products` | 제품 포트폴리오와 현재 상태 |
| `/insights` | L‑Proof‑AI 공개 발행물을 보여주는 HETRICH Hub |
| `/about` | HETRICH와 Founder 소개 |
| `/contact` | 문의 폼과 직접 이메일 안내 |
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

서버에서 문의를 전달하려면 아래 환경 변수를 배포 환경에 설정합니다.

```bash
CONTACT_WEBHOOK_URL=https://example.com/contact-webhook
CONTACT_WEBHOOK_BEARER_TOKEN=optional-secret
```

- `CONTACT_WEBHOOK_URL`은 JSON `POST`를 받을 수 있는 HTTPS 엔드포인트입니다.
- `CONTACT_WEBHOOK_BEARER_TOKEN`은 선택 사항이며 설정 시 `Authorization: Bearer ...` 헤더로 전달됩니다.
- 웹훅이 없으면 API는 `503 not_configured`를 반환합니다. 성공한 것처럼 표시하지 않으며, 화면에서 직접 이메일 연락을 안내합니다.
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

- 기존 HETRICH 랜딩의 편집 디자인, 컬러, 타이포그래피를 유지합니다.
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
