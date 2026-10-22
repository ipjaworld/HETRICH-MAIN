import Image from "next/image";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About", description: "실제 흐름을 위한 작은 AI 제품을 만드는 독립 제품 스튜디오 HETRICH와 Founder 이건하를 소개합니다.", alternates: { canonical: "/about" }, openGraph: { title: "About — HETRICH", description: "HETRICH와 Founder 이건하가 제품을 만드는 방식", url: "/about" } };
export default function AboutPage() { return <main id="main" className="subpage about-page" tabIndex={-1}><header className="page-hero about-page-hero"><p className="eyebrow">About / Independent studio</p><h1>작은 제품이<br />실제 흐름을 바꾸도록.</h1><p>HETRICH는 개발자 이건하가 제품을 직접 만들고 운영하며, 웹 서비스와 업무 도구 개발을 함께하는 1인 제품·개발 스튜디오입니다.</p></header><section className="about-studio"><p className="eyebrow">01 / HETRICH</p><div><h2>가능성보다<br />맡길 수 있는 역할을 봅니다.</h2><div className="prose-columns"><p>기술이 할 수 있는 일이 많아질수록 사용자가 해야 할 선택까지 늘어날 필요는 없습니다. 사람이 생각하고 싶은 문제에 집중하도록, 정보 확인·기억·기록에서 원하지 않는 반복과 관리 부담을 줄이는 방법을 찾습니다.</p><p>범위를 작게 잡고 먼저 사용합니다. 자동화가 외부 세계에 영향을 주기 전에는 사람이 판단할 지점을 남기고, 제품이 하지 못하는 일도 숨기지 않습니다.</p></div></div></section><section className="founder-section" aria-labelledby="founder-title">
  <p className="eyebrow">02 / Founder</p>
  <figure className="founder-photo">
    <Image className="founder-portrait" src="/images/founder/geonha-portrait.webp" alt="HETRICH를 만드는 개발자 이건하" width={960} height={1200} sizes="(max-width: 700px) 78vw, 320px" />
  </figure>
  <div className="founder-copy">
    <div className="founder-name"><h2 id="founder-title">이건하</h2></div>
    <p>HETRICH의 제품을 만들고 운영하며, 인터랙티브 경험도 실험합니다. 거대한 문제를 선언하기보다, 반복해서 신경 쓰게 만드는 작은 마찰을 찾습니다.</p>
    <p>이전 실무에서는 TalkGate와 꼬순박스의 프론트엔드 전체 구현과 API 연동을 각각 전담했습니다. 디자인·UX 담당자들과 협업하며 화면 상태와 예외 처리를 보완했고, 티피엘엔디에서는 선임 프론트엔드 개발자로 근무했습니다.</p>
    <p>제품을 실제로 배포한 뒤 드러나는 예외와 운영 부담을 다음 설계에 반영합니다. AI는 조사와 정리, 반복 실행을 넓히고, 기준과 승인에 대한 책임은 사람이 갖는 방식을 선호합니다.</p>
    <p>이 사이트 역시 한 번에 완성된 시스템이 아니라, 제품과 발행물이 늘어날 때 필요한 구조를 먼저 만든 결과입니다.</p>
    <a className="text-link" href="https://github.com/ipjaworld" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </div>
</section><section className="about-principles"><p className="eyebrow">Working principles</p><ul><li>Small scope, real use.</li><li>Evidence before assumption.</li><li>Humans at critical decisions.</li><li>Transparent product boundaries.</li></ul></section></main>; }
