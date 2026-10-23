export const inquiryTypes = {
  Collaboration: "개발 의뢰·협업", Product: "제품 문의", "Bug / Feedback": "제품 피드백",
  "Interview / Content": "인터뷰·콘텐츠", Other: "기타",
} as const;
export type ContactMessage = { type: keyof typeof inquiryTypes; name: string; email: string; organization: string; message: string };

export function isContactConfigured() {
  return Boolean(process.env.CONTACT_WEBHOOK_URL?.trim() || (process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_FROM_EMAIL?.trim()));
}

export async function deliverContact(message: ContactMessage) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (apiKey && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from, to: ["this_is_laugh@naver.com"], reply_to: message.email,
        subject: `[HETRICH] ${inquiryTypes[message.type]}`,
        text: [`이름: ${message.name}`, `이메일: ${message.email}`, `소속: ${message.organization || "미기재"}`, "", message.message].join("\n"),
      }),
    });
    if (!response.ok) return false;
    const result = await response.json() as { id?: string };
    return Boolean(result.id);
  }
  const endpoint = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!endpoint) return false;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.CONTACT_WEBHOOK_BEARER_TOKEN) headers.authorization = `Bearer ${process.env.CONTACT_WEBHOOK_BEARER_TOKEN}`;
  const response = await fetch(endpoint, {
    method: "POST", headers, signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({ ...message, source: "hetrich-contact", submittedAt: new Date().toISOString() }),
  });
  return response.ok;
}
