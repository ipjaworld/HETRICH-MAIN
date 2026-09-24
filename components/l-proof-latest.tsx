import Link from "next/link";
import { LProofCard } from "@/components/l-proof-card";
import { fetchCachedLProofArticles } from "@/lib/l-proof-server";

export function LProofLatestSkeleton() {
  return <div className="lproof-latest-grid" aria-hidden="true">{[0, 1, 2].map((item) => <div className="lproof-card lproof-skeleton" key={item}><span /><strong /><span /><span /></div>)}</div>;
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
      <div className="lproof-latest-grid">
        {result.data.items.slice(0, 3).map((article) => <LProofCard article={article} variant="latest" key={article.slug} />)}
      </div>
      <Link className="text-link home-insights-all" href="/insights">HETRICH Hub에서 전체 보기 <span aria-hidden="true">→</span></Link>
    </>
  );
}
