import type { WorkshopPhase } from "@/lib/workshop";
import { boxFaces, planeFacingX, planeFacingY, project, round, toPoints, type Tile } from "./geometry";

/** The land reaches past any viewport, so the house always stands somewhere instead of floating on a page. */
const FAR = 5000;
const HORIZON = 214;
export const LAND_TOP = HORIZON + 34;

function ridge(base: number, height: number, step: number, offset: number) {
  let path = `M${-FAR} ${FAR}L${-FAR} ${base}`;
  for (let x = -FAR, i = 0; x < FAR; x += step, i += 1) {
    const peak = base - height * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.7 + offset)));
    path += `Q${x + step / 2} ${round(peak)} ${x + step} ${base}`;
  }
  return `${path}L${FAR} ${FAR}Z`;
}

const farRidge = ridge(HORIZON, 120, 330, 0.4);
const nearRidge = ridge(HORIZON + 34, 74, 240, 1.9);

/** Nothing tall stands in the left column of wide screens, where the object index sits. */
const trees = [
  [40, 312, 0.5], [770, 262, 0.46], [905, 318, 0.66], [1120, 420, 0.86], [-690, 400, 0.9],
  [20, 420, 0.6], [1000, 540, 1.2], [705, 700, 1.05], [560, 830, 1.2],
] as const;
const IN_FRONT = 6;

function Tree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse className="tree-shadow" cx="4" cy="1" rx="38" ry="11" />
    <rect className="tree-trunk" x="-5" y="-40" width="10" height="41" rx="2" />
    <circle className="tree-leaf" cx="0" cy="-74" r="38" /><circle className="tree-leaf-light" cx="-13" cy="-88" r="19" />
  </g>;
}

/** The sun and moon follow the visitor's clock across the sky. */
function skyBody(phase: WorkshopPhase, minutes: number) {
  const hours = minutes / 60;
  const progress = phase === "night" ? ((hours + 5) % 24) / 11 : (hours - 6) / 13;
  const t = Math.min(0.97, Math.max(0.03, progress));
  // The arc stays right of the name, which sits in the left column of wide screens.
  return { x: round(150 + t * 620), y: round(150 - Math.sin(Math.PI * t) * 400) };
}

function Poly({ tiles, className }: { tiles: readonly Tile[]; className: string }) {
  return <polygon className={className} points={toPoints(tiles)} />;
}

/** Road layout in tiles: the main road runs along x, the cross road along y, meeting left of the house. */
export const ROAD = { mainNear: 13, mainFar: 16.4, crossNear: -4.8, crossFar: -1.4 } as const;
const { mainNear, mainFar, crossNear, crossFar } = ROAD;
const LONG = 90;

function Zebra({ along, from, to, at, width = 1 }: { along: "x" | "y"; from: number; to: number; at: number; width?: number }) {
  const stripes: number[] = [];
  for (let value = from + 0.1; value < to - 0.2; value += 0.56) stripes.push(value);
  return <>{stripes.map((value) => {
    const tiles: readonly Tile[] = along === "y"
      ? [[at, value], [at + width, value], [at + width, value + 0.3], [at, value + 0.3]]
      : [[value, at], [value + 0.3, at], [value + 0.3, at + width], [value, at + width]];
    return <Poly key={value} className="zebra" tiles={tiles} />;
  })}</>;
}

function Roads() {
  return <g clipPath="url(#workshop-land)">
    <Poly className="sidewalk" tiles={[[-LONG, mainNear - 0.8], [LONG, mainNear - 0.8], [LONG, mainFar + 0.8], [-LONG, mainFar + 0.8]]} />
    <Poly className="sidewalk" tiles={[[crossNear - 0.8, -LONG], [crossFar + 0.8, -LONG], [crossFar + 0.8, LONG], [crossNear - 0.8, LONG]]} />
    <Poly className="road" tiles={[[-LONG, mainNear], [LONG, mainNear], [LONG, mainFar], [-LONG, mainFar]]} />
    <Poly className="road" tiles={[[crossNear, -LONG], [crossFar, -LONG], [crossFar, LONG], [crossNear, LONG]]} />
    <Poly className="lane" tiles={[[crossFar + 2, 14.66], [LONG, 14.66], [LONG, 14.74], [crossFar + 2, 14.74]]} />
    <Poly className="lane" tiles={[[-LONG, 14.66], [crossNear - 2, 14.66], [crossNear - 2, 14.74], [-LONG, 14.74]]} />
    <Poly className="lane" tiles={[[-3.14, -LONG], [-3.06, -LONG], [-3.06, mainNear - 2], [-3.14, mainNear - 2]]} />
    <Poly className="lane" tiles={[[-3.14, mainFar + 2], [-3.06, mainFar + 2], [-3.06, LONG], [-3.14, LONG]]} />
    <Zebra along="y" from={mainNear} to={mainFar} at={crossFar + 0.5} />
    <Zebra along="y" from={mainNear} to={mainFar} at={crossNear - 1.5} />
    <Zebra along="x" from={crossNear} to={crossFar} at={mainNear - 1.5} />
    <Zebra along="x" from={crossNear} to={crossFar} at={mainFar + 0.5} />
  </g>;
}

function Box({ at, kind }: { at: readonly [number, number, number, number, number, number]; kind?: string }) {
  return <>{boxFaces(...at, kind).map((face) => <polygon key={face.className} className={face.className} points={face.points} />)}</>;
}

/** Where the morning riders queue and the night riders step off. */
export const BUS_STOP_X = 2.8;

export function BusShelter() {
  return <g>
    <Box at={[BUS_STOP_X - 1.6, 17.5, 0, 0.12, 0.5, 1.9]} kind="k-dark" />
    <Box at={[BUS_STOP_X + 1.5, 17.5, 0, 0.12, 0.5, 1.9]} kind="k-dark" />
    <Box at={[BUS_STOP_X - 1.8, 17.35, 1.9, 3.6, 0.8, 0.14]} />
    <Box at={[BUS_STOP_X + 2.2, 17.2, 0, 0.1, 0.1, 2.4]} kind="k-dark" />
    <Box at={[BUS_STOP_X + 2, 17.17, 2.4, 0.5, 0.16, 0.5]} kind="k-silver" />
  </g>;
}

/** A small converted container directly across the road from the workshop door. */
export function ContainerHouse() {
  const [x, y, length, depth, height] = [6.4, 18.3, 4.2, 2.4, 2.5];
  const front = y + depth;
  const ribs = Array.from({ length: 13 }, (_, index) => x + 0.16 + index * 0.33);
  return <g>
    <Poly className="room-shadow" tiles={[[x + length, y, 0], [x + length + 0.8, y + 0.8, 0], [x + length + 0.8, front + 0.8, 0], [x + 0.8, front + 0.8, 0], [x, front, 0], [x + length, front, 0]]} />
    <Box at={[x, y, 0, length, depth, height]} kind="k-container" />
    {ribs.map((rib) => <Poly key={rib} className="container-rib" tiles={[[rib, front, height - 0.1], [rib + 0.09, front, height - 0.1], [rib + 0.09, front, 0.1], [rib, front, 0.1]]} />)}
    <g transform={planeFacingY(x + 0.5, front, 1.85)}>
      <rect className="ext-window" width="22" height="18" /><rect className="ext-window-lit" width="22" height="18" /><rect className="ext-frame" width="22" height="18" />
    </g>
    <g transform={planeFacingY(x + 2.7, front, 2)}><rect className="ext-door-leaf" width="20" height="40" /><rect className="ext-frame" width="20" height="40" /></g>
    <Box at={[x - 0.15, y - 0.15, height, length + 0.3, depth + 0.3, 0.12]} kind="k-dark" />
  </g>;
}

export function World({ phase, minutes }: { phase: WorkshopPhase; minutes: number }) {
  const body = skyBody(phase, minutes);
  return <>
    <defs>
      <linearGradient id="workshop-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-720" x2="0" y2={HORIZON}>
        <stop className="sky-top" offset="0" /><stop className="sky-mid" offset=".62" /><stop className="sky-low" offset="1" />
      </linearGradient>
      <clipPath id="workshop-land"><rect x={-FAR} y={LAND_TOP} width={FAR * 2} height={FAR} /></clipPath>
    </defs>
    <rect fill="url(#workshop-sky)" x={-FAR} y={-FAR} width={FAR * 2} height={FAR * 2} />
    <circle className="sky-body-halo" cx={body.x} cy={body.y} r="66" />
    <circle className="sky-body" cx={body.x} cy={body.y} r="36" />
    <g className="stars">{[[-520, -300], [-240, -140], [-90, -380], [190, -250], [520, -330], [760, -130], [960, -290], [1180, -170]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.2" />)}</g>
    <path className="ridge-far" d={farRidge} />
    <path className="ridge-near" d={nearRidge} />
    <rect className="land" x={-FAR} y={LAND_TOP} width={FAR * 2} height={FAR} />
    <Roads />
    {trees.slice(0, IN_FRONT).map(([x, y, scale]) => <Tree key={x} x={x} y={y} scale={scale} />)}
  </>;
}

/** Drawn after the house, so the nearest trees stand in front of it. */
export function Foreground() {
  return <g className="world">
    {trees.slice(IN_FRONT).map(([x, y, scale]) => <Tree key={x} x={x} y={y} scale={scale} />)}
  </g>;
}

function WindowPane({ transform }: { transform: string }) {
  return <g transform={transform}>
    <rect className="ext-window" width="46" height="46" />
    <rect className="ext-window-lit" width="46" height="46" />
    <rect className="ext-frame" width="46" height="46" /><path className="ext-frame" d="M23 0V46M0 23H46" />
  </g>;
}

/** The closed house at the same footprint as the room, so entering it lands in the same place. */
export const DOOR_POINT = project(6.8, 10, 1.7);
export const CHIMNEY_TOP = project(8.65, 2.65, 11.8);

export function Exterior() {
  return <>
    <Poly className="ext-walk" tiles={[[6, 10], [7.6, 10], [7.6, mainNear - 0.8], [6, mainNear - 0.8]]} />
    <Poly className="room-shadow" tiles={[[10, -0.3, -0.4], [11.6, 1.3, -0.4], [11.6, 11.6, -0.4], [1.3, 11.6, -0.4], [-0.3, 10, -0.4], [10, 10, -0.4]]} />
    <Box at={[8.2, 2.2, 7, 0.9, 0.9, 4.6]} kind="k-dark" />
    <Poly className="ext-left" tiles={[[-0.3, 10, 7], [10, 10, 7], [10, 10, -0.4], [-0.3, 10, -0.4]]} />
    <Poly className="ext-right" tiles={[[10, -0.3, 7], [10, 10, 7], [10, 5, 11], [10, -0.3, 7]]} />
    <Poly className="ext-right" tiles={[[10, -0.3, 7], [10, 10, 7], [10, 10, -0.4], [10, -0.3, -0.4]]} />
    <WindowPane transform={planeFacingY(1, 10, 5.4)} />
    <WindowPane transform={planeFacingY(3.6, 10, 5.4)} />
    <WindowPane transform={planeFacingX(10, 8.2, 5.4)} />
    <WindowPane transform={planeFacingX(10, 4.2, 5.4)} />
    <g transform={planeFacingY(6, 10, 3.4)}>
      <rect className="ext-door-light" width="32" height="68" />
      <g className="ext-door"><rect className="ext-door-leaf" width="32" height="68" /><circle className="ext-door-knob" cx="26" cy="36" r="1.8" /></g>
      <rect className="ext-frame" width="32" height="68" />
    </g>
    <Poly className="ext-roof" tiles={[[-0.9, 10.7, 6.6], [10.7, 10.7, 6.6], [10.7, 5, 11.2], [-0.9, 5, 11.2]]} />
    <Poly className="ext-roof-edge" tiles={[[10.7, 10.7, 6.6], [10.7, 5, 11.2], [10.7, 5, 10.8], [10.7, 10.7, 6.2]]} />
    <Poly className="ext-roof-edge-dark" tiles={[[10.7, -0.7, 6.6], [10.7, 5, 11.2], [10.7, 5, 10.8], [10.7, -0.7, 6.2]]} />
    <Foreground />
  </>;
}
