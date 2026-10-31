/** Isometric projection for the workshop room. Units are room tiles; the room is 10 × 10 × 7. */
export const UNIT = 36;
const COS = 0.866;
const SIN = 0.5;
const ORIGIN = { x: 400, y: 270 };
/** Text and small parts are drawn in a finer local grid inside each plane. */
const LOCAL = UNIT / 20;

export type Tile = readonly [x: number, y: number, z?: number];
export type Face = { className: string; points: string };

export const round = (value: number) => Math.round(value * 100) / 100;

export function project(x: number, y: number, z = 0): [number, number] {
  return [ORIGIN.x + (x - y) * UNIT * COS, ORIGIN.y + (x + y) * UNIT * SIN - z * UNIT];
}

export const toPoints = (tiles: readonly Tile[]) => tiles.map(([x, y, z]) => project(x, y, z).map(round).join(",")).join(" ");
export const toPath = (x: number, y: number, z: number) => project(x, y, z).map(round).join(" ");

/** The three visible faces of a box, back to front. */
export function boxFaces(x: number, y: number, z: number, width: number, depth: number, height: number, kind = ""): Face[] {
  const top = z + height, right = x + width, front = y + depth;
  return [
    { className: `f-l ${kind}`, points: toPoints([[x, front, top], [right, front, top], [right, front, z], [x, front, z]]) },
    { className: `f-r ${kind}`, points: toPoints([[right, y, top], [right, front, top], [right, front, z], [right, y, z]]) },
    { className: `f-t ${kind}`, points: toPoints([[x, y, top], [right, y, top], [right, front, top], [x, front, top]]) },
  ];
}

const matrix = (a: number, b: number, c: number, d: number, origin: [number, number]) => `matrix(${[a, b, c, d, ...origin].map(round).join(" ")})`;

/** Lying flat; text reads along +x. */
export const planeFlat = (x: number, y: number, z: number) => matrix(COS * LOCAL, SIN * LOCAL, -COS * LOCAL, SIN * LOCAL, project(x, y, z));
/** On a surface facing +y, such as the right wall. */
export const planeFacingY = (x: number, y: number, z: number) => matrix(COS * LOCAL, SIN * LOCAL, 0, LOCAL, project(x, y, z));
/** On a surface facing +x, such as the left wall. */
export const planeFacingX = (x: number, y: number, z: number) => matrix(COS * LOCAL, -SIN * LOCAL, 0, LOCAL, project(x, y, z));

export const isoCircle = (radius: number) => ({ rx: radius * UNIT * 1.2247, ry: radius * UNIT * 0.7071 });

export type View = readonly [x: number, y: number, width: number, height: number];

const ROOM = { cx: 400, cy: 335, size: 690 };

/** `headerHeight` is the fixed site header; on wide screens the room is fitted below it. */
export function homeView(width: number, height: number, headerHeight = 0): View {
  const ratio = width / height;
  if (ratio < 0.9) {
    const h = ROOM.size / ratio;
    return [ROOM.cx - ROOM.size / 2, ROOM.cy - 0.56 * h, ROOM.size, h];
  }
  const available = height - headerHeight, scale = available / ROOM.size;
  const h = height / scale, w = width / scale;
  return [ROOM.cx - 0.66 * w, ROOM.cy - (headerHeight + available / 2) / scale, w, h];
}

export function focusView(width: number, height: number, target: { x: number; y: number; zoom: number }): View {
  const ratio = width / height;
  if (ratio < 0.9) {
    const h = target.zoom / ratio;
    return [target.x - target.zoom / 2, target.y - 0.27 * h, target.zoom, h];
  }
  const h = target.zoom * 0.78, w = h * ratio;
  return [target.x - 0.34 * w, target.y - 0.5 * h, w, h];
}
