"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { localMinutes, workshopPhase, workshopRefs, type WorkshopEntry, type WorkshopId, type WorkshopIssue, type WorkshopPhase } from "@/lib/workshop";
import { focusView, homeView, round, type View } from "./geometry";
import { focusTarget, Room } from "./room";
import { TrafficBehind, TrafficInFront, TrafficSky } from "./traffic";
import { DOOR_POINT, Exterior, LAND_TOP, World } from "./world";

const CAMERA_MS = 1050;
/** Scroll progress: the street holds, the door is entered, then the room holds until the track ends. */
const STREET_END = 0.12;
const ENTERED = 0.62;
const WIDE_ZOOM = 1.6;
const WIDE_FOCUS = 0.58;
const DOOR_ZOOM = 12;
const PHASES: readonly string[] = ["morning", "noon", "night"];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const viewBoxOf = (view: View) => view.map(round).join(" ");

const subscribeToClock = (notify: () => void) => {
  const timer = window.setInterval(notify, 30_000);
  return () => window.clearInterval(timer);
};
const readClock = () => localMinutes(new Date());

type Picked = { id: WorkshopId; arrived: boolean };

export function Workshop({ entries, issue, initialMinutes }: { entries: WorkshopEntry[]; issue: WorkshopIssue | null; initialMinutes: number }) {
  const track = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const world = useRef<SVGSVGElement>(null);
  const stage = useRef<SVGSVGElement>(null);
  const exterior = useRef<SVGSVGElement>(null);
  const doorLight = useRef<HTMLDivElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const view = useRef<View | null>(null);
  const frame = useRef(0);
  const lastHit = useRef<WorkshopId | null>(null);
  const activeId = useRef<WorkshopId | null>(null);
  const [active, setActive] = useState<WorkshopId | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [awake, setAwake] = useState<ReadonlySet<WorkshopId>>(() => new Set());
  const [hovered, setHovered] = useState<WorkshopId | null>(null);
  const [phaseOverride, setPhaseOverride] = useState<WorkshopPhase | null>(null);
  const minutes = useSyncExternalStore(subscribeToClock, readClock, () => initialMinutes);

  const size = useCallback(() => {
    const rect = section.current!.getBoundingClientRect();
    return [rect.width, rect.height] as const;
  }, []);

  const roomView = useCallback(() => homeView(...size(), document.querySelector(".site-header")?.getBoundingClientRect().height), [size]);

  const setView = useCallback((next: View) => {
    view.current = next;
    stage.current?.setAttribute("viewBox", viewBoxOf(next));
  }, []);

  const moveCamera = useCallback((to: View) => {
    cancelAnimationFrame(frame.current);
    const from = view.current;
    if (!from || prefersReducedMotion()) { setView(to); return; }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / CAMERA_MS), eased = easeInOutQuint(progress);
      // Zoom in log space so the push-in keeps a constant feel.
      const width = Math.exp(Math.log(from[2]) + (Math.log(to[2]) - Math.log(from[2])) * eased);
      const share = to[2] === from[2] ? eased : (width - from[2]) / (to[2] - from[2]);
      setView([from[0] + (to[0] - from[0]) * share, from[1] + (to[1] - from[1]) * share, width, from[3] + (to[3] - from[3]) * share]);
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [setView]);

  /** Scroll position where the door has been passed and the room is fully in view. */
  const insideTop = useCallback(() => {
    const node = track.current!, rect = node.getBoundingClientRect();
    const distance = rect.height - window.innerHeight;
    return Math.ceil(rect.top + window.scrollY + distance * ENTERED);
  }, []);

  const goInside = useCallback((smooth: boolean) => {
    const top = insideTop();
    if (window.scrollY < top) window.scrollTo({ top, behavior: smooth && !prefersReducedMotion() ? "smooth" : "instant" });
  }, [insideTop]);

  const pick = useCallback((id: WorkshopId, arrived = false) => {
    lastHit.current = id;
    activeId.current = id;
    setActive(id);
    setPicked({ id, arrived });
    setAwake((current) => new Set(current).add(id));
    goInside(false);
    moveCamera(focusView(...size(), focusTarget(id)));
    if (!arrived) window.setTimeout(() => backButton.current?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 500);
  }, [goInside, moveCamera, size]);

  const close = useCallback(() => {
    if (!activeId.current) return;
    activeId.current = null;
    setActive(null);
    moveCamera(roomView());
    stage.current?.querySelector<SVGCircleElement>(`[data-hit="${lastHit.current}"]`)?.focus({ preventScroll: true });
  }, [moveCamera, roomView]);

  useLayoutEffect(() => {
    const node = section.current!, trackNode = track.current!, root = document.documentElement;
    const reduced = prefersReducedMotion();
    let wide: View = [0, 0, 1, 1];
    let tick = 0;
    let wasInside: boolean | null = null;

    const render = () => {
      tick = 0;
      const rect = trackNode.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = reduced || distance <= 1 ? 1 : clamp(-rect.top / distance);
      const entering = clamp((progress - STREET_END) / (ENTERED - STREET_END));
      const eased = easeInOutCubic(entering);
      const inside = entering >= 1;
      // The door's light fills the screen and hides the swap from the street to the room.
      const brightening = clamp((entering - 0.55) / 0.25), clearing = clamp((entering - 0.8) / 0.2);
      const passedDoor = entering >= 0.8;
      const worldNode = world.current!, outside = exterior.current!, room = stage.current!;
      doorLight.current!.style.opacity = String(round(brightening * (1 - clearing)));

      const scene = inside ? "inside" : progress < STREET_END ? "outside" : "entering";
      if (node.dataset.scene !== scene) node.dataset.scene = scene;
      const door = entering > 0.1 ? "open" : "closed";
      if (node.dataset.door !== door) node.dataset.door = door;
      // Only layer transforms change per frame; a new viewBox would repaint the whole scene.
      if (inside !== wasInside) {
        wasInside = inside;
        worldNode.setAttribute("viewBox", viewBoxOf(inside ? roomView() : wide));
        if (inside) { worldNode.style.transform = "none"; room.style.transform = "none"; }
        room.style.opacity = inside ? "1" : "0";
        outside.style.visibility = inside ? "hidden" : "visible";
      }
      const streetScale = `scale(${(1 / WIDE_ZOOM + (1 - 1 / WIDE_ZOOM) * eased).toFixed(4)})`;
      node.querySelectorAll<HTMLElement>(".workshop-traffic-layer").forEach((layer) => { layer.style.transform = streetScale; });
      if (!inside) {
        worldNode.style.transform = `scale(${(1 + (WIDE_ZOOM - 1) * eased).toFixed(4)})`;
        room.style.opacity = passedDoor ? "1" : "0";
        room.style.transform = `scale(${(1.06 - 0.06 * clearing).toFixed(4)})`;
        outside.style.visibility = passedDoor ? "hidden" : "visible";
        outside.style.transform = `scale(${(1 + (DOOR_ZOOM - 1) * eased ** 2).toFixed(4)})`;
      }
      if (activeId.current && !inside) close();
    };
    const schedule = () => { if (!tick) tick = requestAnimationFrame(render); };

    const fit = () => {
      cancelAnimationFrame(frame.current);
      const home = roomView();
      const [x, y, width, height] = home;
      wide = [x + width / 2 - (width * WIDE_ZOOM) / 2, y + height * WIDE_FOCUS - height * WIDE_ZOOM * WIDE_FOCUS, width * WIDE_ZOOM, height * WIDE_ZOOM];
      const [sectionWidth, sectionHeight] = size();
      const unit = sectionWidth / width;
      node.style.setProperty("--u", `${unit}px`);
      node.style.setProperty("--ox", `${-x * unit}px`);
      node.style.setProperty("--oy", `${-y * unit}px`);
      // Vehicles come over the hills: the street layers end at the horizon, not at their own box.
      node.style.setProperty("--horizon", `${(LAND_TOP - y) * unit}px`);
      node.querySelectorAll<HTMLElement>(".workshop-traffic-layer").forEach((layer) => { layer.style.transformOrigin = `50% ${WIDE_FOCUS * 100}%`; });
      wasInside = null;
      exterior.current!.setAttribute("viewBox", viewBoxOf(wide));
      exterior.current!.style.transformOrigin = `${round(((DOOR_POINT[0] - wide[0]) / wide[2]) * sectionWidth)}px ${round(((DOOR_POINT[1] - wide[1]) / wide[3]) * sectionHeight)}px`;
      world.current!.style.transformOrigin = `50% ${WIDE_FOCUS * 100}%`;
      stage.current!.style.transformOrigin = `50% ${WIDE_FOCUS * 100}%`;
      setView(activeId.current ? focusView(...size(), focusTarget(activeId.current)) : home);
      trackNode.dataset.insideTop = String(insideTop());
      render();
    };

    trackNode.dataset.motion = reduced ? "still" : "scroll";
    fit();
    node.dataset.ready = "";

    let settled = false;
    const observer = new ResizeObserver(() => {
      if (settled) fit();
      settled = true;
    });
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    // The header is see-through over the sky and solid once the house has scrolled away.
    const hero = new IntersectionObserver(([item]) => {
      if (item.isIntersecting) delete root.dataset.pastHero;
      else root.dataset.pastHero = "";
    }, { rootMargin: "-90px 0px 0px 0px" });
    hero.observe(node);
    return () => {
      observer.disconnect();
      hero.disconnect();
      window.removeEventListener("scroll", schedule);
      delete root.dataset.pastHero;
      cancelAnimationFrame(frame.current);
      cancelAnimationFrame(tick);
    };
  }, [close, insideTop, roomView, setView, size]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("t");
    const arrival = workshopRefs[params.get("ref") ?? ""];
    const first = window.setTimeout(() => {
      if (requested && PHASES.includes(requested)) setPhaseOverride(requested as WorkshopPhase);
      if (arrival) pick(arrival, true);
    }, 0);
    return () => window.clearTimeout(first);
  }, [pick]);

  const entry = entries.find((item) => item.id === picked?.id);
  const links = entry?.id === "paper" && issue ? [{ label: "최신 호 읽기", href: issue.url }, ...entry.links.slice(1)] : entry?.links ?? [];
  const phase = phaseOverride ?? workshopPhase(minutes);

  return <div ref={track} className="workshop-track">
    <section ref={section} className="workshop" data-time={phase} data-focus={active ? "" : undefined} data-hovering={hovered ? "" : undefined} aria-labelledby="workshop-title">
      <svg ref={world} className="workshop-world" viewBox="40 -25 720 720" aria-hidden="true"><World phase={phase} minutes={minutes} /></svg>
      <div className="workshop-traffic-layer"><TrafficSky /></div>
      <div className="workshop-traffic-layer workshop-street"><TrafficBehind /></div>
      <svg ref={stage} className="workshop-stage" viewBox="40 -25 720 720" role="group" aria-label="이건하의 작업실" onClick={close}>
        <Room entries={entries} issue={issue} active={active} awake={awake} hovered={hovered} minutes={minutes} onPick={pick} onHover={setHovered} onEnter={() => goInside(true)} />
      </svg>
      <svg ref={exterior} className="workshop-exterior" viewBox="40 -25 720 720" aria-hidden="true"><Exterior /></svg>
      <div className="workshop-traffic-layer workshop-street"><TrafficInFront /></div>
      <div ref={doorLight} className="workshop-door-light" aria-hidden="true" />
      <div className="workshop-intro">
        <p className="workshop-brand">HETRICH</p>
        <h1 id="workshop-title">이건하</h1>
        <p className="workshop-role">제품을 직접 만들고 운영하는 개발자</p>
        <p className="workshop-lead">만든 것들을 이 방에 모아 두었습니다. 물건을 눌러 보세요.</p>
        {/* A pointer aid for wide screens; keyboard and screen reader users reach the same objects in the room. */}
        <ul className="workshop-index" aria-hidden="true">
          {entries.filter((item) => item.id !== "person").map((item) => <li key={item.id}>
            <button type="button" tabIndex={-1} className={awake.has(item.id) ? "seen" : undefined} onClick={() => pick(item.id)} onPointerEnter={() => setHovered(item.id)} onPointerLeave={() => setHovered(null)}>
              <span>{item.title}</span><small>{item.chip}</small>
            </button>
          </li>)}
        </ul>
      </div>
      <p className="workshop-cue" aria-hidden="true">스크롤해서 들어가기 <span>↓</span></p>
      <nav className="workshop-quick" aria-label="바로가기">
        <a className="button button-dark" href="#products"><span className="button-content"><span className="button-label">제품 둘러보기</span><span aria-hidden="true">↓</span></span></a>
        <Link href="/work">경력</Link>
        <a href="https://github.com/ipjaworld" target="_blank" rel="noreferrer">GitHub<span className="sr-only"> (새 탭)</span></a>
        <Link href="/contact">연락</Link>
      </nav>
      <aside className="workshop-panel" aria-live="polite">
        {entry && <>
          {picked?.arrived && <p className="workshop-note">이 서비스를 만든 이건하의 작업실입니다.</p>}
          <span className="workshop-chip">{entry.chip}</span>
          <h2>{entry.title}</h2>
          <p>{entry.line}</p>
          {entry.id === "paper" && issue && <p className="workshop-live">{issue.number === null ? "" : `${issue.number}호 · `}{issue.title} · {issue.dateLabel}</p>}
          <div className="workshop-links">{links.map(({ label, href }) => href.startsWith("/")
            ? <Link key={href} href={href}>{label}</Link>
            : <a key={href} href={href} target="_blank" rel="noreferrer">{label} <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>)}</div>
          <button ref={backButton} className="workshop-back" type="button" onClick={close}><span aria-hidden="true">←</span> 방으로</button>
        </>}
      </aside>
    </section>
  </div>;
}
