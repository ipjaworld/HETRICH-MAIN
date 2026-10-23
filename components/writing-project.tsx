import Link from "next/link";

export function WritingProject() {
  return (
    <section className="writing-project studio-section" id="writing" aria-labelledby="writing-title">
      <div className="writing-intro">
        <p className="eyebrow">Working notes / Writing project</p>
        <h2 id="writing-title">내가 겪은 시행착오가,<br />누군가의 출발점이 되도록.</h2>
        <p className="writing-purpose">제한된 시간과 비용 안에서 AI로 실제 일을 해내려고 했습니다. 어디서 판단이 어긋났고, 무엇을 확인한 뒤 방법을 바꿨는지. 그 경험을 다른 사람도 자기 환경에 가져가 볼 수 있는 글로 남기고 싶습니다.</p>
        <p>제품으로 반복되는 수고를 덜고, 기록으로 시작할 때의 막막함을 덜어주는 것. HETRICH가 만드는 경험을 나누고 싶은 방향입니다.</p>
        <aside className="writing-status" aria-label="집필 프로젝트 현재 상태">
          <p className="writing-status-label">경험 기록 단계 · 집필 잠시 보류</p>
          <p className="writing-book-name">짠내나는 AI 개발 방법론 <span>(가제)</span></p>
          <p>현재는 다른 작업을 우선하며 집필을 미뤄두었습니다. 경험 기록을 모아둔 단계로, 공개 원고와 출간 일정은 아직 없습니다.</p>
        </aside>
        <Link className="text-link" href="/about">만드는 사람과 방향 <span aria-hidden="true">→</span></Link>
      </div>
      <div className="writing-experiences">
        <p className="eyebrow">경험에서 남은 질문들</p>
        <article>
          <span className="writing-index">01 / 작업의 크기</span>
          <h3>한 페이지면, 한 번에 맡겨도 될까?</h3>
          <p>한 화면이라는 이유로 작게 본 작업이 있었습니다. 안에 담긴 조건과 분기를 충분히 이해하지 못해, 요구사항을 다시 정리하고 재구축했습니다.</p>
          <p className="writing-lesson">그 뒤에는 화면 수보다, 따로 떼어 확인할 수 있는 흐름을 기준으로 작업을 나누게 됐습니다.</p>
        </article>
        <article>
          <span className="writing-index">02 / 완료의 기준</span>
          <h3>결과가 빨리 나왔으면, 일이 끝난 걸까?</h3>
          <p>AI가 빠르게 만든 화면이 정상 경로에서는 잘 작동했습니다. 하지만 다른 진입 경로와 상태가 겹치는 상황을 확인하면서 남은 일을 발견했습니다.</p>
          <p className="writing-lesson">처음 결과물이 나온 시간과, 실제로 써도 되는지 확인하는 시간을 구분해 기록하려 합니다.</p>
        </article>
        <article>
          <span className="writing-index">03 / 함께 푸는 방법</span>
          <h3>혼자 고칠 수 있으면, 혼자 풀어야 할까?</h3>
          <p>AI와 더 고치면 해결될 것 같아 팀과의 대화를 늦춘 적도 있습니다. 함께 책임을 나누고 결정할 위치를 정리하자, 코드 안에서 붙잡고 있던 문제가 단순해졌습니다.</p>
          <p className="writing-lesson">어떻게 구현할지와 함께, 누구와 무엇을 먼저 정해야 하는지도 묻게 됐습니다.</p>
        </article>
        <p className="writing-source-note">집필을 위해 남긴 개인 경험을 요약했습니다. 회사와 서비스의 식별 정보는 제외했습니다.</p>
      </div>
    </section>
  );
}
