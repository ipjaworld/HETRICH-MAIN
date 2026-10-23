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
import "./portfolio.css";
export const metadata: Metadata = { metadataBase: new URL("https://hetrich.com"), title: { default: "HETRICH — Product & Development Studio", template: "%s — HETRICH" }, description: "직접 제품을 만들고 운영하는 개발자 이건하의 Product & Development Studio. 웹 서비스·업무 도구·API 연동 개발과 실제 제품 사례를 만나보세요.", alternates: { canonical: "/" }, openGraph: { type: "website", locale: "ko_KR", siteName: "HETRICH", title: "HETRICH — Product & Development Studio", description: "내가 겪은 시행착오가, 누군가의 출발점이 되도록. 직접 만든 제품과 실무 경험으로 웹 서비스와 업무 도구를 함께 만듭니다.", url: "/" }, twitter: { card: "summary", title: "HETRICH — Product & Development Studio", description: "내가 겪은 시행착오가, 누군가의 출발점이 되도록. 직접 만든 제품과 실무 경험으로 웹 서비스와 업무 도구를 함께 만듭니다." }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101411", colorScheme: "light" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><SiteHeader />{children}<SiteFooter /></body></html>; }
