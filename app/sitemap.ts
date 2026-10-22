import type { MetadataRoute } from "next";

const base = "https://hetrich.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/products", "/products/l-proof", "/products/secretary", "/products/calories", "/products/silver-vow", "/work", "/insights", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-10-23T00:00:00+09:00"),
  }));
}
