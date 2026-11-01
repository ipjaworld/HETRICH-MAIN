import type { CSSProperties } from "react";
import { project, round, toPoints, type Tile } from "./geometry";

/**
 * Vehicles are drawn in their own frame: f runs forward, s to the driver's right, z up. Each one is
 * then laid onto the road for its heading, so a nose always leads and only the faces the camera can
 * see are drawn.
 */

export type Heading = "east" | "west" | "south" | "north";
type Polygon = { className: string; points: string };
/** A point of a side profile; `kind` styles the surface running from it to the next point. */
type Profile = readonly (readonly [f: number, z: number, kind?: string])[];

const FORWARD = { east: [1, 0], west: [-1, 0], south: [0, 1], north: [0, -1] } as const;

function sketch(heading: Heading) {
  const [fx, fy] = FORWARD[heading];
  const tile = (f: number, s: number, z: number): Tile => [f * fx - s * fy, f * fy + s * fx, z];
  /** Which end faces the camera (1 the nose, -1 the tail) and which flank (1 the driver's right). */
  const shownEnd = fx + fy, shownSide = fx - fy;
  const endShade = fx ? "f-r" : "f-l", sideShade = fx ? "f-l" : "f-r";
  const parts: Polygon[] = [];
  const add = (tiles: readonly Tile[], className: string) => parts.push({ className, points: toPoints(tiles) });

  const onSide = (points: readonly (readonly [number, number])[], half: number, kind: string) =>
    add(points.map(([f, z]) => tile(f, shownSide * (half + 0.004), z)), `${sideShade} ${kind}`);

  const disc = (f: number, z: number, radius: number, s: number, className: string) =>
    add(Array.from({ length: 14 }, (_, index) => {
      const angle = (index / 14) * Math.PI * 2;
      return tile(f + Math.cos(angle) * radius, s, z + Math.sin(angle) * radius);
    }), className);

  return {
    parts,
    shownSide,
    shadow(length: number, half: number) {
      const offset = 0.22;
      add([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([f, s]) => {
        const [x, y] = tile((f * length) / 2, s * half, 0);
        return [x + offset, y + offset, 0];
      }), "mover-shadow");
    },
    beam(f: number, half: number) {
      add([tile(f, -half, 0), tile(f, half, 0), tile(f + 3.2, half + 0.6, 0), tile(f + 3.2, -half - 0.6, 0)], "v-beam");
    },
    /** A body of constant width, extruded from its side profile, drawn back to front. */
    hull(profile: Profile, half: number, kind = "") {
      profile.slice(0, -1).map(([f, z, surface], index) => {
        const [nextF, nextZ] = profile[index + 1];
        const normalF = nextZ - z, normalZ = f - nextF;
        return {
          shown: normalF * shownEnd + normalZ > 0,
          depth: ((f + nextF) / 2) * shownEnd + (z + nextZ) / 2,
          shade: normalZ >= Math.abs(normalF) ? "f-t" : endShade,
          tiles: [tile(f, -half, z), tile(f, half, z), tile(nextF, half, nextZ), tile(nextF, -half, nextZ)],
          surface: surface ?? kind,
        };
      }).filter((strip) => strip.shown).sort((a, b) => a.depth - b.depth)
        .forEach((strip) => add(strip.tiles, `${strip.shade} ${strip.surface}`));
      onSide(profile.map(([f, z]) => [f, z]), half, kind);
    },
    panel(from: number, to: number, bottom: number, top: number, half: number, kind: string) {
      onSide([[from, bottom], [to, bottom], [to, top], [from, top]], half, kind);
    },
    outline(points: readonly (readonly [number, number])[], half: number, kind: string) {
      onSide(points, half, kind);
    },
    /** Lamps and grilles on a flat end; skipped when that end faces away. */
    plate(end: 1 | -1, f: number, left: number, right: number, bottom: number, top: number, kind: string) {
      if (end !== shownEnd) return;
      add([tile(f, left, bottom), tile(f, right, bottom), tile(f, right, top), tile(f, left, top)], `${endShade} ${kind}`);
    },
    farWheels(half: number, radius: number, ...positions: number[]) {
      positions.forEach((f) => disc(f, radius, radius, -shownSide * half, "v-tire"));
    },
    nearWheels(half: number, radius: number, ...positions: number[]) {
      positions.forEach((f) => {
        disc(f, radius, radius + 0.05, shownSide * (half + 0.006), "v-arch");
        disc(f, radius, radius, shownSide * (half + 0.008), "v-tire");
        disc(f, radius, radius * 0.48, shownSide * (half + 0.01), "v-hub");
      });
    },
  };
}

type Sketch = ReturnType<typeof sketch>;

function lamps(v: Sketch, length: number, half: number, bottom: number, top: number) {
  const nose = length / 2, spread = half - 0.08;
  [-1, 1].forEach((side) => {
    v.plate(1, nose, side * spread, side * (spread - 0.22), bottom, top, "v-lamp");
    v.plate(-1, -nose, side * spread, side * (spread - 0.2), bottom, top, "v-tail");
  });
}

function sedan(v: Sketch) {
  const half = 0.56, roof = 0.47, length = 2.9;
  v.shadow(length, half); v.beam(length / 2, half); v.farWheels(half, 0.26, 0.92, -0.92);
  v.hull([[1.45, 0.2], [1.45, 0.48], [1.32, 0.56], [0.62, 0.63], [-1.1, 0.65], [-1.42, 0.6], [-1.45, 0.46], [-1.45, 0.2]], half);
  v.hull([[0.7, 0.62, "v-glass"], [0.24, 0.98], [-0.62, 0.98, "v-glass"], [-1.04, 0.64]], roof);
  v.outline([[0.5, 0.66], [0.17, 0.93], [-0.18, 0.93], [-0.18, 0.66]], roof, "v-glass");
  v.outline([[-0.26, 0.66], [-0.26, 0.93], [-0.6, 0.93], [-0.84, 0.66]], roof, "v-glass");
  v.panel(-1.45, 1.45, 0.2, 0.27, half, "v-trim");
  v.plate(1, 1.45, -0.2, 0.2, 0.3, 0.44, "v-trim");
  lamps(v, length, half, 0.38, 0.48);
  v.nearWheels(half, 0.26, 0.92, -0.92);
}

function van(v: Sketch) {
  const half = 0.6, length = 3;
  v.shadow(length, half); v.beam(length / 2, half); v.farWheels(half, 0.27, 0.98, -0.98);
  v.hull([[1.5, 0.2], [1.5, 0.52], [1.42, 0.64], [1, 0.82, "v-glass"], [0.62, 1.32], [0.48, 1.4], [-1.38, 1.4], [-1.5, 1.3], [-1.5, 0.2]], half);
  v.outline([[0.86, 0.86], [0.6, 1.26], [0.1, 1.26], [0.1, 0.86]], half, "v-glass");
  v.panel(-0.72, 0.02, 0.86, 1.26, half, "v-glass");
  v.panel(-1.38, -0.8, 0.86, 1.26, half, "v-glass");
  v.panel(-0.74, -0.71, 0.26, 1.3, half, "v-seam");
  v.panel(-1.5, 1.5, 0.2, 0.28, half, "v-trim");
  v.plate(1, 1.5, -0.24, 0.24, 0.3, 0.42, "v-trim");
  v.plate(-1, -1.5, -0.42, 0.42, 0.8, 1.2, "v-glass");
  lamps(v, length, half, 0.4, 0.52);
  v.nearWheels(half, 0.27, 0.98, -0.98);
}

function truck(v: Sketch) {
  const half = 0.6, length = 3.8, nose = length / 2;
  v.shadow(length, half); v.beam(nose, half); v.farWheels(half, 0.28, 1.14, -1.1);
  v.hull([[1.9, 0.26], [1.9, 0.34], [-1.9, 0.34], [-1.9, 0.26]], 0.52, "v-trim");
  // The box stands behind the cab, so the cab is what leads down the road.
  v.hull([[0.72, 0.34], [0.72, 1.62], [-1.9, 1.62], [-1.9, 0.34]], half, "v-cargo");
  v.panel(-1.9, 0.72, 0.56, 0.68, half, "v-paint-band");
  v.plate(-1, -1.9, -0.015, 0.015, 0.36, 1.58, "v-seam");
  v.hull([[1.9, 0.24], [1.9, 0.76, "v-glass"], [1.74, 1.3], [1.6, 1.4], [0.82, 1.4], [0.82, 0.24]], half);
  v.outline([[1.66, 0.84], [1.56, 1.26], [1.08, 1.26], [1.08, 0.84]], half, "v-glass");
  v.panel(0.92, 0.95, 0.42, 1.28, half, "v-seam");
  v.panel(0.82, 1.9, 0.24, 0.32, half, "v-trim");
  v.plate(1, nose, -0.22, 0.22, 0.34, 0.5, "v-trim");
  lamps(v, length, half, 0.4, 0.54);
  v.nearWheels(half, 0.28, 1.14, -1.1);
}

const BUS = { half: 0.64, length: 5.4, frontDoor: 2.1, rearDoor: 0.1, doorHalfWidth: 0.34 };

function cityBus(v: Sketch) {
  const { half, length, frontDoor, rearDoor, doorHalfWidth } = BUS;
  const nose = length / 2;
  v.shadow(length, half); v.beam(nose, half); v.farWheels(half, 0.3, 1.26, -1.6);
  v.hull([[nose, 0.18], [nose, 0.62, "v-glass"], [nose - 0.06, 1.3], [nose - 0.22, 1.5], [-nose + 0.14, 1.5], [-nose, 1.38], [-nose, 0.18]], half);
  v.hull([[1.5, 1.5], [1.5, 1.62], [0, 1.62], [0, 1.5]], 0.4, "v-white");
  v.panel(-nose, nose, 0.42, 0.54, half, "v-white");
  v.panel(-nose + 0.18, nose - 0.2, 0.76, 1.28, half, "v-glass v-window");
  [-1.74, -1, -0.3, 0.7, 1.4].forEach((f) => v.panel(f - 0.03, f + 0.03, 0.76, 1.28, half, "v-pillar"));
  if (v.shownSide === 1) [frontDoor, rearDoor].forEach((door) => {
    v.panel(door - doorHalfWidth, door + doorHalfWidth, 0.24, 1.3, half, "v-door");
    v.panel(door - 0.012, door + 0.012, 0.24, 1.3, half, "v-seam");
  });
  v.panel(-nose, nose, 0.18, 0.26, half, "v-trim");
  v.panel(-0.9, 0.9, 1.33, 1.44, half, "v-sign");
  v.plate(1, nose - 0.05, -0.32, 0.32, 1.32, 1.46, "v-sign");
  v.plate(1, nose, -0.26, 0.26, 0.26, 0.4, "v-trim");
  v.plate(-1, -nose, -0.46, 0.46, 0.8, 1.26, "v-glass v-window");
  lamps(v, length, half, 0.36, 0.5);
  v.nearWheels(half, 0.3, 1.26, -1.6);
}

function shuttle(v: Sketch) {
  const half = 0.6, length = 4;
  v.shadow(length, half); v.beam(length / 2, half); v.farWheels(half, 0.28, 1.12, -1.2);
  v.hull([[2, 0.18], [2, 0.54], [1.94, 0.74, "v-glass"], [1.68, 1.3], [1.48, 1.42], [-1.76, 1.42], [-1.96, 1.28], [-2, 0.96], [-2, 0.18]], half);
  v.hull([[1.48, 1.42], [-1.76, 1.42]], half, "v-white");
  v.panel(-2, 2, 0.5, 0.62, half, "v-white");
  v.panel(-1.84, 1.5, 0.76, 1.26, half, "v-glass v-window");
  [-1, -0.16, 0.68].forEach((f) => v.panel(f - 0.03, f + 0.03, 0.76, 1.26, half, "v-pillar"));
  v.panel(-2, 2, 0.18, 0.26, half, "v-trim");
  v.plate(1, 2, -0.24, 0.24, 0.26, 0.4, "v-trim");
  v.plate(-1, -2, -0.4, 0.4, 0.74, 1.12, "v-glass v-window");
  lamps(v, length, half, 0.36, 0.5);
  v.nearWheels(half, 0.28, 1.12, -1.2);
}

const models = { sedan, van, truck, cityBus, shuttle };
export type Model = keyof typeof models;

const Polygons = ({ parts }: { parts: readonly Polygon[] }) => <>{parts.map((part, index) => <polygon key={index} className={part.className} points={part.points} />)}</>;

/** Where the city bus's doors meet the kerb, measured from its centre. */
export const BUS_DOORS = { front: BUS.frontDoor, rear: BUS.rearDoor, side: BUS.half };

/** The bus's doors stand open while `doors` shows; only a kerb-side view has them. */
export function Vehicle({ model, heading, color, doors }: { model: Model; heading: Heading; color: string; doors?: CSSProperties }) {
  const v = sketch(heading);
  models[model](v);
  const openDoors = sketch(heading);
  [BUS.frontDoor, BUS.rearDoor].forEach((door) => openDoors.panel(door - BUS.doorHalfWidth, door + BUS.doorHalfWidth, 0.24, 1.3, BUS.half, "v-door-open"));
  const [originX, originY] = project(0, 0).map(round);
  return <svg className="mover-art" viewBox="-125 -105 250 165" style={{ "--paint": color } as CSSProperties}>
    <g transform={`translate(${-originX} ${-originY})`}>
      <Polygons parts={v.parts} />
      {doors && <g className="bus-doors" style={doors}><Polygons parts={openDoors.parts} /></g>}
    </g>
  </svg>;
}
