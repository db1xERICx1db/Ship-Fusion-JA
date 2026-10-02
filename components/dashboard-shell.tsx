"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, Bell, ChevronDown, CircleHelp, CreditCard, LayoutDashboard,
  Menu, PackageSearch, Ship, UserRound, X,
} from "lucide-react";
import { BrandMark } from "@/components/site-header";
import { customer } from "@/lib/demo-data";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/packages", label: "My packages", icon: PackageSearch },
  { href: "/dashboard/payments", label: "Payments & billing", icon: CreditCard, badge: "2" },
  { href: "/dashboard/profile", label: "My profile", icon: UserRound },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = navItems.find((item) => item.href === pathname) ?? navItems.find((item) => pathname.startsWith(item.href) && item.href !== "/dashboard") ?? navItems[0];

  return (
    <div className="dashboard-app">
      <aside className={`dashboard-sidebar ${menuOpen ? "dashboard-sidebar-open" : ""}`}>
        <div className="dash-brand"><BrandMark light /></div>
        <div className="demo-note"><span className="demo-note-dot" /><div><strong>DEMO ACCOUNT</strong><small>Sample customer data</small></div></div>
        <div className="dash-sidebar-label">WORKSPACE</div>
        <nav className="dashboard-nav" aria-label="Customer dashboard">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return <Link key={href} className={`dashboard-nav-link ${active ? "dashboard-nav-active" : ""}`} href={href} onClick={() => setMenuOpen(false)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{badge && <span className="nav-count">{badge}</span>}</Link>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-support"><div className="support-icon"><CircleHelp size={18} /></div><div><strong>Need a hand?</strong><a href="https://wa.me/18764264516" target="_blank" rel="noreferrer">Chat with our team <span>↗</span></a></div></div>
          <Link className="back-to-site" href="/"><ArrowLeft size={16} /> Back to Ship Fusion</Link>
          <div className="sidebar-user"><div className="avatar avatar-small">{customer.initials}</div><div><strong>{customer.name}</strong><span>Personal account</span></div><ChevronDown size={15} /></div>
        </div>
      </aside>
      {menuOpen && <button className="dash-mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <div className="dashboard-main-wrap">
        <header className="dashboard-topbar">
          <button className="dashboard-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle dashboard navigation">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <div className="dash-breadcrumb"><span>Customer portal</span><i>/</i><strong>{current.label}</strong></div>
          <div className="dashboard-top-actions"><span className="topbar-date"><Ship size={15} /> MOVING WITH YOU</span><button className="icon-action notification-action" aria-label="Notifications"><Bell size={18} /><i /></button><Link className="topbar-help" href="/contact"><CircleHelp size={17} /><span>Help</span></Link></div>
        </header>
        <main className="dashboard-content">{children}</main>
        <footer className="dashboard-footer"><span>© {new Date().getFullYear()} Ship Fusion Jamaica</span><span>Private customer portal <i>·</i> Sample account data</span></footer>
      </div>
    </div>
  );
}
