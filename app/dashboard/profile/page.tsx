import type { Metadata } from "next";
import { ArrowUpRight, Bell, ShieldCheck, UserRound } from "lucide-react";
import { customer } from "@/lib/demo-data";
import { ProfileForm } from "@/components/profile-form";

export const metadata: Metadata = { title: "My profile", robots: { index: false, follow: false } };

export default function ProfilePage() {
  return (
    <div className="dashboard-page profile-page">
      <div className="dashboard-page-heading"><div><div className="dashboard-kicker"><UserRound size={14} /> ACCOUNT SETTINGS</div><h1>My profile<span>.</span></h1><p>Manage your contact details and shipping preferences.</p></div><span className="sample-data-chip">DEMO ACCOUNT</span></div>
      <div className="profile-layout"><div className="profile-main"><div className="profile-account-card"><div className="profile-avatar">{customer.initials}</div><div><span className="dashboard-kicker">CUSTOMER ACCOUNT</span><h2>{customer.name}</h2><p>{customer.membership}</p></div><span className="profile-demo-badge"><ShieldCheck size={14} /> SAMPLE PROFILE</span></div><ProfileForm /><div className="profile-notification-card"><span className="profile-setting-icon"><Bell size={18} /></span><div><strong>Shipment updates</strong><p>In a live account, you’ll be able to choose how we send delivery updates.</p></div><span className="profile-toggle-placeholder"><i /></span></div></div><aside className="profile-aside"><div className="profile-aside-card"><span className="profile-aside-icon"><ShieldCheck size={21} /></span><h3>Your information stays yours.</h3><p>This is a sample customer portal. Profile changes are only simulated in your current browser session.</p><a href="https://wa.me/18764264516" target="_blank" rel="noreferrer">Questions? Talk to us <ArrowUpRight size={14} /></a></div><div className="profile-account-number"><span>ACCOUNT REFERENCE</span><strong>SFJ-DEMO-0248</strong><small>Fictional demo identifier</small></div></aside></div>
    </div>
  );
}
