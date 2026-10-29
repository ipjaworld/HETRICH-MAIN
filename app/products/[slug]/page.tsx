import { socialShareImage } from "@/lib/site-metadata";
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { stories, experiment } from '@/lib/product-stories';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return [...products.map(p => ({ slug: p.id })), { slug: experiment.id }]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(p => p.id === slug);
  const name = slug === experiment.id ? experiment.name : product?.name;
  if (!name) notFound();
  const description = slug === experiment.id ? '제한된 선택으로 추리와 관계 형성을 함께 탐색한 비상업 팬게임의 설계 기록.' : product!.homeSummary;
  return { title: name, description, alternates: { canonical: `/products/${slug}` }, openGraph: { images: [socialShareImage], title: `${name} — HETRICH`, description, url: `/products/${slug}` } };
}

export default async function ProductStory({ params }: Props) {
  const { slug } = await params;
  if (slug === experiment.id) return <SilverVow />;
  const product = products.find(p => p.id === slug);
  if (!product) notFound();
  const story = stories[product.id];
  return <main id="main" className={`case-page case-${product.theme}`} tabIndex={-1}>
    <header className="case-hero"><Link className="text-link case-back" href="/products">← 모든 제품</Link><p className="eyebrow">{product.category} / {product.stage}</p><h1>{product.name}</h1><p className="case-lead">{product.lead}</p><div className="studio-hero-actions"><a className="button button-dark" href={product.service} target="_blank" rel="noreferrer"><span className="button-label">{product.serviceLabel}</span><span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><a className="text-link" href={product.github} target="_blank" rel="noreferrer">GitHub ↗<span className="sr-only"> (새 탭)</span></a></div></header>
    <div className="case-layout"><figure className="case-screen"><a href={story.image} target="_blank" rel="noreferrer" aria-label={`${product.name} 실제 화면 크게 보기 (새 탭)`}><Image src={story.image} width={story.width} height={story.height} sizes="(max-width: 700px) 90vw, 55vw" alt={story.alt} /></a><figcaption>{story.caption} · 이미지를 누르면 크게 볼 수 있습니다.</figcaption></figure><div className="case-narrative"><section><p className="eyebrow">01 / 출발점</p><h2>{story.question}</h2><p>{story.decision}</p><p>{story.choice}</p></section><section><p className="eyebrow">02 / 구현한 경험</p><ul>{story.implemented.map(item => <li key={item}>{item}</li>)}</ul><p className="case-boundary">{story.boundary}</p></section><section><p className="eyebrow">03 / 설계에서 중요하게 본 것</p><p>{story.next}</p></section></div></div>
    {product.id === 'calories' && <section className="case-extra"><h2>반 공기는 반 공기로.</h2><p>2026년 10월의 사용자 피드백에서 분수 입력과 계산 내역을 확인하기 어렵다는 점을 발견했습니다. 1/2·0.5·‘반’의 해석을 보완하고, 음식별 양과 칼로리, 기본량을 적용한 이유를 응답에 담았습니다.</p><a className="text-link" href="/products/calories-record.png" target="_blank" rel="noreferrer">기존 기록·수정 실제 화면 ↗<span className="sr-only"> (새 탭)</span></a></section>}
    {product.id === 'rebemon' && <RebemonDetails />}
    <CaseClosing />
  </main>;
}

function CaseClosing() { return <section className="case-closing"><p>비슷한 문제를 풀고 있다면</p><Link className="text-link" href="/contact">함께 만들고 싶은 일 이야기하기 <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/products">다른 제품 보기 <span aria-hidden="true">→</span></Link></section>; }

function RebemonDetails() {
  return <section className="case-extra rebemon-details" aria-labelledby="rebemon-details-title">
    <p className="eyebrow">04 / 검색 다음의 선택</p>
    <h2 id="rebemon-details-title">찾은 정보를, 내 상황에 맞춰 비교하기.</h2>
    <div className="case-gallery">
      <figure><a href="/products/rebemon-event.webp" target="_blank" rel="noreferrer" aria-label="레범몬 이벤트 조회 실제 화면 크게 보기 (새 탭)"><Image src="/products/rebemon-event.webp" width={1270} height={1000} sizes="(max-width: 700px) 90vw, 45vw" alt="레범몬 이벤트 조회. 엘나스 산맥의 몬스터와 드롭 알파벳을 함께 표시하고 미확인 정보에 물음표를 붙인 화면" /></a><figcaption>이벤트 자료 조회 · 2026.10.23 촬영</figcaption><h3>자료의 빈칸도 함께 보여주기.</h3><p>지역별 또는 필요한 알파벳별로 드롭 몬스터를 찾습니다. 제보로 보완한 정보와 아직 확인되지 않은 정보를 구분해 표시했습니다.</p></figure>
      <figure><a href="/products/rebemon-equipment.webp" target="_blank" rel="noreferrer" aria-label="레범몬 장비 시뮬레이터 실제 화면 크게 보기 (새 탭)"><Image src="/products/rebemon-equipment.webp" width={1270} height={1000} sizes="(max-width: 700px) 90vw, 45vw" alt="레범몬 장비 시뮬레이터. 마법사 스탯 자동배분 후 자쿰의 투구를 선택하고 추가 지능 5를 적용한 예시" /></a><figcaption>마법사·장비·추가 옵션 입력 예시 · 2026.10.23 촬영</figcaption><h3>장비를 바꾸기 전에 살펴보기.</h3><p>직업과 장비, 추가 옵션을 바꾸며 스탯 변화를 살펴볼 수 있습니다. 프리셋은 브라우저에 저장하도록 구현해 다시 비교할 구성을 남길 수 있습니다.</p></figure>
    </div>
    <div className="case-implementation"><p className="eyebrow">구현과 운영</p><h3>찾기 쉬운 화면 뒤에, 데이터를 정리하는 일.</h3><p>Next.js·React·TypeScript·Tailwind CSS로 화면을 만들고, 몬스터·아이템·지역 정보를 JSON으로 구조화했습니다. Python 스크립트로 수집·병합·검증 작업을 나누고, 검색과 필터는 브라우저에서 처리합니다.</p><p>운영 중 들어온 제보를 데이터에 반영하고, 이벤트 정보의 확인 여부를 구분하는 방식을 보완했습니다. Vercel에 공개했으며 검색 범위와 장비 프리셋은 브라우저 저장소를 사용합니다.</p><a className="text-link" href="https://github.com/ipjaworld/LeBemMon-FE" target="_blank" rel="noreferrer">공개 코드와 문서 보기 ↗<span className="sr-only"> (새 탭)</span></a></div>
  </section>;
}

function SilverVow() {
  return <main id="main" className="case-page case-game" tabIndex={-1}><header className="case-hero"><Link className="text-link case-back" href="/products">← 모든 제품과 실험</Link><p className="eyebrow">Interactive experiment / 비상업 개인 창작</p><h1>악역영애 말포이<br /><em>은빛 서약</em></h1><p className="case-lead">단서를 좇고 마음을 읽으며, 선택의 결과를 다시 살펴보는 비주얼 노벨.</p><p className="fan-notice">{experiment.notice}</p><div className="studio-hero-actions"><a className="button button-dark" href={experiment.service} target="_blank" rel="noreferrer"><span className="button-label">팬게임 플레이</span><span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a><a className="text-link" href={experiment.github} target="_blank" rel="noreferrer">공개 코드 ↗<span className="sr-only"> (새 탭)</span></a></div></header>
    <figure className="game-screen"><Image src={experiment.image} width={1440} height={900} sizes="90vw" alt="은빛 서약 실제 첫 선택 장면. 의심 앞에서 사실을 확인하거나, 설명할 시간을 주거나, 장난인지 묻는 선택지" preload /><figcaption>공개 서비스 직접 플레이 · 첫 장의 실제 선택 화면 · 2026.10.23</figcaption></figure>
    <div className="game-story"><section><p className="eyebrow">01 / 왜 선택형 서사인가</p><h2>입력은 자유로운데,<br />결과를 통제하기 어려웠습니다.</h2><p>AI 자유 서사에서 의도와 다른 반응을 받거나, 이야기의 방향을 바꾸려고 맥락을 반복해서 수정하던 경험에서 출발했습니다. 이번에는 분기와 선택지를 미리 설계했습니다. 플레이어는 주어진 상황과 인물의 반응을 읽고, 어떤 선택을 해볼지에 집중합니다.</p></section>
    <section><p className="eyebrow">02 / 두 가지 목표</p><h2>진실을 찾는 일과<br />마음을 얻는 일 사이.</h2><p>말포이를 둘러싼 의심을 풀고 서약의 정체를 알아가는 과정에서, 인물과의 신뢰도 함께 쌓아야 합니다. 첫 장의 성공 결말은 신뢰와 단서 조건, 마지막 선택을 함께 확인합니다. 사건의 단서와 인물의 반응을 함께 살피는 선택이 결말로 이어집니다.</p></section>
    <section className="choice-study"><p className="eyebrow">03 / 실제 선택을 들여다보면</p><h2>의도와 전달되는 의미는 다릅니다.</h2><blockquote>“네 장난이면 지금 끝내는 편이 좋겠어.”</blockquote><p>플레이어는 사실을 확인하려 했을 수 있습니다. 하지만 말포이는 자신을 이미 의심한다고 받아들입니다. 실제 대사는 “너도 그렇게 생각해? 그렇다면 끝까지 보고 판단해.”로 이어집니다.</p><p>실패 가능성이 생겨도 이야기가 바로 멈추지는 않습니다. 뒤의 반응과 결말을 읽고 다른 선택을 시도할 수 있습니다.</p></section>
    <section><p className="eyebrow">04 / 플레이 경험</p><h2>다시 읽고, 다시 선택할 수 있도록.</h2><ul className="game-features"><li>세 장 · 15개 장면 · 9종 엔딩</li><li>자동 저장·이어하기, 수동 저장 3개, 빠른 저장·로드</li><li>백로그, 자동 진행, 읽은 대사 스킵</li><li>표시 속도·음량 설정과 키보드 조작</li></ul><p className="case-boundary"><strong>다음 장으로 가는 조건</strong><br />각 장의 세 엔딩을 모두 모아야 다음 장이 열립니다.</p></section>
    </div><CaseClosing /></main>;
}
