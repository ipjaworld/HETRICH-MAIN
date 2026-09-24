import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope, Noto_Sans_KR } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", weight: ["400", "500"], display: "swap" });
export const metadata: Metadata = { metadataBase: new URL("https://hetrich.ipjaworld.chatgpt.site"), title: { default: "HETRICH — Practical AI products", template: "%s — HETRICH" }, description: "HETRICH는 실제 생활과 업무 흐름을 위한 작고 실용적인 AI 제품을 만드는 독립 제품 스튜디오입니다.", alternates: { canonical: "/" }, openGraph: { type: "website", locale: "ko_KR", siteName: "HETRICH", title: "HETRICH — Practical AI products", description: "실제로 쓰이는 흐름을 위한 작은 AI 제품을 만듭니다.", url: "/" }, twitter: { card: "summary", title: "HETRICH — Practical AI products", description: "실제로 쓰이는 흐름을 위한 작은 AI 제품을 만듭니다." }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101411", colorScheme: "light" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko" className={`${manrope.variable} ${notoSansKr.variable} ${dmMono.variable}`}><body><SiteHeader />{children}<SiteFooter /></body></html>; }
