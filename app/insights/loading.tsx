export default function InsightsLoading() {
  return (
    <main id="main" className="insights-hub" aria-busy="true">
      <header className="insights-hub-intro">
        <div><p className="eyebrow">HETRICH Hub / Public archive</p><h1>L‑Proof‑AI<br />Insights</h1></div>
        <div className="insights-hub-description"><p>공개 발행물을 불러오고 있습니다.</p></div>
      </header>
      <section className="lproof-archive" aria-label="발행물 불러오는 중">
        <div className="lproof-archive-grid" aria-hidden="true">{[0, 1, 2].map((item) => <div className="lproof-card lproof-skeleton" key={item}><span /><strong /><span /><span /></div>)}</div>
      </section>
    </main>
  );
}
