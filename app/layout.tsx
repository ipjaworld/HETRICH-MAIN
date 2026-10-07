import type { Metadata, Viewport } from "next";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/600.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/dm-mono/latin-500.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./studio.css";
export const metadata: Metadata = { metadataBase: new URL("https://hetrich.com"), title: { default: "HETRICH — Independent product studio", template: "%s — HETRICH" }, description: "개발자 이건하가 직접 기획·개발·운영하는 개인 제품 스튜디오. L‑Proof AI, HIS(HETRICH AI Secretary), How Much Calories Left를 만나보세요.", alternates: { canonical: "/" }, openGraph: { type: "website", locale: "ko_KR", siteName: "HETRICH", title: "HETRICH — Independent product studio", description: "작게 만들고, 쓰면서 개선합니다. HETRICH의 제품과 개발 기록을 만나보세요.", url: "/" }, twitter: { card: "summary", title: "HETRICH — Independent product studio", description: "작게 만들고, 쓰면서 개선합니다. HETRICH의 제품과 개발 기록을 만나보세요." }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101411", colorScheme: "light" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><SiteHeader />{children}<SiteFooter /></body></html>; }
