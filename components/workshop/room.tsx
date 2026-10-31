import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import type { WorkshopEntry, WorkshopId, WorkshopIssue } from "@/lib/workshop";
import { boxFaces, isoCircle, planeFacingX, planeFacingY, planeFlat, project, round, toPath, toPoints, type Tile } from "./geometry";
import { Foreground } from "./world";

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

function Box({ at, kind }: { at: readonly [number, number, number, number, number, number]; kind?: string }) {
  return <>{boxFaces(...at, kind).map((face) => <polygon key={face.className} className={face.className} points={face.points} />)}</>;
}

function Poly({ tiles, className }: { tiles: readonly Tile[]; className: string }) {
  return <polygon className={className} points={toPoints(tiles)} />;
}

const anchors: Record<WorkshopId, { at: Tile; dot?: Tile; hit: number; zoom: number }> = {
  memo: { at: [2.5, 0, 4.7], hit: 60, zoom: 300 },
  book: { at: [7.9, 0.5, 5], hit: 60, zoom: 320 },
  paper: { at: [4.2, 1.2, 2.6], dot: [4.95, 0.72, 2.6], hit: 48, zoom: 230 },
  person: { at: [3, 3.4, 3.6], hit: 62, zoom: 330 },
  drawer: { at: [8, 2, 2], hit: 62, zoom: 340 },
  arcade: { at: [1.9, 8.3, 2.8], hit: 70, zoom: 340 },
  bowl: { at: [7, 6.6, 2], hit: 66, zoom: 260 },
  story: { at: [0.9, 5.2, 2.3], hit: 50, zoom: 270 },
};

export function focusTarget(id: WorkshopId) {
  const { at, zoom } = anchors[id];
  const [x, y] = project(...at);
  return { x, y, zoom };
}

const books = [[0.3, 1], [0.42, 1.25], [0.3, 1.1], [0.5, 1.3], [0.34, 1], [0.46, 1.2], [0.3, 1.05]] as const;
const SILVER = 3;
const bookStarts = books.reduce<number[]>((starts, [width], index) => [...starts, index ? starts[index - 1] + books[index - 1][0] + 0.05 : 6.25 + 0 * width], []);
const bookBox = (index: number) => [bookStarts[index], 0.12, 4.35, books[index][0], 0.75, books[index][1]] as const;

const wrapTitle = (title: string, limit = 11) => title.split(" ").reduce<string[]>((lines, word) => {
  const current = lines[lines.length - 1];
  if (`${current} ${word}`.trim().length > limit) return [...lines, word];
  lines[lines.length - 1] = `${current} ${word}`.trim();
  return lines;
}, [""]).filter(Boolean).slice(0, 2);

/** The drawer grows out of the cabinet front; sliding a full box would paint over the cabinet. */
function DrawerBody({ open }: { open: boolean }) {
  const faces = useRef<(SVGPolygonElement | null)[]>([]);
  const closed = boxFaces(6.75, 1.6, 1.95, 2.5, 0.04, 0.75, "k-dark");

  useEffect(() => {
    if (!open) return;
    const draw = (depth: number) => boxFaces(6.75, 1.6, 1.95, 2.5, depth, 0.75, "k-dark").forEach((face, index) => faces.current[index]?.setAttribute("points", face.points));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(1.2); return; }
    const start = performance.now() + 320;
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / 800));
      draw(0.04 + 1.16 * easeOutQuart(progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return <>{closed.map((face, index) => <polygon key={face.className} ref={(node) => { faces.current[index] = node; }} className={face.className} points={face.points} />)}</>;
}

function RoomShell({ children }: { children: ReactNode }) {
  return <g className="room-shell">{children}</g>;
}

type RoomProps = {
  entries: WorkshopEntry[];
  issue: WorkshopIssue | null;
  active: WorkshopId | null;
  awake: ReadonlySet<WorkshopId>;
  hovered: WorkshopId | null;
  minutes: number;
  onPick: (id: WorkshopId) => void;
  onHover: (id: WorkshopId | null) => void;
  /** Keyboard users can reach an object from the street; focusing one walks them inside. */
  onEnter: () => void;
};

export function Room({ entries, issue, active, awake, hovered, minutes, onPick, onHover, onEnter }: RoomProps) {
  const headCenter = project(3, 3.4, 3.3).map(round) as [number, number];
  const [headX, headY] = headCenter;
  const tableTop = project(7, 6.6, 1.7), tableFoot = project(7, 6.6, 0), table = isoCircle(1.5);
  const [bowlX, bowlY] = [tableTop[0], tableTop[1] - 7];
  const lamp = project(1.5, 0.7, 3.9), glow = project(2.2, 1.2, 2.4);
  const [globeX, globeY] = project(0.7, 4.78, 2.56).map(round);
  const hourAngle = ((minutes / 60) % 12) * 30, minuteAngle = (minutes % 60) * 6;

  const object = (id: WorkshopId, children: ReactNode) => {
    const { at, dot } = anchors[id];
    const [x, y] = project(...(dot ?? at)).map(round);
    const className = ["obj", active === id && "active", awake.has(id) && "awake visited", hovered === id && "hover"].filter(Boolean).join(" ");
    return <g className={className}>{children}<circle className="hot-ring" cx={x} cy={y} r="6" /><circle className="hot" cx={x} cy={y} r="4.5" /></g>;
  };

  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>, id: WorkshopId) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onPick(id);
  };

  const title = issue ? wrapTitle(issue.title) : [];

  return <>
    <defs>
      <radialGradient id="workshop-glow"><stop offset="0" stopColor="#ffd28a" stopOpacity=".9" /><stop offset=".55" stopColor="#ffb35c" stopOpacity=".28" /><stop offset="1" stopColor="#ffb35c" stopOpacity="0" /></radialGradient>
    </defs>
    <RoomShell>
      <Poly className="room-shadow" tiles={[[10, -0.3, -0.4], [11.6, 1.3, -0.4], [11.6, 11.6, -0.4], [1.3, 11.6, -0.4], [-0.3, 10, -0.4], [10, 10, -0.4]]} />
      <Box at={[-0.3, -0.3, -0.4, 10.3, 10.3, 0.4]} kind="k-floor" />
      <Poly className="wall-cap" tiles={[[-0.3, -0.3, 7], [10, -0.3, 7], [10, 0, 7], [0, 0, 7], [0, 10, 7], [-0.3, 10, 7]]} />
      <Poly className="wall-end-l" tiles={[[-0.3, 10, 7], [0, 10, 7], [0, 10, -0.4], [-0.3, 10, -0.4]]} />
      <Poly className="wall-end-r" tiles={[[10, -0.3, 7], [10, 0, 7], [10, 0, -0.4], [10, -0.3, -0.4]]} />
      <Poly className="wall-l" tiles={[[0, 0, 0], [0, 10, 0], [0, 10, 7], [0, 0, 7]]} />
      <Poly className="wall-r" tiles={[[0, 0, 0], [10, 0, 0], [10, 0, 7], [0, 0, 7]]} />
      <Poly className="sun" tiles={[[0.8, 3], [4.4, 3.9], [4.4, 8], [0.8, 7.1]]} />
      <Poly className="rug" tiles={[[1.6, 2.7], [5.2, 2.7], [5.2, 6.1], [1.6, 6.1]]} />
      <g transform={planeFacingX(0, 7.2, 6.2)}>
        <rect className="sky" width="84" height="70" />
        <circle className="star" cx="16" cy="14" r="1.1" /><circle className="star" cx="52" cy="24" r=".9" /><circle className="star" cx="66" cy="10" r="1.2" /><circle className="star" cx="32" cy="38" r=".8" />
        <rect className="frame" width="84" height="70" /><path className="frame" d="M42 0V70M0 35H84" />
      </g>
      <g transform={planeFacingY(4.85, 0, 5.75)}>
        <circle className="clock-face" cx="10" cy="10" r="11" />
        <line className="clock-hand" x1="10" y1="10" x2="10" y2="4.5" strokeWidth="1.5" transform={`rotate(${round(hourAngle)} 10 10)`} />
        <line className="clock-hand" x1="10" y1="10" x2="10" y2="2.2" strokeWidth=".9" transform={`rotate(${minuteAngle} 10 10)`} />
      </g>
    </RoomShell>
    {object("memo", <g transform={planeFacingY(1, 0, 5.9)}>
      <rect className="board" width="62" height="46" rx="1.5" />
      <rect className="note-paper note-a" x="5" y="5" width="15" height="15" /><rect className="note-paper note-b" x="24" y="5" width="15" height="15" /><rect className="note-paper note-c" x="43" y="5" width="15" height="15" />
      <rect className="new-note" x="5" y="26" width="53" height="14" />
    </g>)}
    <RoomShell>
      <Box at={[6, 0, 4.2, 3.7, 1, 0.15]} />
      {books.slice(0, SILVER).map((_, index) => <Box key={index} at={bookBox(index)} kind="k-dark" />)}
    </RoomShell>
    {object("book", <g className="silver"><Box at={bookBox(SILVER)} kind="k-silver" /></g>)}
    <RoomShell>
      {books.slice(SILVER + 1).map((_, index) => <Box key={index} at={bookBox(SILVER + 1 + index)} kind="k-dark" />)}
      <Box at={[0.95, 2.15, 0, 0.15, 0.15, 2.2]} kind="k-dark" /><Box at={[5.3, 2.15, 0, 0.15, 0.15, 2.2]} kind="k-dark" /><Box at={[5.3, 0.05, 0, 0.15, 0.15, 2.2]} kind="k-dark" />
      <Box at={[0.8, 0, 2.2, 4.8, 2.4, 0.2]} />
      <Box at={[1.3, 0.5, 2.4, 0.5, 0.5, 0.1]} kind="k-dark" /><Box at={[1.47, 0.67, 2.5, 0.14, 0.14, 1.3]} kind="k-dark" /><Box at={[1.15, 0.35, 3.8, 0.8, 0.8, 0.32]} kind="k-dark" />
    </RoomShell>
    {object("paper", <>
      <Box at={[3.3, 0.35, 2.4, 1.9, 1.7, 0.14]} kind="k-paper" />
      <g className="sheet">
        <Box at={[3.3, 0.35, 2.54, 1.9, 1.7, 0.03]} kind="k-paper" />
        <g transform={planeFlat(3.3, 0.35, 2.57)}>
          <text className="paper-text" x="3" y="6" fontSize="3">L-PROOF</text>
          {issue?.number !== null && issue && <text className="paper-text" x="3" y="18.5" fontSize="13">{issue.number}</text>}
          <text className="paper-text" x="3" y="24.5" fontSize="3.3">{title.map((line, index) => <tspan key={line} x="3" dy={index ? "4.2" : "0"}>{line}</tspan>)}</text>
        </g>
      </g>
    </>)}
    {object("story", <>
      <Box at={[0.15, 4.3, 0, 1.5, 1.9, 1.5]} />
      <Box at={[0.42, 4.5, 1.5, 0.56, 0.56, 0.08]} kind="k-dark" />
      <Box at={[0.65, 4.73, 1.58, 0.1, 0.1, 0.32]} kind="k-dark" />
      <clipPath id="workshop-globe"><circle cx={globeX} cy={globeY} r="24" /></clipPath>
      <circle className="globe" cx={globeX} cy={globeY} r="24" />
      <g clipPath="url(#workshop-globe)"><g className="globe-land">
        <ellipse cx={globeX - 26} cy={globeY - 7} rx="13" ry="8" /><ellipse cx={globeX - 6} cy={globeY + 9} rx="10" ry="7" />
        <ellipse cx={globeX + 12} cy={globeY - 10} rx="11" ry="6" /><ellipse cx={globeX + 24} cy={globeY + 8} rx="9" ry="7" />
      </g></g>
      <path className="globe-ring" d={`M${globeX - 19} ${globeY + 26}A30 30 0 0 0 ${globeX + 26} ${globeY - 19}`} />
      <Box at={[0.4, 5.32, 1.5, 0.92, 0.72, 0.16]} kind="k-paper" />
      <g className="story-page"><Box at={[0.4, 5.32, 1.66, 0.92, 0.72, 0.03]} kind="k-paper" /></g>
    </>)}
    {object("person", <>
      <Box at={[2.65, 3.2, 0, 0.7, 0.7, 1.15]} kind="k-dark" />
      <Box at={[2.5, 3.05, 1.15, 1, 0.7, 1.4]} />
      <path className="limb rest" strokeWidth="9" d={`M${toPath(2.6, 3.2, 2.3)}L${toPath(2.7, 2.3, 2.45)}`} />
      <path className="limb wave" strokeWidth="9" d={`M${toPath(3.4, 3.4, 2.3)}L${toPath(4.2, 3.6, 3.5)}`} />
      <circle className="person-skin" cx={headX} cy={headY} r="16" />
      <path className="hair" d={`M${headX - 16.5} ${headY - 1}A16.5 16.5 0 0 1 ${headX + 16.5} ${headY - 1}Q${headX} ${headY - 9} ${headX - 16.5} ${headY - 1}Z`} />
      <circle className="person-eye" cx={headX - 6} cy={headY + 1} r="1.8" /><circle className="person-eye" cx={headX + 6} cy={headY + 1} r="1.8" />
    </>)}
    {object("drawer", <>
      <Box at={[6.6, 0, 0, 2.8, 1.6, 2.8]} />
      <Box at={[6.75, 1.6, 0.15, 2.5, 0.04, 0.8]} kind="k-dark" /><Box at={[6.75, 1.6, 1.05, 2.5, 0.04, 0.8]} kind="k-dark" />
      <DrawerBody open={awake.has("drawer")} />
      <g className="tabs"><Box at={[7.1, 1.9, 2.7, 0.9, 0.1, 0.3]} kind="k-paper" /><Box at={[7.3, 2.2, 2.7, 0.9, 0.1, 0.3]} kind="k-paper" /><Box at={[7.5, 2.5, 2.7, 0.9, 0.1, 0.3]} kind="k-paper" /></g>
    </>)}
    {object("arcade", <>
      <Box at={[0.1, 7.4, 0, 1.8, 1.8, 4.2]} kind="k-dark" />
      <Box at={[1.9, 7.6, 1.75, 0.35, 1.4, 0.12]} />
      <g transform={planeFacingX(1.91, 9, 3.9)}>
        <rect className="screen" width="30" height="33" rx="1" />
        <g className="monster"><g className="monster-bob">
          <rect x="10" y="10" width="10" height="4" /><rect x="7" y="14" width="16" height="8" /><rect x="9" y="22" width="4" height="3" /><rect x="17" y="22" width="4" height="3" />
          <rect className="monster-eye" x="11" y="16" width="2" height="2" /><rect className="monster-eye" x="17" y="16" width="2" height="2" />
        </g></g>
      </g>
    </>)}
    {object("bowl", <>
      <rect className="f-r k-dark" x={round(tableFoot[0] - 5)} y={round(tableTop[1])} width="10" height={round(tableFoot[1] - tableTop[1])} />
      <ellipse className="f-l k-dark" cx={round(tableFoot[0])} cy={round(tableFoot[1])} rx="26" ry="14" />
      <ellipse className="f-l" cx={round(tableTop[0])} cy={round(tableTop[1] + 6)} rx={round(table.rx)} ry={round(table.ry)} />
      <ellipse className="f-t" cx={round(tableTop[0])} cy={round(tableTop[1])} rx={round(table.rx)} ry={round(table.ry)} />
      <ellipse className="bowl-rim" cx={round(bowlX)} cy={round(bowlY)} rx="27" ry="11" />
      <g className="rice-g"><ellipse className="rice" cx={round(bowlX)} cy={round(bowlY - 2)} rx="23" ry="19" /></g>
      <path className="bowl" d={`M${round(bowlX - 27)} ${round(bowlY)}A27 11 0 0 0 ${round(bowlX + 27)} ${round(bowlY)}C${round(bowlX + 25)} ${round(bowlY + 24)} ${round(bowlX + 12)} ${round(bowlY + 26)} ${round(bowlX)} ${round(bowlY + 26)}S${round(bowlX - 25)} ${round(bowlY + 24)} ${round(bowlX - 27)} ${round(bowlY)}Z`} />
      <path className="ink-line" strokeWidth="2.4" d={`M${round(bowlX + 40)} ${round(bowlY + 18)}L${round(bowlX + 64)} ${round(bowlY - 2)}M${round(bowlX + 46)} ${round(bowlY + 20)}L${round(bowlX + 70)} ${round(bowlY)}`} />
      <path className="steam" d={`M${round(bowlX - 8)} ${round(bowlY - 24)}q-7 -10 0 -19t0 -19`} /><path className="steam steam-late" d={`M${round(bowlX + 9)} ${round(bowlY - 26)}q7 -10 0 -19t0 -19`} />
    </>)}
    <Foreground />
    <ellipse className="glow" cx={round(glow[0])} cy={round(glow[1])} rx="210" ry="140" fill="url(#workshop-glow)" />
    <ellipse className="glow" cx={round(lamp[0])} cy={round(lamp[1] + 18)} rx="58" ry="40" fill="url(#workshop-glow)" />
    {hovered && !active && (() => {
      const [x, y] = project(...anchors[hovered].at).map(round);
      return <text className="object-tag" x={x} y={y - anchors[hovered].hit - 8} textAnchor="middle" fontSize="17">{entries.find((entry) => entry.id === hovered)?.title}</text>;
    })()}
    {/* Tap targets sit above the whole room, so furniture in front never swallows them. */}
    {entries.map(({ id, label }) => {
      const [x, y] = project(...anchors[id].at).map(round);
      return <circle key={id} className="hit" data-hit={id} tabIndex={0} role="button" aria-label={label} cx={x} cy={y} r={anchors[id].hit}
        onClick={(event) => { event.stopPropagation(); onPick(id); }} onKeyDown={(event) => onKeyDown(event, id)} onFocus={onEnter}
        onPointerEnter={() => onHover(id)} onPointerLeave={() => onHover(null)} />;
    })}
  </>;
}
