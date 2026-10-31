import Image from "next/image";
import Link from "next/link";
import { products, type Product } from "@/lib/products";

const work = [
  { title: "입력은 편하게, 화면은 일관되게", solution: "입력 패턴을 관찰해 공통 UI를 개선하고, 캐시 갱신과 46개 모달의 외부 클릭·포커스·스크롤 충돌을 보완했습니다.", scope: "프론트엔드 구현 · API 연동 · UX 협업" },
  { title: "한 번의 구매가 중복 요청이 되지 않도록", solution: "처리 중 상태와 중복 요청 차단을 구현하고, 인증·쿠폰·오류·리다이렉트 흐름을 자동 테스트로 검증했습니다.", scope: "구매 UI · 예외 처리 · E2E 검증" },
  { title: "외부 결제의 결과를 서비스의 상태로", solution: "인증·결제 API와 PG를 연동하고, 외부 응답을 서비스의 의뢰·결제 흐름에 연결했습니다.", scope: "백엔드 구현 · 인증 API · PG 연동" },
];

function ProductRow({ product }: { product: Product }) {
  const external = product.service.startsWith("http");
  return <li className="record-row" id={product.id}>
    <h3>{product.name}</h3>
    <p className="record-status">{product.homeStatus}</p>
    <p>{product.homeSummary}</p>
    <div className="record-actions">
      {external && <a href={product.service} target="_blank" rel="noreferrer">{product.serviceLabel} <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>}
      <Link href={`/products/${product.id}`}><span className="sr-only">{product.name} </span>설계와 구현 <span aria-hidden="true">→</span></Link>
    </div>
  </li>;
}

export function HomeProducts() {
  return <section className="record" id="products" aria-labelledby="products-title">
    <h2 id="products-title">직접 만든 것</h2>
    <ul className="record-list">
      {products.map((product) => <ProductRow key={product.id} product={product} />)}
      <li className="record-row">
        <h3>악역영애 말포이 — 은빛 서약</h3>
        <p className="record-status">비상업 개인 창작 · 공개 플레이</p>
        <p>단서를 좇고 인물의 신뢰를 살피며 선택하는 비주얼 노벨입니다.</p>
        <div className="record-actions"><Link href="/products/silver-vow">설계 이야기 <span aria-hidden="true">→</span></Link></div>
      </li>
    </ul>
  </section>;
}

export function HomeWork() {
  return <section className="record" aria-labelledby="home-work-title">
    <h2 id="home-work-title">실무에서 맡은 일</h2>
    <ul className="record-list">
      {work.map((item) => <li className="record-row" key={item.title}><h3>{item.title}</h3><p className="record-status">{item.scope}</p><p>{item.solution}</p></li>)}
    </ul>
    <Link className="text-link record-more" href="/work">이전 조직에서의 담당 범위와 판단 과정 <span aria-hidden="true">→</span></Link>
  </section>;
}

export function HomePerson() {
  return <section className="record" aria-labelledby="home-person-title">
    <h2 id="home-person-title">만드는 사람</h2>
    <div className="record-person">
      <Image src="/images/founder/geonha-portrait.webp" alt="숲길에서 웃고 있는 HETRICH 개발자 이건하" width={960} height={1200} sizes="88px" />
      <div>
        <p>안녕하세요, 개발자 이건하입니다. 쓰다가 걸리는 부분을 보면 다른 방법을 떠올리고, 직접 만들어 확인하는 걸 좋아합니다.</p>
        <div>
          <Link className="text-link" href="/about">만드는 사람과 방향 <span aria-hidden="true">→</span></Link>
          <a className="text-link" href="https://github.com/ipjaworld" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>
          <Link className="text-link" href="/contact">연락하기 <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  </section>;
}
