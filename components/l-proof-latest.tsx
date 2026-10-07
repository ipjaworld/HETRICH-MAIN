import Link from "next/link";
import { formatPublishedAt, getSafeLProofArticleUrl } from "@/lib/l-proof";
import { fetchCachedLProofArticles } from "@/lib/l-proof-server";

export function LProofLatestSkeleton() {
  return <div className="home-articles" aria-hidden="true">{[0, 1, 2].map((item) => <div className="home-article home-article-skeleton lproof-skeleton" key={item}><span /><strong /></div>)}</div>;
}

export async function LProofLatest() {
  const result = await fetchCachedLProofArticles({ limit: 3 });

  if (!result.ok) {
    return <div className="lproof-inline-state"><p>최신 발행물을 잠시 불러오지 못했습니다.</p><a className="text-link" href="https://l-proof-ai.xyz/articles" target="_blank" rel="noreferrer">L‑Proof‑AI에서 확인 <span aria-hidden="true">↗</span></a></div>;
  }

  if (result.data.items.length === 0) {
    return <div className="lproof-inline-state"><p>아직 공개된 발행물이 없습니다.</p></div>;
  }

  return (
    <>
      <div className="home-articles">
        {result.data.items.slice(0, 3).map((article, index) => {
          const url = getSafeLProofArticleUrl(article.url);
          const content = <><time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time><div className="home-article-copy"><h3>{article.title}</h3>{index === 0 && <p>{article.summary}</p>}</div><span className="article-arrow" aria-hidden="true">{url ? "↗" : "—"}</span><span className="sr-only">{url ? "원문 읽기 (새 탭)" : "원문 링크 확인 필요"}</span></>;
          return url ? <a className="home-article" href={url} target="_blank" rel="noreferrer" key={article.slug}>{content}</a> : <article className="home-article" key={article.slug}>{content}</article>;
        })}
      </div>
      <Link className="text-link home-insights-all" href="/insights">L‑Proof AI 발행물 전체 보기 <span aria-hidden="true">→</span></Link>
    </>
  );
}
