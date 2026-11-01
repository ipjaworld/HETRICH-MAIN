import type { CSSProperties, ReactNode } from "react";
import { project, round } from "./geometry";
import { Person, type Look, type Pose } from "./people";
import { BUS_DOORS, Vehicle, type Heading, type Model } from "./vehicles";
import { BUS_STOP_X, CHIMNEY_TOP } from "./world";

/**
 * Everything that moves outside. Each mover is its own element animated only with transform and
 * opacity, so the browser composites them without repainting the scene underneath. One timetable
 * drives them all: traffic keeps right, and the junction runs in phases like a real signal, so
 * cars and people take turns instead of passing through each other.
 *
 *   t ≈ 0–7    main road flows
 *   t ≈ 9–15   cross road flows; people cross the main road beside it
 *   t ≈ 16–44  main road flows; the bus stands at the stop from 26 to 31.5
 */

function Cloud({ scale }: { scale: number }) {
  return <svg className="mover-art" viewBox="-110 -60 220 90" style={{ transform: `scale(${scale})` }}>
    <ellipse cx="0" cy="0" rx="74" ry="20" /><ellipse cx="-24" cy="-14" rx="34" ry="24" /><ellipse cx="22" cy="-20" rx="42" ry="30" />
  </svg>;
}

type Point = readonly [x: number, y: number];
const at = (x: number, y: number, z = 0): Point => project(x, y, z).map(round) as unknown as Point;

/** Route vars for the sky, which drifts on its own clock. */
function route(from: Point, to: Point) {
  return { "--ax": from[0], "--ay": from[1], "--bx": to[0], "--by": to[1] } as CSSProperties;
}

const CYCLE = 44;
const keyframes: string[] = [];
const percent = (value: number) => round(value * 100);
const spot = ([x, y]: Point) => `translate(calc(var(--ox) + ${x} * var(--u)),calc(var(--oy) + ${y} * var(--u)))`;

/** Runs on the shared clock: a clip whose first frame is at `start` plays then, whatever its period. */
function clock(name: string, start: number, period: number, timing?: string): CSSProperties {
  const phase = ((-start % period) + period) % period;
  return { animation: `${name} ${period}s ${timing ?? "linear"} ${round(-phase)}s infinite` };
}

function clip(name: string, frames: readonly (readonly [t: number, rule: string])[], period: number, timing?: string) {
  const start = frames[0][0];
  const body = frames.map(([t, rule]) => `${percent((t - start) / period)}%{${rule}}`).join("");
  keyframes.push(`@keyframes ${name}{${body}100%{${frames[frames.length - 1][1]}}}`);
  return clock(name, start, period, timing);
}

type Stop = { t: number; at: Point; hide?: boolean; ease?: string };
const place = (stop: Stop) => `transform:${spot(stop.at)};opacity:${stop.hide ? 0 : 1}${stop.ease ? `;animation-timing-function:${stop.ease}` : ""}`;
const travel = (name: string, stops: readonly Stop[], period = CYCLE) => clip(name, stops.map((stop) => [stop.t, place(stop)]), period);

/** Road layout: traffic keeps right, so eastbound takes the lane by the near kerb. */
const EAST_LANE = 15.5, WEST_LANE = 14, SOUTH_LANE = -3.85, NORTH_LANE = -2.35;
const FAR_WEST = -24, FAR_EAST = 44, FAR_NORTH = -2, FAR_SOUTH = 46;
const JUNCTION_X = -3, JUNCTION_Y = 14.7;
const DRIVE_SPEED = 3.7;

/** A vehicle passing straight through; `when` is the moment it reaches the junction. */
function passing(name: string, model: Model, heading: Heading, color: string, when: number) {
  const main = heading === "east" || heading === "west";
  const lane = { east: EAST_LANE, west: WEST_LANE, south: SOUTH_LANE, north: NORTH_LANE }[heading];
  const [from, to] = { east: [FAR_WEST, FAR_EAST], west: [FAR_EAST, FAR_WEST], south: [FAR_NORTH, FAR_SOUTH], north: [FAR_SOUTH, FAR_NORTH] }[heading];
  const point = (value: number) => (main ? at(value, lane) : at(lane, value));
  const start = when - Math.abs((main ? JUNCTION_X : JUNCTION_Y) - from) / DRIVE_SPEED;
  const style = travel(name, [{ t: start, at: point(from) }, { t: start + Math.abs(to - from) / DRIVE_SPEED, at: point(to) }]);
  return { name, style, art: <Vehicle model={model} heading={heading} color={color} /> };
}

const crossCars = [
  passing("truck-north", "truck", "north", "#d8a23c", 11),
  passing("sedan-south", "sedan", "south", "#4d7aa6", 13.5),
];
const farLane = [
  passing("van-west", "van", "west", "#e8e3d8", 5),
  passing("shuttle-west", "shuttle", "west", "#3f5fb0", 22),
];
const nearLane = [
  passing("sedan-east", "sedan", "east", "#c8503c", 2),
  passing("truck-east", "truck", "east", "#8f979e", 17),
  passing("van-east", "van", "east", "#6f9270", 39),
];

const BUS_ARRIVES = 26, BUS_LEAVES = 31.5;
const busBay = at(BUS_STOP_X, EAST_LANE);
const bus = travel("city-bus", [
  { t: 14, at: at(FAR_WEST, EAST_LANE), ease: "ease-out" },
  { t: BUS_ARRIVES, at: busBay },
  { t: BUS_LEAVES, at: busBay, ease: "ease-in" },
  { t: BUS_LEAVES + 12, at: at(FAR_EAST, EAST_LANE) },
]);
const busDoors = clip("bus-doors", [[BUS_ARRIVES + 0.2, "opacity:0"], [BUS_ARRIVES + 0.5, "opacity:1"], [BUS_ARRIVES + 4.5, "opacity:1"], [BUS_ARRIVES + 4.8, "opacity:0"]], CYCLE);

/** People keep to the right of the pavement, so opposite directions pass side by side. */
const WALK_SPEED = 1.14;
const PAVEMENT = { farEast: 12.7, farWest: 12.3, nearEast: 17.05, nearWest: 16.6 } as const;
const DOOR_Y = EAST_LANE + BUS_DOORS.side + 0.06;
const FRONT_DOOR = BUS_STOP_X + BUS_DOORS.front, REAR_DOOR = BUS_STOP_X + BUS_DOORS.rear;

const looks: Record<string, Look> = {
  student: { top: "#bf5b43", bottom: "#2e3647", hair: "#2a2522", style: "short", carry: "backpack", height: 0.94 },
  commuter: { top: "#4d628f", bottom: "#33353a", hair: "#4a3226", style: "long", coat: true },
  hoodie: { top: "#7d8c5e", bottom: "#3d4148", hair: "#d8b45a", style: "cap" },
  shopper: { top: "#e0ad4b", bottom: "#5a4a63", hair: "#2a2522", style: "bun", carry: "tote" },
  office: { top: "#ece6d8", bottom: "#4c5560", hair: "#3a3532", style: "short", height: 1.04 },
  grandma: { top: "#b06a7c", bottom: "#6f6a66", hair: "#c9c6c0", style: "bun", coat: true, height: 0.9 },
  nurse: { top: "#6fa8a3", bottom: "#6fa8a3", hair: "#2a2522", style: "long" },
  courier: { top: "#3c4a63", bottom: "#23262c", hair: "#c8503c", style: "cap", carry: "backpack" },
  teacher: { top: "#a9825f", bottom: "#3a3532", hair: "#6b6560", style: "short", coat: true, height: 1.03 },
};

type Leg = { t: number; x: number; y: number; hide?: boolean };
const facing = (from: Leg, to: Leg) => ({ away: to.x - from.x + (to.y - from.y) < 0, flip: to.x - from.x - (to.y - from.y) < 0 });
const moved = (from: Leg, to: Leg) => from.x !== to.x || from.y !== to.y;

/** A walker's route: a pose per distinct stretch, swapped on the same clock as the route itself. */
function walker(name: string, look: Look, legs: readonly Leg[], period = CYCLE) {
  const stretches: { t: number; pose: Omit<Pose, "style"> }[] = [];
  legs.slice(0, -1).forEach((leg, index) => {
    // Someone standing already faces the way they will set off; the last stretch keeps its pose.
    const setsOff = legs.findIndex((later, offset) => offset >= index && offset < legs.length - 1 && moved(later, legs[offset + 1]));
    const previous = stretches[stretches.length - 1]?.pose;
    const pose = setsOff >= 0 ? { walking: moved(leg, legs[index + 1]), ...facing(legs[setsOff], legs[setsOff + 1]) } : previous;
    stretches.push({ t: leg.t, pose });
  });
  const keys = [...new Set(stretches.map(({ pose }) => JSON.stringify(pose)))];
  const poses: Pose[] = keys.map((key, index) => ({
    ...(JSON.parse(key) as Pose),
    style: keys.length === 1 ? undefined : clip(`${name}-pose-${index}`, stretches.map(({ t, pose }) => [t, `opacity:${JSON.stringify(pose) === key ? 1 : 0}`]), period, "step-end"),
  }));
  const style = travel(name, legs.map((leg) => ({ t: leg.t, at: at(leg.x, leg.y), hide: leg.hide })), period);
  return { name, look, poses, style, step: round(legs[0].t % 0.58) + 0.1 };
}

/** A walker straight along the pavement, offset so they reach `x` at time `t`. */
function stroller(name: string, look: Look, y: number, direction: 1 | -1, x: number, t: number) {
  const [from, to] = direction === 1 ? [-20, 30] : [30, -20];
  const start = t - Math.abs(x - from) / WALK_SPEED;
  return walker(name, look, [{ t: start, x: from, y }, { t: start + 50 / WALK_SPEED, x: to, y }]);
}

const walkFrom = (x: number, y: number, toX: number, toY: number, arrive: number): Leg => ({ t: arrive - Math.hypot(toX - x, toY - y) / WALK_SPEED, x, y });

/** Waits at the kerb while the main road flows, then crosses with the cross road's green. */
const crosser = walker("crosser", looks.office, [
  walkFrom(30, PAVEMENT.nearWest, -0.9, PAVEMENT.nearWest, 7),
  { t: 7, x: -0.9, y: PAVEMENT.nearWest },
  { t: 8.6, x: -0.9, y: PAVEMENT.nearWest },
  { t: 12.4, x: -0.9, y: PAVEMENT.farWest },
  { t: 29.2, x: -20, y: PAVEMENT.farWest },
], CYCLE * 2);

const farWalkers = [
  stroller("far-east", looks.hoodie, PAVEMENT.farEast, 1, JUNCTION_X, 30),
  stroller("far-west", looks.commuter, PAVEMENT.farWest, -1, JUNCTION_X, 25),
];
const nearWalkers = [
  stroller("near-east", looks.shopper, PAVEMENT.nearEast, 1, JUNCTION_X, 34),
  stroller("near-west", looks.grandma, PAVEMENT.nearWest, -1, JUNCTION_X, 5),
  crosser,
];

/** Morning: three people gather at the stop and board by the front door, one at a time. */
const boarding = [
  walker("board-0", looks.student, [
    walkFrom(30, PAVEMENT.nearWest, FRONT_DOOR, PAVEMENT.nearWest, 21.6),
    { t: 21.6, x: FRONT_DOOR, y: PAVEMENT.nearWest },
    { t: 22, x: FRONT_DOOR - 0.2, y: 16.85 },
    { t: 27, x: FRONT_DOOR - 0.2, y: 16.85 },
    { t: 27.6, x: FRONT_DOOR, y: DOOR_Y },
    { t: 27.8, x: FRONT_DOOR, y: DOOR_Y, hide: true },
  ]),
  walker("board-1", looks.nurse, [
    walkFrom(-16, PAVEMENT.nearEast, FRONT_DOOR - 0.85, PAVEMENT.nearEast, 23.8),
    { t: 23.8, x: FRONT_DOOR - 0.85, y: PAVEMENT.nearEast },
    { t: 24, x: FRONT_DOOR - 0.85, y: 16.95 },
    { t: 27.7, x: FRONT_DOOR - 0.85, y: 16.95 },
    { t: 28.4, x: FRONT_DOOR - 0.2, y: 16.75 },
    { t: 28.9, x: FRONT_DOOR, y: DOOR_Y },
    { t: 29.1, x: FRONT_DOOR, y: DOOR_Y, hide: true },
  ]),
  walker("board-2", looks.teacher, [
    walkFrom(-16, PAVEMENT.nearEast, FRONT_DOOR - 1.5, PAVEMENT.nearEast, 25.8),
    { t: 25.8, x: FRONT_DOOR - 1.5, y: PAVEMENT.nearEast },
    { t: 26, x: FRONT_DOOR - 1.5, y: 16.95 },
    { t: 28.6, x: FRONT_DOOR - 1.5, y: 16.95 },
    { t: 29.7, x: FRONT_DOOR - 0.2, y: 16.75 },
    { t: 30.2, x: FRONT_DOOR, y: DOOR_Y },
    { t: 30.4, x: FRONT_DOOR, y: DOOR_Y, hide: true },
  ]),
];

/** Night: they step off by the rear door and part ways, keeping their distance as they go. */
function stepOff(name: string, look: Look, t: number, y: number, toX: number) {
  return walker(name, look, [
    { t, x: REAR_DOOR, y: DOOR_Y, hide: true },
    { t: t + 0.2, x: REAR_DOOR, y: DOOR_Y },
    { t: t + 0.8, x: REAR_DOOR, y },
    { t: t + 0.8 + Math.abs(toX - REAR_DOOR) / WALK_SPEED, x: toX, y },
  ]);
}
const alighting = [
  stepOff("alight-0", looks.teacher, 26.8, PAVEMENT.nearWest, -20),
  stepOff("alight-1", looks.nurse, 28, PAVEMENT.nearEast, 30),
  stepOff("alight-2", looks.courier, 29.4, PAVEMENT.nearWest, -20),
];

const Walking = ({ walker: { look, poses, style, step }, className = "" }: { walker: ReturnType<typeof walker>; className?: string }) =>
  <div className={`mover ${className}`} style={{ ...style, "--w": 28 } as CSSProperties}><Person look={look} poses={poses} step={step} /></div>;

function Passing({ style, art }: { style: CSSProperties; art: ReactNode }) {
  return <div className="mover" style={{ ...style, "--w": 250 } as CSSProperties}>{art}</div>;
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
    {crossCars.map((car) => <Passing key={car.name} {...car} />)}
  </div>;
}

/** The main road runs in front of the house, so everything on it sits above it, nearest last. */
export function TrafficInFront() {
  return <div className="workshop-traffic" aria-hidden="true">
    <style dangerouslySetInnerHTML={{ __html: keyframes.join("") }} />
    {farWalkers.map((person) => <Walking key={person.name} walker={person} />)}
    {farLane.map((car) => <Passing key={car.name} {...car} />)}
    {nearLane.map((car) => <Passing key={car.name} {...car} />)}
    <Passing style={bus} art={<Vehicle model="cityBus" heading="east" color="#2f7a5e" doors={busDoors} />} />
    {boarding.map((person) => <Walking key={person.name} walker={person} className="rider rider-board" />)}
    {alighting.map((person) => <Walking key={person.name} walker={person} className="rider rider-alight" />)}
    {nearWalkers.map((person) => <Walking key={person.name} walker={person} />)}
  </div>;
}
