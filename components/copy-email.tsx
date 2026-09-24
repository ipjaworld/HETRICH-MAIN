"use client";
import { useState } from "react";
export function CopyEmail() { const email = "this_is_laugh@naver.com"; const [copied, setCopied] = useState(false); return <button type="button" className="copy-email" onClick={async () => { try { await navigator.clipboard.writeText(email); setCopied(true); } catch { setCopied(false); } }}>{copied ? "이메일 주소를 복사했습니다" : `${email} 복사`}</button>; }
