import type { CSSProperties } from "react";

/** How a walker is dressed. Faces stay tiny; hair and clothes are what tell people apart at this size. */
export type Look = {
  top: string; bottom: string; hair: string;
  style: "short" | "long" | "cap" | "bun";
  carry?: "backpack" | "tote";
  coat?: boolean;
  height?: number;
};

/** What a walker is doing on one stretch of the route; `flip` turns them to face screen left. */
export type Pose = { walking: boolean; away: boolean; flip: boolean; style?: CSSProperties };

function Hair({ look, away }: { look: Look; away: boolean }) {
  const { hair, style } = look;
  if (style === "cap") return <>
    <path fill={hair} d="M-6.8 -41a6.8 6.8 0 0 1 13.6 0Z" />
    {!away && <path fill={hair} d="M4 -42.4h6.4a1 1 0 0 1 0 2H4Z" />}
  </>;
  return <>
    {away
      ? <path fill={hair} d={style === "long" ? "M-6.8 -40a6.8 6.8 0 0 1 13.6 0v8.4q-6.8 2.4 -13.6 0Z" : "M-6.8 -40a6.8 6.8 0 0 1 13.6 0q0 5 -3 6.4h-7.6q-3 -1.4 -3 -6.4Z"} />
      : <path fill={hair} d={style === "long" ? "M4.6 -44a6.8 6.8 0 0 0 -11.4 4.6v7.8q3 1.2 5 0v-7.4q5 -.6 6.4 -5Z" : "M5.4 -44a6.8 6.8 0 0 0 -12.2 4.2q0 2.6 1.4 4.2l1.8 -3.6q6 -.4 9 -4.8Z"} />}
    {style === "bun" && <circle fill={hair} cx={away ? 0 : -3} cy="-48" r="2.6" />}
  </>;
}

function Figure({ look, stride }: { look: Look; stride: 0 | 1 | "still" }) {
  const swing = stride === 0 ? 4 : stride === 1 ? -4 : 0;
  const legs = stride === "still" ? "M-2.4 -14L-2.4 -1.5M2.4 -14L2.4 -1.5" : stride === 0 ? "M-1.5 -14L-5.5 -1.5M1.5 -14L5 -2" : "M-1 -14L-1.5 -1.5M1 -14L1.5 -3.5";
  return <>
    <path stroke={look.bottom} className="person-limb" strokeWidth="4" d={legs} />
    <path stroke={look.top} className="person-limb arm" strokeWidth="3.2" d={`M0 -29L${swing} -17`} />
    {stride === "still" || <path className="person-shoe" d={stride === 0 ? "M-7 -1.4h3.6M3.4 -2h3.6" : "M-3 -1.4h3.6M0 -3.4h3.6"} />}
  </>;
}

function Body({ look, pose }: { look: Look; pose: Pose }) {
  const hem = look.coat ? -9 : -13;
  return <>
    {look.carry === "backpack" && <rect fill="#4a4f45" x="-10" y="-31.5" width="5.4" height="13" rx="2.2" />}
    <path fill={look.top} d={`M-6 -28a5 5 0 0 1 5 -5h2a5 5 0 0 1 5 5l.6 ${hem + 28}h-13.2Z`} />
    {look.carry === "tote" && <path className="person-tote" d="M5 -29v11M3.4 -18h6.2l.8 7.4h-7.8Z" />}
    <circle className="walker-head" cx="0" cy="-40" r="6.6" />
    {!pose.away && <circle className="person-eye-dot" cx="3.4" cy="-40" r=".9" />}
    <Hair look={look} away={pose.away} />
  </>;
}

/** Each pose is a whole drawn figure, so swapping between them needs no repaint of the street. */
export function Person({ look, poses, step }: { look: Look; poses: readonly Pose[]; step: number }) {
  const scale = look.height ?? 1;
  return <svg className="mover-art" viewBox="-14 -50 28 56" style={{ "--step": `${-step}s` } as CSSProperties}>
    <ellipse className="walker-shadow" cx="2" cy="0" rx="9" ry="3" />
    {poses.map((pose, index) => <g key={index} style={pose.style} transform={`scale(${pose.flip ? -scale : scale} ${scale})`}>
      {pose.walking
        ? <g className="person-bob">
          <g className="person-frame"><Figure look={look} stride={0} /></g>
          <g className="person-frame person-frame-next"><Figure look={look} stride={1} /></g>
          <Body look={look} pose={pose} />
        </g>
        : <><Figure look={look} stride="still" /><Body look={look} pose={pose} /></>}
    </g>)}
  </svg>;
}
