"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Package, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact" },
];

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand-mark ${light ? "brand-mark-light" : ""}`} aria-label="Ship Fusion Jamaica home">
      <span className="brand-icon"><Package size={22} strokeWidth={2.2} /></span>
      <span className="brand-wordmark"><strong>SHIP FUSION</strong><span>JAMAICA <i>↗</i></span></span>
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner page-container">
        <BrandMark />
        <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link
              className={pathname === link.href ? "nav-link nav-link-active" : "nav-link"}
              href={link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-nav-actions">
            <div className="mobile-nav-login-group">
              <Link className="nav-login" href="/dashboard" onClick={() => setMenuOpen(false)}>Customer login <ArrowUpRight size={15} /></Link>
              <Link className="nav-login nav-login-admin" href="/admin/login" onClick={() => setMenuOpen(false)}>Admin login <ArrowUpRight size={15} /></Link>
            </div>
            <Link className="button button-lime button-nav-quote" href="/quote" onClick={() => setMenuOpen(false)}>Get a quote <ArrowUpRight size={16} /></Link>
          </div>
        </nav>
        <div className="header-actions">
          <Link className="nav-login" href="/dashboard">Login <ArrowUpRight size={15} /></Link>
          <Link className="nav-login nav-login-admin" href="/admin/login">Admin login <ArrowUpRight size={15} /></Link>
          <Link className="button button-lime button-nav-quote" href="/quote">Get a quote <ArrowUpRight size={16} /></Link>
        </div>
        <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
