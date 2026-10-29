import { socialShareImage } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { products } from "@/lib/products";
import Link from "next/link";
import { ProductPreview } from "@/components/product-card";
import { ExperimentFeature } from "@/components/experiment-feature";

export const metadata: Metadata = { title: "Products", description: "생활 속 질문에서 시작한 HETRICH의 제품과 설계·구현 사례입니다.", alternates: { canonical: "/products" }, openGraph: { images: [socialShareImage], title: "Products — HETRICH", description: "직접 만든 제품의 설계 판단과 개선 경험", url: "/products" } };

export default function ProductsPage() {
  return <main id="main" className="subpage" tabIndex={-1}>
    <header className="page-hero products-page-hero"><p className="eyebrow">Products / Released & in progress</p><h1>생활과 업무에서 만난 질문을<br />직접 만든 도구로.</h1><p>생활 속 불편과 업무에서 필요한 일을 직접 만든 제품과 도구로 풀어봤습니다. 실제 화면과 함께 설계의 이유와 개선 과정을 소개합니다.</p></header>
    <section className="product-index" aria-label="HETRICH 제품 목록">{products.map((product) => <article className={`product-row product-row-${product.theme}`} key={product.id}>
      <div className="product-row-number">{product.number}</div>
      <div className="product-row-title"><span className={`status${product.status === "Live" ? " status-live" : " status-building"}`}>{product.status} · {product.stage}</span><h2>{product.name}</h2>{"fullName" in product && <p className="product-full-name">{product.fullName}</p>}<p>{product.category}</p></div>
      <div className="product-row-copy"><strong>{product.lead}</strong><p>{product.description}</p><p>{product.progress}</p><p className="availability">{product.availability}</p><div className="product-actions">{product.id === "secretary" ? <Link className="button button-dark" href={product.service}><span className="button-content"><span className="button-label">{product.serviceLabel}</span><span aria-hidden="true">→</span></span></Link> : <a className={`button ${product.status === "Live" ? "button-light" : "button-dark"}`} href={product.service} target="_blank" rel="noreferrer"><span className="button-content"><span className="button-label">{product.serviceLabel}</span><span aria-hidden="true">↗</span></span><span className="sr-only"> (새 탭)</span></a>}<a className="text-link" href={product.github} target="_blank" rel="noreferrer" aria-label={`${product.name} GitHub (새 탭)`}>GitHub <span aria-hidden="true">↗</span></a></div></div>
      <div className="product-row-visual"><ProductPreview product={product} />{product.id !== "secretary" && <Link className="text-link" href={`/products/${product.id}`}>{product.name} 설계와 구현 <span aria-hidden="true">→</span></Link>}</div>
    </article>)}</section>
    <ExperimentFeature />
  </main>;
}
