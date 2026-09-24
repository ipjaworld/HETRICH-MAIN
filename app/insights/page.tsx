import type { Metadata } from "next";
import { LProofArchive } from "@/components/l-proof-archive";
import { fetchCachedLProofArticles } from "@/lib/l-proof-server";

export const metadata: Metadata = {
  title: "L‑Proof‑AI Insights",
  description: "L‑Proof‑AI에서 승인·공개된 아티클을 최신순으로 살펴보는 HETRICH Hub 아카이브입니다.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "L‑Proof‑AI Insights — HETRICH",
    description: "공식 출처를 확인하고 사람이 승인한 L‑Proof‑AI 공개 발행물 아카이브",
    url: "/insights",
  },
};

export default async function InsightsPage() {
  const result = await fetchCachedLProofArticles({ limit: 20 });
  const items = result.ok ? result.data.items : [];
  const cursor = result.ok ? result.data.nextCursor : null;

  return (
    <main id="main" className="insights-hub">
      <header className="insights-hub-intro">
        <div>
          <p className="eyebrow">HETRICH Hub / Public archive</p>
          <h1>L‑Proof‑AI<br />Insights</h1>
        </div>
        <div className="insights-hub-description">
          <p>공식 출처를 먼저 확인하고, 사람이 승인한 AI 개발 브리핑입니다.</p>
          <p>HETRICH는 공개된 목록과 미리보기만 보여줍니다. 아티클 전문은 L‑Proof‑AI의 canonical 페이지에서 읽을 수 있습니다.</p>
        </div>
      </header>
      <section className="lproof-archive" aria-labelledby="archive-title">
        <div className="lproof-archive-heading">
          <h2 id="archive-title">All publications</h2>
          <span>{items.length > 0 ? `${items.length}${cursor ? "+" : ""} issues` : "Public feed"}</span>
        </div>
        <LProofArchive initialItems={items} initialCursor={cursor} initialError={!result.ok} />
      </section>
    </main>
  );
}
