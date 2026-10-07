import Image from "next/image";
import type { Product } from "@/lib/products";

function ProductPreview({ theme }: { theme: Product["theme"] }) {
  if (theme === "calories") return <figure className="product-preview preview-calories">
    <div className="preview-image-window"><Image src="/products/calories-record.png" width={609} height={901} sizes="(max-width: 700px) 90vw, 32vw" alt="칼로리 앱 실제 화면. 남은 72 kcal와 음식별 기록을 보여주며, 제육볶음을 200g에서 250g으로 수정한 결과를 안내합니다." /></div>
    <figcaption><a href="/products/calories-record.png" target="_blank" rel="noreferrer">기록·수정 화면 크게 보기 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></figcaption>
  </figure>;
  return <figure className={`product-preview preview-${theme}`}>
    <div className="preview-image-window">
      {theme === "secretary" ? <Image src="/products/his-home.png" width={1080} height={2340} sizes="(max-width: 700px) 90vw, 32vw" alt="HIS 개발 화면의 비서 캐릭터와 로고" /> : <Image src="/products/lproof-articles.png" width={1426} height={949} sizes="(max-width: 700px) 90vw, 32vw" alt="L-Proof AI 공개 아티클 목록 화면" />}
    </div>
    <figcaption>{theme === "secretary" ? "HIS · 제공받은 개발 화면 일부" : "L‑Proof AI · 공개 아티클 목록"}</figcaption>
  </figure>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className={`showcase-card showcase-${product.theme}`} id={product.id} aria-labelledby={`${product.id}-title`}>
    <ProductPreview theme={product.theme} />
    <div className="showcase-heading"><h3 id={`${product.id}-title`}>{product.name}</h3><p className="showcase-status"><span aria-hidden="true" />{product.homeStatus}</p></div>
    <p className="showcase-lead">{product.homeSummary}</p>
    <div className="showcase-actions"><a className="button button-dark" href={product.service} target="_blank" rel="noreferrer">{product.serviceLabel}<span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a></div>
  </article>;
}
