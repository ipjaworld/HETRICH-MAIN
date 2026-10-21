import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "이건하가 이전 조직에서 맡았던 업무 플랫폼, 구독 커머스, 관리자 도구와 영상 처리의 개발 경험입니다.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Selected Work — HETRICH", description: "맡아온 일, 해결해 온 문제. 이건하의 실무 개발 경험.", url: "/work" },
};

const work = [
  {
    id: "talkgate", number: "01", name: "TalkGate", category: "상담 업무 플랫폼",
    title: "조직 변경 이후의 화면 상태까지.",
    context: "핑크코브라 · 2025.10–2026.09 · 프리랜서 프론트엔드",
    paragraphs: [
      "고객·상담·조직 관리·분석 화면의 프론트엔드 전체 구현과 API 연동을 맡았습니다.",
      "팀장 교체 뒤 관련 상세 캐시를 먼저 보정하고 후속 조회를 연결해 화면 갱신을 다뤘습니다. 태블릿에서 발견한 배율 문제는 적용 제외안을 제안해 반영하고, 중첩 모달의 포커스·외부 클릭·스크롤 동작을 보완했습니다.",
    ],
    scope: "요구사항·기본 UX는 이사진, 시각 디자인은 디자이너와 협업했습니다.",
    skills: ["Next.js", "TypeScript", "TanStack Query", "공통 UI"],
    link: { label: "판단 과정 자세히", href: "https://app.notion.com/p/4006b63744898152a2afe2c64c1a8c3e" },
  },
  {
    id: "kkosunbox", number: "02", name: "꼬순박스", category: "구독 커머스",
    title: "구매와 결제의 예외를 다루는 화면.",
    context: "핑크코브라 · 2026.03–2026.09 · 프리랜서 프론트엔드",
    paragraphs: [
      "구독·단품 구매·결제·마이페이지 등 프론트엔드 전체 구현과 API 연동을 담당했습니다.",
      "처리 중 버튼 비활성화와 중복 요청 차단을 백엔드의 중복 주문 방지 처리와 연결했습니다. Playwright 검증을 인증·쿠폰·오류·리다이렉트 등 34개 시나리오로 확장했습니다.",
    ],
    scope: "이미지·폰트 최적화 뒤 데스크톱 Lighthouse Performance 57→88을 약 4회 반복 측정에서 확인했습니다.",
    skills: ["Next.js", "TypeScript", "Playwright", "결제 연동"],
    link: { label: "서비스 보기", href: "https://kkosunbox.com/" },
  },
  {
    id: "e-parts", number: "03", name: "E-PARTS", category: "중고차 부품 거래",
    title: "역할별 화면에서 배포 환경까지.",
    context: "티피엘엔디 · 2025.05–2025.07 · 프론트엔드",
    paragraphs: [
      "사용자 웹·어드민·마스터 어드민의 프론트엔드를 개발했습니다.",
      "Remix SSR을 적용하고 EC2·Nginx·Docker/ECR·Shell Script 기반의 배포 환경을 구성했습니다.",
    ],
    skills: ["Remix", "SSR", "AWS EC2", "Docker · Nginx"],
  },
  {
    id: "mohan", number: "04", name: "모하N", category: "영상 처리 · 운영 도구",
    title: "영상을 처리하고, 여러 화면으로 보내는 일.",
    context: "티피엘엔디 · 2025.04–2025.06 · Admin·영상 처리 개발",
    paragraphs: [
      "운영 Admin과 Node.js·FFmpeg 기반 영상 처리 기능을 구현했습니다.",
      "1–8분할 영상 합성, 인코딩·파일 처리와 S3 연동, 다중 디스플레이 송출을 다뤘습니다. 병렬 처리와 캐싱으로 반복 연산을 보완하며 영상 제작 경험을 소프트웨어 구현으로 연결했습니다.",
    ],
    skills: ["Node.js", "FFmpeg", "AWS S3", "운영 Admin"],
  },
];

export default function WorkPage() {
  return (
    <main id="main" className="subpage work-page" tabIndex={-1}>
      <header className="work-hero">
        <p className="eyebrow">Selected work / Professional experience</p>
        <h1>맡아온 일,<br />해결해 온 문제.</h1>
        <p className="work-intro">업무 플랫폼, 커머스, 관리자 도구와 영상 처리.<br />실제 제품에서 맡았던 범위와 구현 경험을 소개합니다.</p>
        <p className="work-attribution">이전 소속 조직에서 이건하 개인이 수행한 업무 경험입니다.<br />HETRICH의 수주·제작 실적과 구분합니다.</p>
      </header>
      <section className="selected-work" aria-label="주요 실무 경험">
        {work.map(item => (
          <article className="work-entry" id={item.id} key={item.id} aria-labelledby={`${item.id}-title`}>
            <div className="work-identity">
              <p className="eyebrow">{item.number} / {item.category}</p>
              <h2 id={`${item.id}-title`}>{item.name}</h2>
              <p className="work-context">{item.context}</p>
            </div>
            <div className="work-description">
              <h3>{item.title}</h3>
              {item.paragraphs.map(text => <p key={text}>{text}</p>)}
              {item.scope && <p className="work-scope">{item.scope}</p>}
              <ul className="work-skills" aria-label={`${item.name} 기술과 작업 범위`}>{item.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
              {item.link && <a className="text-link" href={item.link.href} target="_blank" rel="noreferrer">{item.link.label}<span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>}
            </div>
          </article>
        ))}
      </section>
      <section className="work-closing" aria-labelledby="work-contact-title">
        <p className="eyebrow">Have something in mind?</p>
        <h2 id="work-contact-title">만들고 싶은 흐름이 있나요?</h2>
        <p>업무 화면, 구매 흐름, 운영 도구처럼<br />구체적인 문제가 있는 일부터 이야기합니다.</p>
        <div className="studio-hero-actions"><Link className="button button-dark" href="/contact">개발·협업 문의 <span aria-hidden="true">↗</span></Link><a className="text-link" href="https://app.notion.com/p/b8a18220efaf4e25ab2791d1a729ba2a" target="_blank" rel="noreferrer">전체 경력 보기 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></div>
      </section>
    </main>
  );
}
