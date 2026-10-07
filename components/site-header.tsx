"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/products", label: "Products" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 701px)");
    const onResize = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      media.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <header ref={header} className="site-header" onBlur={(event) => {
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <Link className="wordmark" href="/" aria-label="HETRICH 홈" onClick={() => setOpen(false)}>
          HETRICH<span aria-hidden="true">.</span>
        </Link>
        <button ref={menuButton} className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">메뉴 {open ? "닫기" : "열기"}</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav className={`site-nav${open ? " open" : ""}`} id="site-nav" aria-label="주요 메뉴">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
