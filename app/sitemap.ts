import type { MetadataRoute } from "next";

const base = "https://hetrich.ipjaworld.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/products", "/insights", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-09-24T00:00:00+09:00"),
  }));
}
