import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { stories } from '@/lib/product-stories';

export function ProductPreview({ product }: { product: Product }) {
  const story = stories[product.id];
  return <figure className={`product-preview evidence-preview evidence-${product.theme}`}>
    <Link href={`/products/${product.id}`} className="evidence-image" aria-label={`${product.name} 제품 사례 보기`}>
      <Image src={story.image} width={story.width} height={story.height} sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 560px" alt={story.alt} />
      <span className="preview-open" aria-hidden="true">↗</span>
    </Link>
    <figcaption>{story.caption}</figcaption>
  </figure>;
}
export function ProductCard({ product }: { product: Product }) {
  return <article className={`showcase-card showcase-${product.theme}`} id={product.id} aria-labelledby={`${product.id}-title`}>
    <ProductPreview product={product} />
    <div className="showcase-heading"><p className="product-number">{product.number} / {product.category}</p><h3 id={`${product.id}-title`}>{product.name}</h3><p className="showcase-status"><span aria-hidden="true" />{product.homeStatus}</p></div>
    <p className="showcase-lead">{product.homeSummary}</p>
    <div className="showcase-actions"><a className="button button-dark" href={product.service} target="_blank" rel="noreferrer"><span className="button-label">{product.serviceLabel}</span><span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><Link className="text-link" href={`/products/${product.id}`} aria-label={`${product.name} 설계와 구현`}>설계와 구현 <span aria-hidden="true">→</span></Link></div>
  </article>;
}
