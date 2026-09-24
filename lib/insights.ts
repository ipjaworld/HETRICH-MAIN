import buildNote from "@/content/insights/2026-09-24-hetrich-becomes-a-site.json";
export type InsightBlock = { type: "paragraph" | "heading" | "quote"; text: string } | { type: "list"; items: string[] };
export type Insight = { title: string; date: string; category: string; issue: string | null; summary: string; slug: string; published: boolean; status?: string; tags?: string[]; proofLevel?: string | null; sources?: { label: string; url: string }[]; body: InsightBlock[] };
const insights = [buildNote as Insight];
export const getPublishedInsights = () => insights.filter((post) => post.published).sort((a, b) => b.date.localeCompare(a.date));
export const getInsight = (slug: string) => getPublishedInsights().find((post) => post.slug === slug);
