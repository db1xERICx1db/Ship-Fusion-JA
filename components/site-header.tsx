"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
      <span className="brand-icon brand-icon-logo" aria-hidden="true">
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="25" cy="29" r="21" fill="none" stroke="#86b62c" strokeWidth="1.6" />
          <circle cx="25" cy="29" r="17" fill="none" stroke="#245fd4" strokeWidth="1.1" strokeDasharray="52 14" transform="rotate(-35 25 29)" />
          <path d="m8 31 13-7 14 7-14 7-13-7Z" fill="#143c78" stroke="#4e9fe8" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="m21 24 14 7v9l-14-7v-9Z" fill="#1257bd" stroke="#63aae8" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="m8 31 13 7v9L8 40v-9Z" fill="#0b2752" stroke="#4e9fe8" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="m21 29 5-3 5 3-5 3-5-3Z" fill="#b7ed3e" opacity=".96" />
          <path d="M22 21 42 3l-7 20-5-5-7 8 1-8-8 2 6-5Z" fill="#1766df" stroke="#66a8ff" strokeWidth=".8" strokeLinejoin="round" />
          <path d="M18 42c4 2 9 3 14 2" fill="none" stroke="#b7ed3e" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-wordmark"><strong>SHIPFUSION<span className="brand-ja">JA</span></strong><span className="brand-tagline">Your packages, <i>Our priority!</i></span></span>
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
