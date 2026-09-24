"use client";

export default function InsightsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="insights-hub">
      <div className="lproof-empty-state lproof-route-error">
        <p>Insights 화면을 여는 중 문제가 생겼습니다.</p>
        <button className="button button-dark" type="button" onClick={reset}>다시 시도</button>
      </div>
    </main>
  );
}
