import Link from "next/link";
import { ArrowRight, ArrowUpRight, Box, Clock3, CreditCard, MapPin, PackageCheck, Plane, ScanLine, ShieldCheck, Ship, Truck } from "lucide-react";
import { customer, packages } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { TrackingProgress } from "@/components/tracking-progress";
import { DemoDataAlert } from "@/components/demo-data-alert";

const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function DashboardPage() {
  const latest = packages[0];
  const recent = packages.slice(0, 3);
  return (
    <div className="dashboard-page dashboard-overview">
      <div className="dashboard-welcome"><div><div className="dashboard-kicker"><span className="welcome-spark">✳</span> YOUR PRIVATE SHIPPING PORTAL</div><h1>Welcome back, {customer.name.split(" ")[0]}<span>.</span></h1><p>Here’s the latest on your packages and deliveries.</p></div><div className="demo-data-tag"><span /> DEMO DATA · NOT LIVE SHIPMENTS</div></div>
      <DemoDataAlert />
      <section className="dashboard-metrics" aria-label="Shipment summary">
        <article className="dashboard-metric"><div className="metric-top"><span>Active shipments</span><span className="metric-icon metric-icon-blue"><Box size={17} /></span></div><strong>03</strong><small>Packages being handled</small><Link href="/dashboard/packages">View shipments <ArrowUpRight size={13} /></Link></article>
        <article className="dashboard-metric"><div className="metric-top"><span>In transit</span><span className="metric-icon metric-icon-green"><Plane size={17} /></span></div><strong>01</strong><small>Currently moving your way</small><span className="metric-dots"><i /><i /><i /></span></article>
        <article className="dashboard-metric"><div className="metric-top"><span>Ready for pickup</span><span className="metric-icon metric-icon-blue"><PackageCheck size={17} /></span></div><strong>01</strong><small>Ready at Kingston hub</small><Link href="/dashboard/packages/SFJ-2026-10397">Package details <ArrowUpRight size={13} /></Link></article>
        <article className="dashboard-metric"><div className="metric-top"><span>Delivered</span><span className="metric-icon metric-icon-green"><Truck size={17} /></span></div><strong>01</strong><small>Successfully delivered</small><span className="metric-caption">This month</span></article>
        <article className="dashboard-metric metric-balance"><div className="metric-top"><span>Outstanding balance</span><span className="metric-icon metric-icon-orange"><CreditCard size={17} /></span></div><strong>{usd(239)}</strong><small>2 invoices need attention</small><Link href="/dashboard/payments">Review balance <ArrowUpRight size={13} /></Link></article>
      </section>
      <section className="current-shipment-card">
        <div className="current-shipment-top"><div><div className="shipment-label"><span className="shipment-label-icon"><ScanLine size={15} /></span> YOUR CURRENT SHIPMENT <span className="shipment-demo-pill">SAMPLE</span></div><h2>One more step and it’s yours.</h2><p>We’re keeping a close eye on this shipment for you.</p></div><StatusBadge status={latest.status} /></div>
        <div className="shipment-track-meta"><div><span>TRACKING NUMBER</span><strong>{latest.id}</strong></div><Link href={`/dashboard/packages/${latest.id}`}>View full tracking <ArrowUpRight size={15} /></Link></div>
        <TrackingProgress current={3} />
        <div className="shipment-info-grid"><div><span><Box size={14} /> PACKAGE</span><strong>{latest.description}</strong></div><div><span><MapPin size={14} /> ROUTE</span><strong>{latest.origin} <i>→</i> {latest.destination}</strong></div><div><span><Plane size={14} /> SHIPPING METHOD</span><strong>{latest.method}</strong></div><div><span><Clock3 size={14} /> ESTIMATED ARRIVAL</span><strong>{latest.eta}</strong></div></div>
        <div className="shipment-card-footer"><span><ShieldCheck size={15} /> Secure handling, every step of the way</span><Link href={`/dashboard/packages/${latest.id}`}>See shipment details <ArrowRight size={15} /></Link></div>
      </section>
      <section className="dashboard-recent-section"><div className="dash-section-head"><div><span className="dashboard-kicker">YOUR RECENT ACTIVITY</span><h2>Packages on your radar</h2></div><Link href="/dashboard/packages" className="dashboard-text-link">View all packages <ArrowRight size={15} /></Link></div><div className="recent-packages-card"><div className="recent-package-table-head"><span>SHIPMENT</span><span>METHOD</span><span>STATUS</span><span>EST. ARRIVAL</span><span /></div>{recent.map((item) => <Link className="recent-package-row" href={`/dashboard/packages/${item.id}`} key={item.id}><span className="recent-package-name"><i className={`recent-box recent-box-${item.status === "Delivered" ? "done" : item.status === "Ready for Delivery" ? "ready" : "moving"}`}><Box size={17} /></i><span><strong>{item.description}</strong><small>{item.id}</small></span></span><span className="recent-method"><span className="recent-mobile-label">METHOD</span>{item.method}</span><span className="recent-status"><StatusBadge status={item.status} /></span><span className="recent-eta"><span className="recent-mobile-label">EST. ARRIVAL</span>{item.eta}</span><ArrowUpRight className="recent-row-arrow" size={17} /></Link>)}</div></section>
      <div className="dashboard-bottom-note"><span className="bottom-note-icon"><Ship size={17} /></span><div><strong>Here for you from takeoff to touchdown.</strong><p>Need help with a package? Our team is one message away.</p></div><a href="https://wa.me/18764264516" target="_blank" rel="noreferrer">Chat with customer care <ArrowUpRight size={15} /></a></div>
    </div>
  );
}

