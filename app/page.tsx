import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LProofLatest, LProofLatestSkeleton } from "@/components/l-proof-latest";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <main id="main" className="studio-home" tabIndex={-1}>
      <section className="studio-hero" aria-labelledby="hero-title">
        <div className="studio-hero-copy">
          <p className="eyebrow">Independent product studio · Seoul</p>
          <h1 id="hero-title">작게 만들고,<br /><em>쓰면서 개선합니다.</em></h1>
          <p className="studio-intro">정보를 확인하고, 계획을 기억하고, 식사를 기록하는 일.<br className="desktop-break" /> 반복해서 신경 쓰이는 일을 덜어주는 소프트웨어를 만듭니다.</p>
          <div className="studio-hero-actions"><a className="button button-dark" href="#products">제품 둘러보기 <span aria-hidden="true">↓</span></a><Link className="text-link" href="/about">만드는 사람 <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
      <section className="studio-products studio-section" id="products" aria-labelledby="products-title">
        <div className="studio-section-head"><div><p className="eyebrow">Selected products</p><h2 id="products-title">일상을 돕는 작은 도구들.</h2></div></div>
        <div className="showcase-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="studio-products-more"><Link className="text-link" href="/products">제품별 기능과 제공 범위 <span aria-hidden="true">→</span></Link></div>
      </section>
      <section className="studio-process studio-section" aria-labelledby="process-title">
        <div className="studio-section-head"><div><p className="eyebrow">Build notes / How Much Calories Left</p><h2 id="process-title">반 공기는 반 공기로.<br />피드백이 바꾼 기록 방식.</h2></div></div>
        <div className="build-story">
          <div className="build-story-origin"><p className="story-label">사용자의 말에서 시작</p><blockquote>사진 없이 먹은 것을 말로 남기는 건 편했어요. 그런데 1/2이 두 개로 기록되고, 어떤 음식의 칼로리인지 다시 확인해야 했어요.</blockquote><p className="story-caption">2026년 10월 두 사용자의 피드백을 묶어 익명으로 요약했습니다.</p><p>간편한 입력만큼, 기록된 결과를 납득할 수 있는 것도 중요했습니다. 입력을 더 자세히 요구하기 전에 해석과 응답을 다듬었습니다.</p></div>
          <ol className="build-changes">
            <li><span>01 / 입력 해석</span><h3>1/2, 0.5, ‘반’을 같은 양으로</h3><p>분수 표현을 수량으로 해석하도록 보완하고, 같은 음식의 절반이 동일하게 계산되는지 검사합니다.</p></li>
            <li><span>02 / 계산 근거</span><h3>합계 옆에 무엇을 기록했는지</h3><p>음식별 양과 칼로리를 함께 보여줍니다. 양을 생략해 기본량을 썼거나 대표 제품을 선택했다면 그 이유도 안내합니다.</p></li>
            <li><span>03 / 다시 확인</span><h3>지난 대화로 돌아갈 수 있게</h3><p>최근 응답과 대화 기록 화면을 분리해, 어떤 입력으로 기록했는지 다시 살펴볼 수 있도록 했습니다.</p></li>
          </ol>
        </div>
        <div className="build-story-footer"><p>공개 저장소 구현 기준 · 실제 제공 범위는 앱에서 확인할 수 있습니다.</p><a className="text-link" href="https://github.com/ipjaworld/HowMuchCaloriesLeft/tree/f4c19b9" target="_blank" rel="noreferrer">개선 코드 살펴보기 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></div>
      </section>
      <section className="studio-insights studio-section" aria-labelledby="insights-title">
        <div className="studio-section-head"><div><p className="eyebrow">From L‑Proof AI</p><h2 id="insights-title">최근에 전한 이야기.</h2></div><p>직접 운영하는 AI 개발 브리핑에서<br />최근 발행한 글을 모았습니다.</p></div>
        <Suspense fallback={<LProofLatestSkeleton />}><LProofLatest /></Suspense>
      </section>
      <section className="studio-about studio-section" aria-labelledby="about-title">
        <div><p className="eyebrow">Behind the products</p><h2 id="about-title">한 사람이 만들고,<br />계속 돌보는 제품들.</h2><figure className="studio-founder-photo"><Image src="/images/founder/geonha-portrait.webp" alt="숲길에서 웃고 있는 HETRICH 개발자 이건하" width={960} height={1200} sizes="(max-width: 700px) 78vw, 320px" /><figcaption>이건하 · HETRICH</figcaption></figure></div>
        <div><p>안녕하세요, HETRICH를 만드는 개발자 이건하입니다. 직접 기획하고 개발한 제품을 운영하며, 사용 중에 들려오는 불편을 다음 수정의 출발점으로 삼습니다. 써본 이야기나 함께 만들고 싶은 일이 있다면 들려주세요.</p><div className="studio-hero-actions"><Link className="button button-dark" href="/contact">제품 피드백·협업 제안 <span aria-hidden="true">↗</span></Link><a className="text-link" href="https://github.com/ipjaworld" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></div></div>
      </section>
    </main>
  );
}
