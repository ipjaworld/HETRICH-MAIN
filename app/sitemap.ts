import type { MetadataRoute } from "next";

const base = "https://hetrich.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/products", "/work", "/insights", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(path === "/work" ? "2026-10-21T00:00:00+09:00" : "2026-09-24T00:00:00+09:00"),
  }));
}
