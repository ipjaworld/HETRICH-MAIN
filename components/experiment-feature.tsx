import Image from 'next/image';
import Link from 'next/link';
import { experiment } from '@/lib/product-stories';
export function ExperimentFeature() {
  return <section className="experiment-feature studio-section" aria-labelledby="experiment-title">
    <div className="studio-section-head"><div><p className="eyebrow">Interactive experiment / 비상업 개인 창작</p><h2 id="experiment-title">자유로운 입력보다,<br />의미 있는 선택.</h2></div><p>이야기를 읽고, 선택하고, 다시 이해하는<br />비주얼 노벨을 만들었습니다.</p></div>
    <div className="experiment-panel">
      <Link href="/products/silver-vow" className="experiment-image" aria-label="은빛 서약 설계 이야기 보기"><Image src={experiment.image} width={1440} height={900} sizes="(max-width: 700px) 90vw, 65vw" alt="은빛 서약 실제 플레이 화면. 말포이에게 쏟아지는 의심에 대응하는 세 가지 선택지" /></Link>
      <div className="experiment-copy"><p className="eyebrow">Visual novel · 공개 플레이</p><h3>{experiment.name}</h3><p>사건의 단서를 찾는 일과 한 사람의 신뢰를 얻는 일은 다릅니다. 제한된 선택 안에서 둘의 균형을 탐색합니다.</p><Link className="text-link" href="/products/silver-vow">설계 이야기 <span aria-hidden="true">→</span></Link><a className="text-link" href={experiment.service} target="_blank" rel="noreferrer">팬게임 플레이 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><p className="fan-notice">{experiment.notice}</p></div>
    </div>
  </section>;
}
