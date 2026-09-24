import {
  formatEdition,
  formatProofLevel,
  formatPublishedAt,
  getSafeLProofArticleUrl,
  type LProofArticle,
} from "@/lib/l-proof";

export function LProofCard({ article, variant = "archive" }: { article: LProofArticle; variant?: "latest" | "archive" }) {
  const safeUrl = getSafeLProofArticleUrl(article.url);
  const body = (
    <>
      <div className="lproof-card-topline">
        <span>{formatEdition(article.editionNumber)}</span>
        <span>{formatProofLevel(article.proofLevel)}</span>
      </div>
      <div className="lproof-card-copy">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
      <div className="lproof-tags" aria-label="태그">
        {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <div className="lproof-card-footer">
        <time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time>
        <span>{safeUrl ? "L‑Proof‑AI 원문 ↗" : "원문 링크 확인 필요"}</span>
      </div>
    </>
  );

  return safeUrl ? (
    <a className={`lproof-card lproof-card-${variant}`} href={safeUrl} target="_blank" rel="noreferrer" aria-label={`${article.title} — L‑Proof‑AI 원문 열기`}>
      {body}
    </a>
  ) : (
    <article className={`lproof-card lproof-card-${variant} lproof-card-disabled`}>{body}</article>
  );
}
