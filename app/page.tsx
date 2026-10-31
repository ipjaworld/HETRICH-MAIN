import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePerson, HomeProducts, HomeWork } from "@/components/home-record";
import { LProofLatest, LProofLatestSkeleton } from "@/components/l-proof-latest";
import { Workshop } from "@/components/workshop/workshop";
import { formatPublishedAt, getSafeLProofArticleUrl } from "@/lib/l-proof";
import { fetchCachedLProofArticles } from "@/lib/l-proof-server";
import { socialShareImage } from "@/lib/site-metadata";
import { seoulMinutes, workshopEntries, type WorkshopIssue } from "@/lib/workshop";
import "./workshop.css";

const description = "제품을 직접 만들고 운영하는 개발자 이건하의 작업실. 만든 제품과 실무 경험을 한곳에서 볼 수 있습니다.";

export const metadata: Metadata = {
  title: { absolute: "이건하 — HETRICH" },
  description,
  alternates: { canonical: "/" },
  openGraph: { images: [socialShareImage], type: "website", locale: "ko_KR", siteName: "HETRICH", title: "이건하 — HETRICH", description, url: "/" },
};

async function latestIssue(): Promise<WorkshopIssue | null> {
  const result = await fetchCachedLProofArticles({ limit: 3 });
  const article = result.ok ? result.data.items[0] : undefined;
  const url = article && getSafeLProofArticleUrl(article.url);
  if (!article || !url) return null;
  return { number: article.editionNumber, title: article.title, dateLabel: formatPublishedAt(article.publishedAt), url };
}

export default async function HomePage() {
  const issue = await latestIssue();
  return (
    <main id="main" className="home-record" tabIndex={-1}>
      <Workshop entries={workshopEntries} issue={issue} initialMinutes={seoulMinutes(new Date())} />
      <HomeProducts />
      <HomeWork />
      <section className="record studio-insights" aria-labelledby="insights-title">
        <h2 id="insights-title">최근에 쓴 글</h2>
        <Suspense fallback={<LProofLatestSkeleton />}><LProofLatest /></Suspense>
      </section>
      <HomePerson />
    </main>
  );
}
