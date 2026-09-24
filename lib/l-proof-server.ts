import "server-only";

import { fetchLProofArticles } from "@/lib/l-proof";

export function fetchCachedLProofArticles({ limit = 20, cursor }: { limit?: number; cursor?: string | null } = {}) {
  return fetchLProofArticles(
    { limit, cursor },
    { next: { revalidate: 300 } },
  );
}
