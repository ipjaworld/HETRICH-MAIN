import type { Metadata } from "next";
import { Capabilities } from "@/components/capabilities";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { isContactConfigured } from "@/lib/contact-delivery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact",
  description: "함께 만들고 싶은 일과 제품을 써본 이야기를 HETRICH에 들려주세요. 개발 의뢰, 협업 제안, 제품 피드백을 받습니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <main id="main" className="subpage contact-page" tabIndex={-1}>
    <header className="page-hero contact-page-hero">
      <p className="eyebrow">Contact</p>
      <h1><span>함께 만들고 싶은 일,</span><span>들려주세요.</span></h1>
      <p>웹 서비스와 업무 도구 개발, 협업 제안부터 제품을 써본 이야기까지.<br className="desktop-break" /> 생각하고 있는 일이나 해결하고 싶은 문제를 알려주세요.</p>
    </header>
    <section className="contact-layout" aria-label="문의 방법">
      <div className="contact-note">
        <p className="eyebrow">Email</p>
        <h2>이메일로 연락하기</h2>
        <p>자료를 첨부하거나 긴 이야기를 전하고 싶다면 이메일로 보내주세요.</p>
        <a className="button button-dark" href="mailto:this_is_laugh@naver.com"><span className="button-content"><span className="button-label">이메일 보내기</span><span aria-hidden="true">↗</span></span></a>
        <p><CopyEmail /></p>
        <div className="contact-guide">
          <h3>이런 내용을 알려주세요</h3>
          <p><strong>개발 의뢰·협업</strong>만들고 싶은 것, 필요한 역할, 생각 중인 일정과 예산</p>
          <p><strong>제품 피드백</strong>사용한 제품, 좋았던 점이나 불편했던 상황</p>
          <p>아직 정해지지 않은 부분은 함께 이야기하면 됩니다.</p>
        </div>
      </div>
      {isContactConfigured() ? <ContactForm /> : <div className="contact-alternative">
        <p className="eyebrow">Let’s talk</p>
        <h2>시작은 짧은 이야기로</h2>
        <p>아이디어가 구체적이지 않아도 괜찮습니다. 지금 고민하는 문제와 만들고 싶은 변화를 이메일로 들려주세요.</p>
      </div>}
    </section>
    <Capabilities />
  </main>;
}
