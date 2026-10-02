import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Box, CalendarDays, CreditCard, MapPin, PackageCheck, Plane, Ruler, Scale, ShieldCheck } from "lucide-react";
import { packages } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";
import { TrackingProgress } from "@/components/tracking-progress";

const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const metadata: Metadata = { title: "Package tracking", robots: { index: false, follow: false } };

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = packages.find((entry) => entry.id === id);
  if (!item) notFound();
  const isDelivered = item.status === "Delivered";
  const isAwaiting = item.status === "Awaiting Package";
  const stage = isDelivered ? 6 : isAwaiting ? 0 : item.status === "Ready for Delivery" ? 4 : item.status === "In Transit" || item.status === "Customs" ? 3 : item.status === "Processing" ? 1 : item.status === "Received" ? 0 : item.status === "Shipped" ? 2 : 0;
  const total = item.price + item.customs + item.additionalFees;
  return (
    <div className="dashboard-page package-detail-page">
      <div className="package-detail-back"><Link href="/dashboard/packages"><ArrowLeft size={15} /> All packages</Link><span>TRACKING DETAIL <i>/</i> {item.id}</span></div>
      <div className="package-detail-heading"><div><div className="dashboard-kicker"><PackageCheck size={15} /> PACKAGE TRACKING</div><h1>{item.description}<span>.</span></h1><p>Tracking number <strong>{item.id}</strong></p></div><StatusBadge status={item.status} /></div>
      <div className="tracking-detail-layout">
        <div className="tracking-main-column">
          <section className="tracking-overview-card"><div className="tracking-overview-head"><div><span className="detail-card-kicker">SHIPMENT PROGRESS</span><h2>{isDelivered ? "Your package made it." : isAwaiting ? "We’re waiting for your package." : "Your package is on its way."}</h2><p>{isDelivered ? "Successfully delivered. Thank you for shipping with us." : isAwaiting ? "We'll update you when your order arrives at our U.S. warehouse." : "We’re on it. Follow every step of your package’s journey here."}</p></div><span className="tracking-overview-icon"><Plane size={22} /></span></div><TrackingProgress current={stage} /><div className="tracking-route-overview"><div className="tracking-route-point"><span className="route-pin route-pin-us"><MapPin size={15} /></span><div><small>ORIGIN</small><strong>{item.origin}</strong></div></div><div className="tracking-route-line"><span /><ArrowUpRight size={15} /></div><div className="tracking-route-point"><span className="route-pin route-pin-ja"><MapPin size={15} /></span><div><small>DESTINATION</small><strong>{item.destination}</strong></div></div></div></section>
          <section className="tracking-timeline-card"><div className="timeline-heading"><div><span className="detail-card-kicker">SHIPMENT ACTIVITY</span><h2>Tracking timeline</h2></div><span className="tracking-timezone">JAMAICA STANDARD TIME</span></div><div className="tracking-timeline">{item.events.map((event, index) => <div className={`timeline-event ${event.complete ? "timeline-event-done" : ""} ${event.current ? "timeline-event-current" : ""}`} key={`${event.date}-${event.title}`}><div className="timeline-marker"><span>{event.complete ? <PackageCheck size={14} /> : <span className="timeline-marker-number">{String(index + 1).padStart(2, "0")}</span>}</span></div><div className="timeline-event-copy"><div className="timeline-event-top"><h3>{event.title}</h3><span>{event.date}</span></div><p>{event.detail}</p></div></div>)}</div></section>
        </div>
        <aside className="tracking-side-column">
          <section className="tracking-info-card"><div className="tracking-info-card-heading"><span className="detail-card-kicker">PACKAGE INFORMATION</span><span className="tracking-info-icon"><Box size={18} /></span></div><h2>{item.description}</h2><div className="package-specs"><div><span><Scale size={14} /> WEIGHT</span><strong>{item.weight}</strong></div><div><span><Ruler size={14} /> DIMENSIONS</span><strong>{item.dimensions}</strong></div><div><span><Plane size={14} /> SHIPPING METHOD</span><strong>{item.method}</strong></div><div><span><CalendarDays size={14} /> DATE RECEIVED</span><strong>{item.dateReceived}</strong></div><div><span><MapPin size={14} /> CURRENT LOCATION</span><strong>{item.location}</strong></div><div><span><CalendarDays size={14} /> ESTIMATED ARRIVAL</span><strong>{item.eta}</strong></div></div><div className="tracking-secure-note"><ShieldCheck size={16} /> Safely handled by Ship Fusion Jamaica</div></section>
          <section className="tracking-cost-card"><div className="tracking-info-card-heading"><span className="detail-card-kicker">SHIPMENT COST</span><CreditCard size={17} /></div><div className="cost-line"><span>Shipping cost</span><strong>{usd(item.price)}</strong></div><div className="cost-line"><span>Customs fees</span><strong>{usd(item.customs)}</strong></div><div className="cost-line"><span>Additional fees</span><strong>{usd(item.additionalFees)}</strong></div><div className="cost-total"><span>Total amount</span><strong>{usd(total)}</strong></div><div className="cost-payment-status"><span>PAYMENT STATUS</span><StatusBadge status={item.paymentStatus} /></div>{item.paymentStatus === "Balance due" && <Link className="button button-lime tracking-pay-button" href="/dashboard/payments">Review payment <ArrowUpRight size={15} /></Link>}</section>
          <div className="tracking-question-card"><div><span className="tracking-question-icon">?</span><strong>Questions about this package?</strong></div><p>Our customer-care team is happy to help.</p><a href="https://wa.me/18764264516" target="_blank" rel="noreferrer">WhatsApp 876-426-4516 <ArrowUpRight size={14} /></a></div>
        </aside>
      </div>
    </div>
  );
}
