import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "어떤 고민을 덜고 어떤 선택을 남길지, 직접 만든 제품으로 제안하는 개발자 이건하와 HETRICH의 이야기입니다.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About — HETRICH", description: "HETRICH와 개발자 이건하가 제품을 만드는 방식", url: "/about" },
};

export default function AboutPage() {
  return <main id="main" className="subpage about-page" tabIndex={-1}>
    <header className="page-hero about-page-hero">
      <p className="eyebrow">About / Independent studio</p>
      <h1>어떤 경험이 좋을지,<br />직접 만들어 제안합니다.</h1>
      <p>HETRICH는 개발자 이건하가 제품을 직접 만들고 운영하며, 웹 서비스와 업무 도구 개발을 함께하는 1인 제품·개발 스튜디오입니다.</p>
    </header>
    <section className="about-studio">
      <p className="eyebrow">01 / HETRICH</p>
      <div>
        <h2>여기서 꼭 고민해야 하는 일은<br />무엇일까요?</h2>
        <div className="prose-columns">
          <p>AI에게 무엇이든 요청할 수 있어도, 무엇을 말할지 정하고 의도와 다른 결과를 고치는 일은 여전히 사람의 몫입니다. HETRICH는 그 과정에서 제품이 먼저 정리할 수 있는 부분을 찾습니다. 정보를 읽을 출발점, 계획을 남기는 방식, 결과를 고칠 방법을 고민합니다.</p>
          <p>사람마다 쓸 수 있는 시간과 익숙한 방식은 다릅니다. 익히는 속도나 이용 빈도가 달라도 필요한 경험에 닿을 수 있게 만들고 싶습니다. 그 안에서 취향을 발견하고 다음 선택을 고민하는 즐거움은 남겨두려 합니다.</p>
        </div>
      </div>
    </section>
    <section className="founder-section" aria-labelledby="founder-title">
      <p className="eyebrow">02 / Founder</p>
      <figure className="founder-photo">
        <Image className="founder-portrait" src="/images/founder/geonha-portrait.webp" alt="HETRICH를 만드는 개발자 이건하" width={960} height={1200} sizes="(max-width: 700px) 78vw, 320px" />
      </figure>
      <div className="founder-copy">
        <div className="founder-name"><h2 id="founder-title">이건하</h2></div>
        <p>“이렇게 해보면 어떨까?” 하는 생각을 직접 확인하는 걸 좋아합니다. 생활 도구도 만들고, 게임의 선택과 규칙도 궁리합니다. 제가 찾은 방법이 누군가에게 쓸모가 있을 때, 계속 만들어볼 이유가 생깁니다.</p>
        <p>일이 바쁜 날에는 뉴스레터를 읽어도 내용을 제 일과 연결할 여유가 없었습니다. 그래서 L-Proof에는 소식의 의미를 해석하는 관점을 담았습니다. 그 해석에 동의하지 않더라도 직접 판단할 수 있게 근거를 함께 남깁니다.</p>
        <p>이전 실무에서는 업무 플랫폼과 구독 커머스의 프론트엔드 전체 구현과 API 연동을 각각 전담했습니다. 디자인·UX 담당자들과 협업하며 실제 입력 방식과 화면의 예외를 살폈습니다. 직접 운영하는 제품에서도 쓰는 사람의 반응을 다음 수정에 반영합니다.</p>
        <p>앞으로도 일상과 업무에서 발견한 질문을 작은 제품으로 시험하고, 다른 팀의 서비스도 함께 만들고 싶습니다. 그 과정에서 제가 먼저 겪은 시행착오와 판단 기준도 나누려 합니다. 누군가 “나도 내 환경에서 해볼 수 있겠다”고 느낄 출발점을 제품과 기록으로 남기는 스튜디오를 지향합니다.</p>
        <p><Link className="text-link" href="/#development-notes">AI 개발에서 배운 판단 기준 <span aria-hidden="true">→</span></Link></p>
        <div className="studio-hero-actions"><Link className="text-link" href="/work">실무 경험과 담당 범위 <span aria-hidden="true">→</span></Link><a className="text-link" href="https://github.com/ipjaworld" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></div>
      </div>
    </section>
    <section className="about-principles">
      <p className="eyebrow">만들면서 지키려는 것</p>
      <ul><li>먼저 써볼 수 있게 만듭니다.</li><li>선택한 이유와 근거를 남깁니다.</li><li>어긋난 결과를 고칠 길을 둡니다.</li><li>쓰는 사람의 반응으로 다듬습니다.</li></ul>
    </section>
  </main>;
}
