import Link from "next/link";

export function WritingNotes() {
  return (
    <section className="studio-section" aria-label="개발 경험 노트">
      <div className="writing-notes" id="development-notes">
        <div className="writing-intro">
          <p className="eyebrow">Notes from practice</p>
          <h2>만들며 배운 것을,<br />다시 꺼내 쓸 수 있는 기록으로.</h2>
          <p className="writing-purpose">AI로 실제 서비스를 개발하며 마주한 시행착오와, 그때마다 방법을 바꾼 이유를 기록했습니다. 비슷한 문제를 만난 사람이 자신의 환경에 맞는 방법을 찾을 수 있도록, 경험과 판단의 근거를 함께 남깁니다.</p>
          <aside className="writing-focus" aria-label="개발 경험 노트의 주제">
            <p className="writing-focus-label">개발 경험 노트</p>
            <h3 className="writing-focus-title">AI와 일하며 쌓은 판단 기준</h3>
            <p>어디서 작업을 나눌지, 무엇으로 결과를 확인할지, 언제 팀과 함께 결정할지. 실제 개발에서 마주한 선택을 다룹니다.</p>
          </aside>
          <Link className="text-link" href="/about">만드는 사람과 방향 <span aria-hidden="true">→</span></Link>
        </div>
        <div className="writing-experiences">
          <p className="eyebrow">경험에서 남은 질문들</p>
          <article>
            <span className="writing-index">01 / 작업의 크기</span>
            <h3>한 페이지면, 한 번에 맡겨도 될까?</h3>
            <p>조건과 분기가 많은 화면의 요구사항을 다시 정리하고 재구축했습니다. 이 과정에서 화면 수보다 그 안의 흐름을 먼저 살펴야 한다는 점을 배웠습니다.</p>
            <p className="writing-lesson">따로 떼어 확인할 수 있는 단위를 기준으로 작업을 나눕니다.</p>
          </article>
          <article>
            <span className="writing-index">02 / 완료의 기준</span>
            <h3>결과가 빨리 나왔으면, 일이 끝난 걸까?</h3>
            <p>AI로 만든 화면을 여러 진입 경로와 상태가 겹치는 상황에서 확인했습니다. 정상 경로의 동작만으로는 드러나지 않던 문제를 발견했습니다.</p>
            <p className="writing-lesson">화면을 만드는 일과, 실제로 쓸 수 있는지 검증하는 일을 구분하게 됐습니다.</p>
          </article>
          <article>
            <span className="writing-index">03 / 함께 푸는 방법</span>
            <h3>혼자 고칠 수 있으면, 혼자 풀어야 할까?</h3>
            <p>코드 안에서 복잡하게 풀던 문제를 팀과 함께 다시 살폈습니다. 처리할 책임과 결정할 위치를 정리하자 해결 방법이 단순해졌습니다.</p>
            <p className="writing-lesson">어떻게 구현할지와 함께, 누구와 무엇을 먼저 정해야 하는지도 묻게 됐습니다.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
