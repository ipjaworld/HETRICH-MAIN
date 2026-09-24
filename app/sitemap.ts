import type { MetadataRoute } from "next";
import { getPublishedInsights } from "@/lib/insights";
const base = "https://hetrich.ipjaworld.chatgpt.site";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/products", "/insights", "/about", "/contact", ...getPublishedInsights().map((post) => `/insights/${post.slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-09-24T00:00:00+09:00") })); }
