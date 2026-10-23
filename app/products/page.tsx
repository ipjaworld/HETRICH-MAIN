import type { Metadata } from "next";
import { products } from "@/lib/products";
import Link from "next/link";
import { ProductPreview } from "@/components/product-card";
import { ExperimentFeature } from "@/components/experiment-feature";

export const metadata: Metadata = { title: "Products", description: "HETRICH가 운영하고 개발하는 제품과 현재 제공 범위입니다.", alternates: { canonical: "/products" }, openGraph: { title: "Products — HETRICH", description: "작은 제품의 현재 기능과 개선 기록", url: "/products" } };

export default function ProductsPage() {
  return <main id="main" className="subpage" tabIndex={-1}>
    <header className="page-hero products-page-hero"><p className="eyebrow">Products / Released & in progress</p><h1>생활 속 질문을<br />써볼 수 있는 제품으로.</h1><p>어디서 불편했는지, 어떤 방법을 택했는지, 지금 어디까지 쓸 수 있는지. 직접 만든 도구와 실험을 소개합니다.</p></header>
    <section className="product-index" aria-label="HETRICH 제품 목록">{products.map((product) => <article className={`product-row product-row-${product.theme}`} key={product.id}>
      <div className="product-row-number">{product.number}</div>
      <div className="product-row-title"><span className={`status${product.status === "Live" ? " status-live" : " status-building"}`}>{product.status} · {product.stage}</span><h2>{product.name}</h2>{"fullName" in product && <p className="product-full-name">{product.fullName}</p>}<p>{product.category}</p></div>
      <div className="product-row-copy"><strong>{product.lead}</strong><p>{product.description}</p><p>{product.progress}</p><p className="availability">{product.availability}</p><div className="product-actions"><a className={`button ${product.status === "Live" ? "button-light" : "button-dark"}`} href={product.service} target="_blank" rel="noreferrer">{product.serviceLabel} <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><a className="text-link" href={product.github} target="_blank" rel="noreferrer" aria-label={`${product.name} GitHub (새 탭)`}>GitHub <span aria-hidden="true">↗</span></a></div></div>
      <div className="product-row-visual"><ProductPreview product={product} /><Link className="text-link" href={`/products/${product.id}`}>{product.name} 설계와 구현 <span aria-hidden="true">→</span></Link></div>
    </article>)}</section>
    <ExperimentFeature />
  </main>;
}
