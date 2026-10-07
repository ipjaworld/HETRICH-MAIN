import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact", description: "제품 피드백과 협업 제안을 HETRICH에 전해주세요.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const formAvailable = Boolean(process.env.CONTACT_WEBHOOK_URL);
  return <main id="main" className="subpage contact-page" tabIndex={-1}>
    <header className="page-hero contact-page-hero"><p className="eyebrow">Contact</p><h1>써본 이야기,<br />함께 만들고 싶은 일.</h1><p>제품에 대한 질문과 피드백, 협업 제안을 보내주세요.</p></header>
    <section className="contact-layout">
      <div className="contact-note"><p className="eyebrow">Say hello</p><h2>이메일로 이야기해주세요.</h2><p>어떤 제품을 사용했는지, 어디에서 불편했는지 알려주시면 도움이 됩니다. 협업 제안은 만들고 싶은 것과 필요한 역할을 함께 적어주세요.</p><a className="button button-dark" href="mailto:this_is_laugh@naver.com">이메일 보내기 <span aria-hidden="true">↗</span></a><p><CopyEmail /></p></div>
      {formAvailable ? <ContactForm /> : <div className="contact-alternative"><p className="eyebrow">A useful starting point</p><h2>짧게 보내셔도 괜찮습니다.</h2><p>제품 피드백이라면 사용한 기기와 문제가 생긴 상황을,<br className="desktop-break" /> 협업이라면 목표와 대략적인 일정을 알려주세요.</p><p>현재 문의는 이메일로 받고 있습니다.</p></div>}
    </section>
  </main>;
}
