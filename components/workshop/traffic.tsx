import type { CSSProperties, ReactNode } from "react";
import { boxFaces, project, round } from "./geometry";
import { BUS_STOP_X, BusShelter, CHIMNEY_TOP, ContainerHouse } from "./world";

/**
 * Everything that moves outside. Each mover is its own element animated only with transform and
 * opacity, so the browser composites them without repainting the scene underneath.
 */

type Axis = "x" | "y";
type BoxArgs = readonly [x: number, y: number, z: number, length: number, width: number, height: number];

function Part({ at, axis, kind }: { at: BoxArgs; axis: Axis; kind: string }) {
  const [x, y, z, length, width, height] = at;
  const faces = axis === "x" ? boxFaces(x, y, z, length, width, height, kind) : boxFaces(y, x, z, width, length, height, kind);
  return <>{faces.map((face) => <polygon key={face.className} className={face.className} points={face.points} />)}</>;
}

const ART_BOX = "-125 -105 250 165";

function Art({ children, color }: { children: ReactNode; color: string }) {
  return <svg className="mover-art" viewBox={ART_BOX} style={{ "--paint": color } as CSSProperties}>
    <ellipse className="mover-shadow" cx="0" cy="8" rx="76" ry="24" />
    <g transform="translate(-400 -270)">{children}</g>
  </svg>;
}

const Wheels = ({ axis, length }: { axis: Axis; length: number }) => <>
  <Part axis={axis} kind="v-tire" at={[-length / 2 + 0.2, -0.56, 0, 0.42, 1.12, 0.22]} />
  <Part axis={axis} kind="v-tire" at={[length / 2 - 0.62, -0.56, 0, 0.42, 1.12, 0.22]} />
</>;

const vehicles = {
  sedan: (axis: Axis, color: string) => <Art color={color}>
    <Wheels axis={axis} length={2.3} />
    <Part axis={axis} kind="v-paint" at={[-1.15, -0.54, 0.14, 2.3, 1.08, 0.42]} />
    <Part axis={axis} kind="v-glass" at={[-0.62, -0.46, 0.56, 1.14, 0.92, 0.36]} />
    <Part axis={axis} kind="v-paint" at={[-0.66, -0.48, 0.92, 1.22, 0.96, 0.06]} />
  </Art>,
  van: (axis: Axis, color: string) => <Art color={color}>
    <Wheels axis={axis} length={2.6} />
    <Part axis={axis} kind="v-paint" at={[-1.3, -0.56, 0.14, 2.6, 1.12, 0.62]} />
    <Part axis={axis} kind="v-glass" at={[-1.2, -0.5, 0.76, 2.34, 1, 0.34]} />
    <Part axis={axis} kind="v-paint" at={[-1.26, -0.54, 1.1, 2.4, 1.08, 0.1]} />
  </Art>,
  truck: (axis: Axis, color: string) => <Art color={color}>
    <Wheels axis={axis} length={3.3} />
    <Part axis={axis} kind="v-cargo" at={[-1.65, -0.58, 0.2, 2.3, 1.16, 1.26]} />
    <Part axis={axis} kind="v-paint" at={[0.72, -0.56, 0.16, 0.92, 1.12, 0.62]} />
    <Part axis={axis} kind="v-glass" at={[0.76, -0.5, 0.78, 0.8, 1, 0.38]} />
  </Art>,
  cityBus: (axis: Axis, color: string) => <Art color={color}>
    <Wheels axis={axis} length={5.4} />
    <Part axis={axis} kind="v-paint" at={[-2.7, -0.62, 0.14, 5.4, 1.24, 0.72]} />
    <Part axis={axis} kind="v-glass v-window" at={[-2.62, -0.56, 0.86, 5.24, 1.12, 0.48]} />
    <Part axis={axis} kind="v-paint" at={[-2.7, -0.62, 1.34, 5.4, 1.24, 0.14]} />
    <Part axis={axis} kind="v-stripe" at={[-2.72, -0.63, 0.5, 5.44, 1.26, 0.1]} />
    <Part axis={axis} kind="v-door" at={[-0.95, 0.62, 0.16, 0.7, 0.03, 1.16]} />
  </Art>,
  shuttle: (axis: Axis, color: string) => <Art color={color}>
    <Wheels axis={axis} length={3.8} />
    <Part axis={axis} kind="v-paint" at={[-1.9, -0.6, 0.14, 3.8, 1.2, 0.86]} />
    <Part axis={axis} kind="v-glass v-window" at={[-1.82, -0.54, 1, 3.64, 1.08, 0.42]} />
    <Part axis={axis} kind="v-paint" at={[-1.9, -0.6, 1.42, 3.8, 1.2, 0.2]} />
  </Art>,
};

function Person({ shade }: { shade: string }) {
  return <svg className="mover-art walker-step" viewBox="-14 -50 28 56">
    <ellipse className="walker-shadow" cx="2" cy="1" rx="10" ry="3.5" />
    <rect className={`walker-body walker-${shade}`} x="-7" y="-33" width="14" height="28" rx="6" />
    <path className="walker-leg" d="M-3 -7V0M3 -7V0" />
    <circle className="walker-head" cx="0" cy="-41" r="7" />
  </svg>;
}

function Cloud({ scale }: { scale: number }) {
  return <svg className="mover-art" viewBox="-110 -60 220 90" style={{ transform: `scale(${scale})` }}>
    <ellipse cx="0" cy="0" rx="74" ry="20" /><ellipse cx="-24" cy="-14" rx="34" ry="24" /><ellipse cx="22" cy="-20" rx="42" ry="30" />
  </svg>;
}

type Point = readonly [x: number, y: number];
const at = (x: number, y: number, z = 0): Point => project(x, y, z).map(round) as unknown as Point;

/** Route vars: start, optional stop and kerb, end. The keyframes in workshop.css read them. */
function route(from: Point, to: Point, stop?: Point, kerb?: Point) {
  return {
    "--ax": from[0], "--ay": from[1], "--bx": to[0], "--by": to[1],
    ...(stop && { "--sx": stop[0], "--sy": stop[1] }),
    ...(kerb && { "--kx": kerb[0], "--ky": kerb[1] }),
  } as CSSProperties;
}

/**
 * All traffic shares one cycle. Junction times (seconds into it): eastbound 5.7, 17.7, 27.7, 35.7;
 * westbound 4.8, bus about 30; north 11, south 22.4. Only the van shares the bus's lane, and it is
 * gone before the bus stops. Vehicles start past the hills or the screen edge, never mid-road.
 */
const CYCLE = 44;
const EAST_LANE = 14, WEST_LANE = 15.5, SOUTH_LANE = -3.85, NORTH_LANE = -2.35;
const FAR_WEST = -24, FAR_EAST = 44, FAR_NORTH = -2, FAR_SOUTH = 46;
const eastbound = route(at(FAR_WEST, EAST_LANE), at(FAR_EAST, EAST_LANE));
const westbound = route(at(FAR_EAST, WEST_LANE), at(FAR_WEST, WEST_LANE));
const southbound = route(at(SOUTH_LANE, FAR_NORTH), at(SOUTH_LANE, FAR_SOUTH));
const northbound = route(at(NORTH_LANE, FAR_SOUTH), at(NORTH_LANE, FAR_NORTH));

const passing = (style: CSSProperties, delay: number, art: ReactNode) => ({ style, delay, art });
const crossCars = [
  passing(northbound, 1, vehicles.truck("y", "#d8a23c")),
  passing(southbound, 28, vehicles.sedan("y", "#4d7aa6")),
];
const mainCars = [
  passing(eastbound, 0, vehicles.sedan("x", "#c8503c")),
  passing(eastbound, 14, vehicles.truck("x", "#9aa0a6")),
  passing(eastbound, 22, vehicles.shuttle("x", "#3f5fb0")),
  passing(eastbound, 32, vehicles.van("x", "#6f9270")),
  passing(westbound, 8, vehicles.van("x", "#e8e3d8")),
];

const busStop = at(BUS_STOP_X, WEST_LANE);
const busDoor = at(BUS_STOP_X - 0.6, 16.3);
const BUS_DELAY = CYCLE - 2;
/** Offsets that line the riders' keyframes up with the bus standing at the stop. */
const BOARD_DELAY = 22, ALIGHT_DELAY = 25.7;

const walker = (style: CSSProperties, shade: string, className: string, delay: number, duration: number) => ({ style, shade, className, delay, duration });
const farWalkers = [
  walker(route(at(-20, 12.6), at(40, 12.6)), "a", "mover-stroll", 0, 58),
  walker(route(at(40, 12.4), at(-20, 12.4)), "b", "mover-stroll", 19, 64),
];
const nearWalkers = [
  walker(route(at(-20, 17.2), at(40, 17.2)), "c", "mover-stroll", 34, 62),
  walker(route(at(-0.9, 12.3), at(-0.9, 17.1)), "b", "mover-cross", 6, 11),
  walker(route(at(-4.9, 11.6), at(-1.3, 11.6)), "c", "mover-cross", 3, 9),
];

const riders = [0, 1, 2].map((index) => ({
  index,
  shade: ["a", "c", "b"][index],
  queue: at(BUS_STOP_X - 0.6 + index * 0.55, 17),
  /** Morning riders walk in from off screen; night riders walk away until they are gone. */
  from: at(40 + index * 1.4, 17),
  away: at(FAR_WEST - index * 1.5, 17),
  stagger: index * 0.5,
}));

function Walker({ style, shade, className, delay, duration }: ReturnType<typeof walker>) {
  return <div className={`mover ${className}`} style={{ ...style, "--w": 28, animationDuration: `${duration}s`, animationDelay: `-${delay}s` } as CSSProperties}><Person shade={shade} /></div>;
}

function Passing({ style, delay, art }: ReturnType<typeof passing>) {
  return <div className="mover mover-pass" style={{ ...style, "--w": 250, animationDuration: `${CYCLE}s`, animationDelay: `-${delay}s` } as CSSProperties}>{art}</div>;
}

const drift = (from: Point, to: Point, seconds: number) => ({ ...route(from, to), "--w": 220, animationDuration: `${seconds}s` }) as CSSProperties;

export function TrafficSky() {
  return <div className="workshop-traffic" aria-hidden="true">
    <div className="mover mover-drift" style={drift(at(-34, -8, 12), at(-24, -14, 12), 140)}><Cloud scale={1.1} /></div>
    <div className="mover mover-drift" style={drift(at(10, -30, 12), at(22, -36, 12), 170)}><Cloud scale={0.8} /></div>
    <div className="mover mover-drift" style={drift(at(26, -18, 11), at(34, -24, 11), 190)}><Cloud scale={1.2} /></div>
    <div className="mover mover-smoke" style={{ ...route(CHIMNEY_TOP, CHIMNEY_TOP), "--w": 30 } as CSSProperties}>
      <svg className="mover-art" viewBox="-15 -60 30 62"><path className="smoke-line" d="M0 0q-9 -14 0 -27t2 -29" /></svg>
    </div>
  </div>;
}

/** The cross road passes behind the house, so its vehicles sit below it. */
export function TrafficBehind() {
  return <div className="workshop-traffic" aria-hidden="true">
    {crossCars.map((car) => <Passing key={car.delay} {...car} />)}
  </div>;
}

/** The main road runs in front of the house, so everything on it sits above it. */
export function TrafficInFront() {
  return <div className="workshop-traffic" aria-hidden="true">
    {farWalkers.map((person) => <Walker key={person.delay} {...person} />)}
    {mainCars.map((car) => <Passing key={car.delay} {...car} />)}
    <div className="mover mover-bus" style={{ ...route(at(FAR_EAST, WEST_LANE), at(FAR_WEST, WEST_LANE), busStop), "--w": 250, animationDuration: `${CYCLE}s`, animationDelay: `-${BUS_DELAY}s` } as CSSProperties}>{vehicles.cityBus("x", "#2f7a5e")}</div>
    {riders.map(({ index, shade, queue, from, away, stagger }) => <div key={index}>
      <div className="mover rider rider-board" style={{ ...route(from, busDoor, queue), "--w": 28, animationDuration: `${CYCLE}s`, animationDelay: `-${BOARD_DELAY - stagger}s` } as CSSProperties}><Person shade={shade} /></div>
      <div className="mover rider rider-alight" style={{ ...route(away, busDoor, queue), "--w": 28, animationDuration: `${CYCLE}s`, animationDelay: `-${ALIGHT_DELAY - stagger}s` } as CSSProperties}><Person shade={shade} /></div>
    </div>)}
    {nearWalkers.map((person) => <Walker key={person.delay} {...person} />)}
    {/* These stand nearer the camera than the pavement, so people pass behind them. */}
    <svg className="street-props" viewBox="-400 200 1200 900"><BusShelter /><ContainerHouse /></svg>
  </div>;
}
