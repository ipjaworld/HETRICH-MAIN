import Image from 'next/image';
import Link from 'next/link';
import { experiment } from '@/lib/product-stories';
export function ExperimentFeature() {
  return <section className="experiment-feature studio-section" aria-labelledby="experiment-title">
    <div className="studio-section-head"><div><p className="eyebrow">Interactive experiment / 비상업 개인 창작</p><h2 id="experiment-title">단서를 찾고,<br />마음을 읽는 선택.</h2></div><p>추리하고, 망설이고, 다시 도전하는 재미.<br />선택형 이야기로도 실험해봤습니다.</p></div>
    <div className="experiment-panel">
      <Link href="/products/silver-vow" className="experiment-image" aria-label="은빛 서약 설계 이야기 보기"><Image src={experiment.image} width={1440} height={900} sizes="(max-width: 700px) 90vw, 65vw" alt="은빛 서약 실제 플레이 화면. 말포이에게 쏟아지는 의심에 대응하는 세 가지 선택지" /></Link>
      <div className="experiment-copy"><p className="eyebrow">Visual novel · 공개 플레이</p><h3>{experiment.name}</h3><p>이야기의 분기와 선택지는 미리 설계했습니다. 그 안에서 단서를 좇을지, 상대를 먼저 살필지는 플레이어의 몫입니다. 사건만 잘 해결해도, 다정한 말만 골라도 충분하지 않습니다.</p><Link className="text-link" href="/products/silver-vow">설계 이야기 <span aria-hidden="true">→</span></Link><a className="text-link" href={experiment.service} target="_blank" rel="noreferrer">팬게임 플레이 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><p className="fan-notice">{experiment.notice}</p></div>
    </div>
  </section>;
}
