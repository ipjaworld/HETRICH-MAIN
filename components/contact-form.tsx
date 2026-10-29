"use client";
import { useRef, useState, type FormEvent } from "react";
type Status = { tone: "idle" | "error" | "success"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ tone: "idle", message: "" });
  const [pending, setPending] = useState(false);
  const [count, setCount] = useState(0);
  const sending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    sending.current = true;
    setPending(true);
    setStatus({ tone: "idle", message: "문의를 보내고 있습니다…" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setStatus({ tone: "error", message: result.error === "not_configured"
          ? "지금은 문의를 보낼 수 없습니다. 이메일로 연락해주세요."
          : result.error ?? "문의를 보내지 못했습니다. 잠시 후 다시 시도해주세요." });
        return;
      }
      form.reset();
      setCount(0);
      setStatus({ tone: "success", message: "문의가 접수되었습니다. 남겨주신 이메일로 답변드리겠습니다." });
    } catch {
      setStatus({ tone: "error", message: "전송 결과를 확인하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 연락해주세요." });
    } finally { sending.current = false; setPending(false); }
  }
  return <form className="contact-form" onSubmit={submit} aria-labelledby="contact-form-title" aria-busy={pending}>
    <p className="eyebrow">Message</p>
    <h2 id="contact-form-title">여기서 문의하기</h2>
    <p className="contact-form-intro">남겨주신 이메일로 답변드립니다.</p>
    <fieldset disabled={pending}>
      <div className="form-field"><label htmlFor="inquiry-type">문의 유형</label><select id="inquiry-type" name="type" required defaultValue=""><option value="" disabled>선택해주세요</option><option value="Collaboration">개발 의뢰·협업</option><option value="Product">제품 문의</option><option value="Bug / Feedback">제품 피드백</option><option value="Interview / Content">인터뷰·콘텐츠</option><option value="Other">기타</option></select></div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="name">이름</label><input id="name" name="name" autoComplete="name" required maxLength={80} /></div>
        <div className="form-field"><label htmlFor="email">답변받을 이메일</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={160} /></div>
      </div>
      <div className="form-field"><label htmlFor="organization">소속 <span>(선택)</span></label><input id="organization" name="organization" autoComplete="organization" maxLength={120} /></div>
      <div className="form-field"><label htmlFor="message">문의 내용</label><textarea id="message" name="message" required minLength={20} maxLength={4000} rows={6} aria-describedby="message-hint" placeholder="만들고 싶은 일이나 제품을 써본 이야기를 들려주세요." onChange={(event) => setCount(event.target.value.length)} /><div className="field-meta"><small id="message-hint">20자 이상 입력해주세요.</small><span>{count} / 4000</span></div></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <p className="contact-privacy">남겨주신 정보는 문의 확인과 답변에만 사용합니다.</p>
      <button className="button button-dark submit-button" type="submit"><span className="button-label">{pending ? "보내는 중…" : "문의 보내기"}</span>{!pending && <span aria-hidden="true">→</span>}</button>
    </fieldset>
    <p className={`form-status ${status.tone}`} role="status" aria-live="polite">{status.message}</p>
  </form>;
}
