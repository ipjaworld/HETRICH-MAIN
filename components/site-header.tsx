"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/products", label: "Products" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [homeScrolled, setHomeScrolled] = useState(false);

  useEffect(() => {
    const syncScroll = () => setHomeScrolled(window.scrollY > 12);
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  const scrolled = pathname !== "/" || homeScrolled;

  return (
    <>
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <Link className="wordmark" href="/" aria-label="HETRICH 홈" onClick={() => setOpen(false)}>
          HETRICH<span aria-hidden="true">.</span>
        </Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
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
