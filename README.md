# HETRICH

HETRICH의 공식 랜딩 페이지이자 제품 허브입니다. 개인 이력이나 기술 스택보다 현재 운영하거나 개발 중인 제품, 각 제품이 해결하는 문제, 실제 구현 상태를 먼저 보여줍니다.

## 제품

| 제품 | 이 사이트의 상태 표기 | 확인 근거 | 링크 |
| --- | --- | --- | --- |
| L‑Proof AI | `Live · Alpha` | 공개 랜딩과 production D1 구독 흐름이 운영 중이며, 사람의 검토를 거친 예약 발송 구조를 구현 중입니다. | [서비스](https://l-proof-ai.xyz) · [저장소](https://github.com/ipjaworld/l-proof-ai) |
| HETRICH AI Secretary | `In development` | 공개 저장소에는 제품 철학과 개발 중인 화면을 공개하고, 실제 소스와 운영 자료는 별도로 관리합니다. 배포된 개발 버전을 직접 확인할 수 있습니다. | [개발 버전](https://hetrich.vercel.app/) · [저장소](https://github.com/ipjaworld/HETRICH-ai-secretary) |
| 오늘 얼마 먹어도 돼? | `MVP · Building` | 자연어 기록·수정·삭제가 동작하는 MVP입니다. 인증, 서버 DB, 넓은 음식 커버리지는 아직 범위 밖이며 배포된 MVP를 직접 사용해볼 수 있습니다. | [MVP](https://how-much-calories-left.vercel.app/) · [저장소](https://github.com/ipjaworld/HowMuchCaloriesLeft) |

상태와 설명은 2026년 9월 각 공개 저장소의 README와 구현을 직접 확인해 작성했습니다. 완성되지 않은 기능을 서비스 중인 것처럼 표현하지 않습니다.

## 페이지 구조

단일 페이지 안에서 방문자가 다음 순서로 HETRICH를 이해하도록 구성했습니다.

1. **Hero** — HETRICH가 실제 흐름을 위한 작은 AI 제품을 만든다는 정의와 현재 제품 현황
2. **Products** — 세 제품의 문제, 현재 구현 범위, 상태, 실제 CTA
3. **How we build** — 제품 전반에 공통으로 적용하는 다섯 가지 제작 원칙
4. **Insights** — 향후 L‑Proof AI 발행물을 옮겨올 수 있는 확장 지점
5. **About** — 1인 독립 제품 스튜디오라는 짧은 설명
6. **Footer** — 제품, GitHub, 확인된 연락처

## 디자인 시스템

현재 저장소는 시작 시 `.git`만 존재해 재사용할 기존 컴포넌트나 토큰이 없었습니다. 대신 HETRICH의 공개 제품에서 이미 쓰고 있는 원칙을 공통 언어로 가져왔습니다.

- **편집형 정보 구조:** L‑Proof AI의 문서/편집 디자인처럼 모노스페이스 라벨, 얇은 구분선, 명확한 정보 위계를 사용합니다.
- **차분한 제품 중심 톤:** AI 스타트업식 네온 그라데이션, 유리 효과, 근거 없는 숫자와 고객 로고를 쓰지 않습니다.
- **하나의 선명한 브랜드 장치:** 짙은 잉크색과 종이색 위에 acid yellow와 blue를 제한적으로 사용합니다.
- **제품별 구분:** L‑Proof AI는 검은 편집 지면, AI Secretary는 밝은 yellow, 칼로리 앱은 따뜻한 neutral과 orange로 구분하되 타이포그래피와 그리드는 공유합니다.
- **실제 자산 우선:** L‑Proof AI와 AI Secretary 저장소에서 공개한 이미지를 사용했습니다. 의미 없는 생성 이미지나 가상의 제품 목업은 넣지 않았습니다.

## 구현

의존성 없는 정적 사이트입니다.

```text
.
├── .openai/hosting.json   # Sites 정적 배포 설정
├── dist/
│   ├── index.html         # 시맨틱 페이지와 SEO 메타데이터
│   ├── styles.css         # 전체 레이아웃, 토큰, 반응형 스타일
│   ├── script.js          # 모바일 메뉴, 헤더 상태, 연도
│   └── assets/            # 각 제품 저장소에서 가져온 실제 공개 이미지
└── README.md
```

별도의 빌드가 필요하지 않습니다. 로컬에서는 정적 파일 서버로 `dist`를 열면 됩니다.

```bash
npx serve dist
```

또는 Python이 있다면 다음처럼 확인할 수 있습니다.

```bash
python -m http.server 4173 --directory dist
```

## 반응형 기준

- **Desktop:** Hero와 제품을 비대칭 3열 그리드로 배치해 제품 설명과 실제 화면을 함께 읽게 합니다.
- **Tablet (`≤ 1000px`):** 제품 설명 아래로 이미지를 이동하고, 타이틀과 설명의 읽기 폭을 유지합니다.
- **Mobile (`≤ 700px`):** 메뉴를 접고 모든 섹션을 1열로 재구성합니다. Hero의 강제 줄바꿈을 해제해 한글이 두세 글자씩 끊기지 않게 했습니다.
- CTA는 모바일에서 세로로 쌓이며, 제품 카드 높이는 콘텐츠에 맞게 자연스럽게 늘어납니다.
- `prefers-reduced-motion`을 존중하고, 모든 본문 텍스트는 기본 16px 이상입니다.

## 접근성과 SEO

- 시맨틱 `header`, `nav`, `main`, `section`, `article`, `footer` 구조와 순차적인 heading hierarchy
- 키보드 포커스, 본문 건너뛰기 링크, 모바일 메뉴의 `aria-expanded`, 의미 있는 링크 레이블
- 실제 화면을 설명하는 이미지 대체 텍스트
- `title`, `description`, Open Graph/X 텍스트 메타데이터, theme color, H 모티프 SVG favicon
- 소셜 공유 이미지는 별도 요청이 없어 임의로 생성하지 않았습니다.

## 현재 임시이거나 추후 연결할 부분

- **Insights 아카이브:** 구조와 진입점만 마련했습니다. 실제 CMS나 발행물 목록은 연결하지 않았습니다.
- **AI Secretary:** 배포된 개발 버전과 GitHub 소개 저장소를 함께 연결합니다. 개발 중인 기능의 범위는 달라질 수 있습니다.
- **칼로리 앱:** 배포된 MVP와 구현 저장소를 함께 연결합니다. 현재는 단일 사용자·브라우저 저장 기반입니다.
- **Canonical URL:** 현재 Sites 배포 주소를 canonical과 `og:url`로 사용합니다. 추후 공식 도메인을 연결하면 함께 갱신해야 합니다.
- **제품 상태:** 제품이 배포되거나 범위가 바뀌면 카드 라벨과 설명을 함께 갱신해야 합니다.

## 콘텐츠 원칙

HETRICH를 실제보다 큰 회사처럼 보이게 하지 않습니다. 지금 동작하는 것, 개발 중인 것, 아직 연결하지 않은 것을 분리해 말합니다. 제품이 늘어나더라도 `Products → Approach → Insights` 구조를 유지하며 확장할 수 있습니다.

## License

이 저장소의 코드와 HETRICH 브랜드 자산에 대한 권리는 저장소 소유자에게 있습니다. 포함된 제품 이미지는 각 HETRICH 제품 저장소에서 가져왔습니다.
