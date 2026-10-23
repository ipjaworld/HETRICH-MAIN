import type { Metadata } from "next";
import { LProofArchive } from "@/components/l-proof-archive";
import { fetchCachedLProofArticles } from "@/lib/l-proof-server";

export const metadata: Metadata = {
  title: "L‑Proof‑AI Insights",
  description: "AI 소식의 근거와 개발에 미치는 영향을 함께 읽는 L‑Proof AI 브리핑 아카이브입니다.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "L‑Proof‑AI Insights — HETRICH",
    description: "공식 출처와 편집자의 해석을 함께 전하는 AI 개발 브리핑",
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
          <p className="eyebrow">L‑Proof AI / Public archive</p>
          <h1>L‑Proof‑AI<br />Insights</h1>
        </div>
        <div className="insights-hub-description">
          <p>AI 소식이 개발에 어떤 변화를 만드는지, 공식 출처와 편집자의 해석을 함께 전합니다.</p>
          <p>HETRICH가 운영하는 L‑Proof AI의 발행물입니다. 제목을 선택하면 원문으로 이동합니다.</p>
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
