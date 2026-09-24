"use client";

import { useState } from "react";
import { LProofCard } from "@/components/l-proof-card";
import { fetchLProofArticles, type LProofArticle } from "@/lib/l-proof";

export function LProofArchive({ initialItems, initialCursor, initialError }: { initialItems: LProofArticle[]; initialCursor: string | null; initialError: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);

  async function loadMore() {
    setPending(true);
    setError(false);
    const result = await fetchLProofArticles({ limit: 20, cursor: items.length === 0 ? null : cursor });

    if (!result.ok) {
      setError(true);
      setPending(false);
      return;
    }

    setItems((current) => {
      const slugs = new Set(current.map((article) => article.slug));
      const additions = result.data.items.filter((article) => {
        if (slugs.has(article.slug)) return false;
        slugs.add(article.slug);
        return true;
      });
      return [...current, ...additions];
    });
    setCursor(result.data.nextCursor);
    setPending(false);
  }

  if (items.length === 0) {
    return (
      <div className="lproof-empty-state">
        <p>{error ? "발행물 목록을 불러오지 못했습니다." : "아직 공개된 발행물이 없습니다."}</p>
        {error && <button className="button button-dark" type="button" onClick={loadMore} disabled={pending}>{pending ? "다시 불러오는 중…" : "다시 시도"}</button>}
      </div>
    );
  }

  return (
    <>
      <div className="lproof-archive-grid">
        {items.map((article) => <LProofCard article={article} key={article.slug} />)}
      </div>
      {(cursor || error) && (
        <div className="lproof-pagination">
          {error && <p role="status">다음 발행물을 불러오지 못했습니다. 현재 목록은 그대로 유지됩니다.</p>}
          <button className="button button-dark" type="button" onClick={loadMore} disabled={pending}>{pending ? "불러오는 중…" : error ? "다시 시도" : "더 보기"}</button>
        </div>
      )}
    </>
  );
}
