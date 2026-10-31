import { products, type Product } from "@/lib/products";

export type WorkshopId = "memo" | "book" | "paper" | "person" | "drawer" | "arcade" | "bowl" | "story";
export type WorkshopLink = { label: string; href: string };
export type WorkshopEntry = { id: WorkshopId; label: string; chip: string; title: string; line: string; links: WorkshopLink[] };
export type WorkshopIssue = { number: number | null; title: string; dateLabel: string; url: string };

const product = (id: Product["id"]) => products.find((item) => item.id === id)!;
const entryFor = (id: WorkshopId, label: string, source: Product, links: WorkshopLink[]): WorkshopEntry => ({
  id, label, chip: source.homeStatus, title: source.name, line: source.homeSummary, links,
});

/** Copy comes from lib/products.ts; only the room's objects are defined here. */
export const workshopEntries: WorkshopEntry[] = [
  { id: "person", label: "이건하", chip: "개발자 · HETRICH", title: "이건하", line: "쓰다가 걸리는 부분을 보면 직접 만들어 확인합니다. 업무 플랫폼과 구독 커머스의 프론트엔드·API 연동을 맡았고, 지금은 제 제품도 운영합니다.", links: [{ label: "만드는 사람과 방향", href: "/about" }, { label: "GitHub", href: "https://github.com/ipjaworld" }] },
  entryFor("paper", "L‑Proof AI, 책상 위의 최신 호", product("l-proof"), [{ label: product("l-proof").serviceLabel, href: product("l-proof").service }, { label: "설계와 구현", href: "/products/l-proof" }]),
  entryFor("memo", "HIS, 벽의 메모판", product("secretary"), [{ label: "설계와 구현", href: "/products/secretary" }]),
  { id: "book", label: "은빛 서약, 선반의 은빛 책", chip: "비상업 개인 창작 · 팬게임", title: "악역영애 말포이 — 은빛 서약", line: "단서를 좇고 인물의 신뢰를 살피며 선택하는 비주얼 노벨입니다.", links: [{ label: "설계 이야기", href: "/products/silver-vow" }] },
  { id: "drawer", label: "실무 경험, 서랍장", chip: "이전 조직 · 개인 기여", title: "실무 경험", line: "업무 화면, 구매·결제 흐름, 인증·PG 연동을 맡아 구현했습니다.", links: [{ label: "담당 범위와 판단 과정", href: "/work" }] },
  entryFor("arcade", "메이플랜드 레범몬, 오락기", product("rebemon"), [{ label: product("rebemon").serviceLabel, href: product("rebemon").service }, { label: "설계와 구현", href: "/products/rebemon" }]),
  entryFor("bowl", "How Much Calories Left, 밥공기", product("calories"), [{ label: product("calories").serviceLabel, href: product("calories").service }, { label: "설계와 구현", href: "/products/calories" }]),
  // Deliberately general: titles and details of unpublished writing stay off the site.
  { id: "story", label: "쓰고 있는 이야기, 지구본과 원고", chip: "준비 중", title: "쓰고 있는 이야기", line: "소설과 그 바탕이 될 세계를 조금씩 쌓고 있습니다. 아직 보여 드릴 단계는 아니지만, 이 자리를 먼저 마련해 두었습니다.", links: [] },
];

/** Links from our services carry ?ref=, so a visitor lands in front of that service's object. */
export const workshopRefs: Record<string, WorkshopId> = { "l-proof": "paper", "l-proof-about": "paper", calories: "bowl", rebemon: "arcade" };

export type WorkshopPhase = "morning" | "noon" | "night";

/** The scene follows the visitor's own clock; the server only supplies a first guess in Seoul time. */
export const localMinutes = (date: Date) => date.getHours() * 60 + date.getMinutes();

export function seoulMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return (value("hour") % 24) * 60 + value("minute");
}

export function workshopPhase(minutes: number): WorkshopPhase {
  const hour = Math.floor(minutes / 60);
  if (hour >= 6 && hour < 12) return "morning";
  return hour >= 12 && hour < 19 ? "noon" : "night";
}
