import { z } from "zod";
import { deliverContact, isContactConfigured } from "@/lib/contact-delivery";

const contactSchema = z.object({
  type: z.enum(["Product", "Collaboration", "Interview / Content", "Bug / Feedback", "Other"]),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  organization: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(0).optional().default(""),
});
const maxBodyBytes = 24_000;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next.js can normalize request.url to its internal host behind a proxy.
      const originUrl = new URL(origin);
      const host = request.headers.get("host") ?? new URL(request.url).host;
      if (!['http:', 'https:'].includes(originUrl.protocol) || originUrl.host !== host) throw new Error("Cross-site request");
    } catch {
      return Response.json({ ok: false, error: "이 사이트의 문의 폼을 이용해주세요." }, { status: 403 });
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ ok: false, error: "올바른 요청이 아닙니다." }, { status: 415 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxBodyBytes) {
    return Response.json({ ok: false, error: "요청이 너무 큽니다." }, { status: 413 });
  }
  let parsed: unknown;
  try {
    // Enforce the limit for streamed requests even without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const decoder = new TextDecoder();
    let bytes = 0;
    let body = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        return Response.json({ ok: false, error: "요청이 너무 큽니다." }, { status: 413 });
      }
      body += decoder.decode(value, { stream: true });
    }
    parsed = JSON.parse(body + decoder.decode());
  } catch {
    return Response.json({ ok: false, error: "올바른 요청이 아닙니다." }, { status: 400 });
  }
  const result = contactSchema.safeParse(parsed);
  if (!result.success) {
    if (typeof parsed === "object" && parsed && "website" in parsed && parsed.website) return Response.json({ ok: true });
    return Response.json({ ok: false, error: "입력 내용을 확인해주세요." }, { status: 400 });
  }
  if (!isContactConfigured()) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  try {
    const { type, name, email, organization, message } = result.data;
    if (await deliverContact({ type, name, email, organization, message })) return Response.json({ ok: true }, { status: 201 });
  } catch {
    // Do not expose provider errors, credentials or inquiry contents to the client/logs.
  }
  return Response.json({ ok: false, error: "전송을 완료하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 연락해주세요." }, { status: 502 });
}
