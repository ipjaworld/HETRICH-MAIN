import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, getPublishedInsights, type InsightBlock } from "@/lib/insights";
type Props = { params: Promise<{ slug: string }> };
const formatDate = (date: string) => new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" }).format(new Date(`${date}T00:00:00+09:00`));
export function generateStaticParams() { return getPublishedInsights().map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const post = getInsight(slug); if (!post) return {}; return { title: post.title, description: post.summary, alternates: { canonical: `/insights/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.summary, url: `/insights/${post.slug}`, publishedTime: `${post.date}T00:00:00+09:00`, tags: post.tags } }; }
function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "heading": return <h2>{block.text}</h2>;
    case "paragraph": return <p>{block.text}</p>;
    case "quote": return <blockquote>{block.text}</blockquote>;
    case "list": return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  }
}
export default async function InsightPage({ params }: Props) { const { slug } = await params; const posts = getPublishedInsights(); const index = posts.findIndex((post) => post.slug === slug); const post = posts[index]; if (!post) notFound(); const newer = posts[index - 1]; const older = posts[index + 1]; return <main id="main" className="article-page"><article><header className="article-header"><Link className="back-link" href="/insights">← Insights</Link><div className="article-meta"><span>{post.category}</span>{post.issue && <span>Issue {post.issue}</span>}<time dateTime={post.date}>{formatDate(post.date)}</time></div><h1>{post.title}</h1><p className="article-summary">{post.summary}</p></header><div className="article-body">{post.body.map((block, blockIndex) => <Block block={block} key={blockIndex} />)}</div>{post.sources && post.sources.length > 0 && <aside className="article-sources"><h2>Sources</h2><ul>{post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></aside>}<aside className="subscribe-callout"><p className="eyebrow">L‑Proof AI</p><h2>원문부터 확인한 AI 브리핑을 받아보세요.</h2><a className="button button-dark" href="https://l-proof-ai.xyz" target="_blank" rel="noreferrer">구독 안내 보기 <span aria-hidden="true">↗</span></a></aside><nav className="article-pager" aria-label="다른 글"><div>{older && <><span>Previous</span><Link href={`/insights/${older.slug}`}>{older.title}</Link></>}</div><div>{newer && <><span>Next</span><Link href={`/insights/${newer.slug}`}>{newer.title}</Link></>}</div></nav></article></main>; }
