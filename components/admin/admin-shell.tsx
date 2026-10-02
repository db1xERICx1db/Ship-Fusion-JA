"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Bell,
  Boxes,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackageSearch,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { DEMO_ADMIN } from "@/lib/admin-data";
import { AdminDataProvider } from "@/components/admin/admin-data-provider";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: PackageSearch },
  { href: "/admin/customers", label: "Customers / Accounts", icon: UsersRound },
  { href: "/admin/activity", label: "Activity log", icon: Activity },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const current = navItems.find((item) => item.href === pathname) ?? navItems.find((item) => pathname.startsWith(item.href) && item.href !== "/admin") ?? navItems[0];

  async function signOut() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
    } finally {
      window.location.assign("/admin/login");
    }
  }

  return (
    <AdminDataProvider>
      <div className="admin-app">
        <aside className={`admin-sidebar ${menuOpen ? "admin-sidebar-open" : ""}`}>
          <Link className="admin-brand" href="/admin" onClick={() => setMenuOpen(false)} aria-label="Ship Fusion Jamaica admin home">
            <span className="admin-brand-icon"><Package size={21} strokeWidth={2.2} /></span>
            <span className="admin-brand-word"><strong>SHIP FUSION</strong><small>JAMAICA <i>·</i> ADMIN</small></span>
          </Link>
          <div className="admin-mode-card"><span className="admin-mode-icon"><ShieldCheck size={16} /></span><span><strong>STAFF CONSOLE</strong><small>Demo operations workspace</small></span><i className="admin-live-dot" /></div>
          <div className="admin-side-label">OPERATIONS</div>
          <nav className="admin-nav" aria-label="Admin navigation">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link key={href} className={`admin-nav-link ${active ? "admin-nav-active" : ""}`} href={href} onClick={() => setMenuOpen(false)}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{active && <ChevronRight size={14} className="admin-nav-arrow" />}
                </Link>
              );
            })}
          </nav>
          <div className="admin-sidebar-bottom">
            <div className="admin-sidebar-tip"><span><Boxes size={17} /></span><div><strong>Keep every move visible.</strong><small>Status and balance edits leave an audit trail.</small></div></div>
            <Link className="admin-customer-link" href="/dashboard"><ArrowLeft size={15} /> Switch to customer portal</Link>
            <div className="admin-user-card"><span className="admin-avatar">AM</span><span className="admin-user-copy"><strong>{DEMO_ADMIN.name}</strong><small>{DEMO_ADMIN.title}</small></span><button type="button" className="admin-logout" onClick={signOut} aria-label="Sign out" disabled={loggingOut}><LogOut size={16} /></button></div>
          </div>
        </aside>
        {menuOpen && <button type="button" className="admin-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <div className="admin-main-wrap">
          <header className="admin-topbar">
            <button type="button" className="admin-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close admin navigation" : "Open admin navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
            <div className="admin-breadcrumb"><span>Staff console</span><i>/</i><strong>{current.label}</strong></div>
            <div className="admin-top-actions"><span className="admin-day-chip"><i /> JAMAICA OPERATIONS</span><Link href="/admin/activity" className="admin-notification" aria-label="View admin activity"><Bell size={17} /><b /></Link><span className="admin-top-user"><span className="admin-avatar admin-avatar-small">AM</span><strong>Alex Morgan</strong></span></div>
          </header>
          <main className="admin-content">{children}</main>
          <footer className="admin-footer"><span>© {new Date().getFullYear()} Ship Fusion Jamaica</span><span>Admin demo <i>·</i> Changes saved in this browser</span></footer>
        </div>
      </div>
    </AdminDataProvider>
  );
}
