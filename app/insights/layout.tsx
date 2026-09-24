import Link from "next/link";

export default function InsightsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="insights-shell">
      <div className="insights-subheader">
        <Link href="/insights" aria-label="L-Proof-AI Insights 홈">L‑PROOF‑AI</Link>
        <span>Verified AI briefing</span>
        <a href="https://l-proof-ai.xyz/articles" target="_blank" rel="noreferrer">Original archive <span aria-hidden="true">↗</span></a>
      </div>
      {children}
    </div>
  );
}
