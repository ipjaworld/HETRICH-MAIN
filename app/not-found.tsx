import Link from "next/link";
export default function NotFound() { return <main id="main" className="subpage"><section className="page-hero"><p className="eyebrow">404 / Not found</p><h1>이 페이지는<br />아직 없습니다.</h1><p><Link className="text-link" href="/">HETRICH 홈으로 돌아가기 <span aria-hidden="true">→</span></Link></p></section></main>; }
