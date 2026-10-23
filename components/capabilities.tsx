import Link from 'next/link';
const capabilities = [
  { name: '웹 서비스와 업무 화면', text: 'React·Next.js 기반 사용자 화면과 관리자 도구. 권한, 화면 상태, API 연동과 예외 처리를 함께 다룹니다.', evidence: '업무 화면 구현 경험', href: '/work#talkgate' },
  { name: '구매·결제와 서비스 연결', text: '구독·구매 흐름의 프론트엔드부터 인증·결제 API까지. 프로젝트에 필요한 역할과 연동 범위를 먼저 정합니다.', evidence: '인증·결제 연동 경험', href: '/work#ppallijwo' },
  { name: '작동하는 MVP와 운영 기반', text: '작은 제품의 기획·구현·검증과 배포 환경 구성. AI를 활용한 입력·브리핑도 실제 사용할 흐름으로 연결합니다.', evidence: '관리자 도구·배포 환경 구현 경험', href: '/work#e-parts' },
];
export function Capabilities() {
  return <section className="capabilities studio-section" id="capabilities" aria-labelledby="capabilities-title"><div className="studio-section-head"><div><p className="eyebrow">Capabilities / 함께 만들 수 있는 것</p><h2 id="capabilities-title">필요한 역할부터,<br />구체적으로 이야기합니다.</h2></div><Link className="button button-dark" href="/contact">개발 의뢰하기 <span aria-hidden="true">↗</span></Link></div><div className="capability-grid">{capabilities.map((item, i) => <div className="capability" key={item.name}><span className="capability-number">0{i + 1}</span><h3>{item.name}</h3><p>{item.text}</p><Link className="text-link" href={item.href}>{item.evidence} <span aria-hidden="true">→</span></Link></div>)}</div></section>;
}
