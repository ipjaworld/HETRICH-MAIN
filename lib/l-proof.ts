export const L_PROOF_API_ORIGIN = "https://l-proof-ai.xyz";
export const L_PROOF_ARTICLES_ENDPOINT = `${L_PROOF_API_ORIGIN}/api/public/v1/articles`;

export type LProofArticle = {
  editionNumber: number | null;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  proofLevel: number | null;
  tags: string[];
  imageUrl: string | null;
  url: string;
};

export type LProofArticlesPage = {
  version: 1;
  items: LProofArticle[];
  nextCursor: string | null;
};

export type LProofArticlesResult =
  | { ok: true; data: LProofArticlesPage }
  | { ok: false; error: "network" | "response" };

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseArticle(value: unknown): LProofArticle | null {
  if (!isRecord(value)) return null;

  const editionNumber = value.editionNumber;
  const proofLevel = value.proofLevel;
  const tags = value.tags;
  const imageUrl = value.imageUrl;

  if (
    !(editionNumber === null || (typeof editionNumber === "number" && Number.isInteger(editionNumber))) ||
    typeof value.slug !== "string" ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    typeof value.publishedAt !== "string" ||
    !Number.isFinite(Date.parse(value.publishedAt)) ||
    !(proofLevel === null || (typeof proofLevel === "number" && Number.isInteger(proofLevel))) ||
    !Array.isArray(tags) ||
    !tags.every((tag) => typeof tag === "string") ||
    !(imageUrl === null || typeof imageUrl === "string") ||
    typeof value.url !== "string"
  ) {
    return null;
  }

  return {
    editionNumber: editionNumber as number | null,
    slug: value.slug,
    title: value.title,
    summary: value.summary,
    publishedAt: value.publishedAt,
    proofLevel: proofLevel as number | null,
    tags: tags as string[],
    imageUrl: imageUrl as string | null,
    url: value.url,
  };
}

function parseResponse(value: unknown): LProofArticlesPage | null {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items)) return null;
  if (!(value.nextCursor === null || typeof value.nextCursor === "string")) return null;

  const items = value.items.map(parseArticle).filter((item): item is LProofArticle => item !== null);
  if (items.length !== value.items.length) return null;

  return { version: 1, items, nextCursor: value.nextCursor };
}

export async function fetchLProofArticles(
  { limit = 20, cursor }: { limit?: number; cursor?: string | null } = {},
  init?: NextFetchInit,
): Promise<LProofArticlesResult> {
  const endpoint = new URL(L_PROOF_ARTICLES_ENDPOINT);
  endpoint.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 100)));
  if (cursor) endpoint.searchParams.set("cursor", cursor);

  try {
    const response = await fetch(endpoint, {
      ...init,
      headers: { accept: "application/json", ...init?.headers },
    });
    if (!response.ok) return { ok: false, error: "network" };

    const data = parseResponse(await response.json());
    return data ? { ok: true, data } : { ok: false, error: "response" };
  } catch {
    return { ok: false, error: "network" };
  }
}

export function getSafeLProofArticleUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "l-proof-ai.xyz" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function formatEdition(editionNumber: number | null): string {
  if (editionNumber === null) return "L‑PROOF‑AI";
  if (editionNumber === 0) return "ISSUE 00 · PILOT";
  return `ISSUE ${String(editionNumber).padStart(2, "0")}`;
}

export function formatProofLevel(proofLevel: number | null): string {
  return proofLevel === null ? "PROOF LEVEL —" : `PROOF LEVEL ${String(proofLevel).padStart(2, "0")}`;
}

export function formatPublishedAt(publishedAt: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(publishedAt));
}
