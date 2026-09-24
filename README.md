# HETRICH — Official Site

HETRICH의 제품, 관점, 기록을 한곳에 모은 공식 브랜드 사이트입니다. 기존 한 페이지 랜딩의 시각 언어를 유지하면서, 제품 포트폴리오와 L‑Proof AI 아카이브를 장기적으로 확장할 수 있도록 Next.js App Router 기반의 다중 페이지 사이트로 재구성했습니다.

**Live:** [hetrich.ipjaworld.chatgpt.site](https://hetrich.ipjaworld.chatgpt.site/)

## 무엇을 담고 있나요?

- HETRICH의 방향과 핵심 원칙
- L‑Proof AI, HETRICH AI Secretary, How Much Calories Left 제품 소개
- 날짜·카테고리·호수·상태를 가진 Insights 아카이브
- 개별 글 메타데이터와 Open Graph 정보
- Founder 이건하와 HETRICH 소개
- 서버 검증과 스팸 방지 경계를 포함한 Contact 폼

## 기술 구성

- Next.js 16 App Router
- React 19 + TypeScript
- Vinext / Cloudflare Workers 기반 Sites 런타임
- Zod를 이용한 Contact API 입력 검증
- `next/font`, `next/image`, Metadata API
- 로컬 JSON 기반 Insights 콘텐츠

CMS나 데이터베이스를 먼저 도입하지 않고, Git에서 검토 가능한 콘텐츠 파일을 단일 소스로 사용합니다. 글 수가 늘거나 편집 흐름이 복잡해질 때 `lib/insights.ts`의 데이터 접근 계층만 CMS 또는 DB로 교체할 수 있도록 페이지와 콘텐츠를 분리했습니다.

## 라우트

| 경로 | 역할 |
| --- | --- |
| `/` | 브랜드 소개, 제품 요약, 최신 Insights |
| `/products` | 제품 포트폴리오와 현재 상태 |
| `/insights` | 발행된 글 아카이브 |
| `/insights/[slug]` | 개별 글, SEO 메타데이터, 이전·다음 글 |
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

프로덕션 빌드 결과를 로컬 Worker로 확인하려면 먼저 빌드한 뒤 실행합니다.

```bash
npm run build
npm start
```

## Insights 글 추가하기

1. `content/insights/`에 `YYYY-MM-DD-slug.json` 파일을 추가합니다.
2. `lib/insights.ts`에서 파일을 import하고 `insights` 배열에 등록합니다.
3. `published`를 `true`로 설정하면 목록, 상세 페이지, 사이트맵에 포함됩니다.
4. `npm run typecheck`와 `npm run build`로 스키마와 라우트를 검증합니다.

현재 콘텐츠 블록은 네 종류입니다.

```json
{
  "title": "글 제목",
  "date": "2026-09-24",
  "category": "Build Note",
  "issue": null,
  "summary": "목록과 검색 결과에 사용할 요약",
  "slug": "example-slug",
  "published": true,
  "tags": ["HETRICH"],
  "body": [
    { "type": "heading", "text": "소제목" },
    { "type": "paragraph", "text": "본문" },
    { "type": "quote", "text": "강조 문장" },
    { "type": "list", "items": ["항목 1", "항목 2"] }
  ]
}
```

실제 L‑Proof AI 간행물을 게시할 때는 `category`, `issue`, `proofLevel`, `sources`를 함께 채우면 됩니다. 확인되지 않은 출처나 호수는 임의로 만들지 않습니다.

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
components/           공통 헤더·푸터와 Contact 인터랙션
content/insights/     Insights 원본 콘텐츠
lib/insights.ts       콘텐츠 타입과 조회 계층
public/               제품 이미지와 파비콘
scripts/, build/      Sites/Vinext 실행 및 빌드 도구
.openai/hosting.json  Sites 프로젝트 연결 정보
```

## 설계 원칙

- 기존 HETRICH 랜딩의 편집 디자인, 컬러, 타이포그래피를 유지합니다.
- 페이지 기본값은 Server Component로 두고, 메뉴·복사 버튼·폼만 Client Component로 분리합니다.
- 각 페이지와 글은 고유 title, description, canonical, Open Graph 정보를 가집니다.
- 제품의 현재 상태와 사용할 수 없는 기능을 과장하지 않습니다.
- 콘텐츠 양이 적은 단계에서는 복잡한 CMS·관리자·인증을 도입하지 않습니다.

## 현재 의도적으로 제외한 범위

- CMS 및 관리자 화면
- 사용자 계정과 인증
- 검색, 태그 필터, 댓글
- 분석 SDK와 마케팅 트래커
- 데이터베이스
- Contact 웹훅 공급자 자체 구현

이 기능들은 실제 운영 필요가 생겼을 때 콘텐츠 접근 계층과 Contact API 경계를 기준으로 확장할 수 있습니다.

## 관련 프로젝트

- [L‑Proof AI](https://github.com/ipjaworld/l-proof-ai)
- [HETRICH AI Secretary](https://github.com/ipjaworld/HETRICH-ai-secretary)
- [How Much Calories Left](https://github.com/ipjaworld/HowMuchCaloriesLeft)

## License

All rights reserved. © 2026 HETRICH.
