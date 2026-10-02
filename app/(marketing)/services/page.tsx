import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Shipping services" };

export default function ServicesPage() {
  return (
    <>
      <PageIntro eyebrow="MORE THAN A DELIVERY" title="Shipping made simpler. Service made personal." description="From the first click to the final handoff, Ship Fusion Jamaica brings speed, care, and confidence to every package." />
      <section className="services-page-section"><div className="page-container"><div className="services-page-intro"><SectionHeading eyebrow="THE SHIP FUSION PROMISE" title={<>A little more care.<br /><span>A lot more peace of mind.</span></>} description="We don’t just ship packages. We deliver reliability, convenience, and peace of mind—one shipment at a time." /><div className="service-promise-card"><div className="promise-checks">{["Five shipping departures each week", "Dedicated support along the way", "Options that fit your shipment"].map((text) => <span key={text}><CheckCircle2 size={17} />{text}</span>)}</div><div className="promise-stats"><strong>24–48<small>HRS FAST</small></strong><span>Typical air freight transit<br />from the U.S. to Jamaica</span></div></div></div><div className="service-card-grid">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div></div></section>
      <section className="services-cta-band"><div className="page-container services-cta-inner"><div><span className="eyebrow eyebrow-light"><span /> LET’S MOVE SOMETHING</span><h2>Tell us what you need to ship.</h2><p>We’ll help you find the right service for your package, timeline, and budget.</p></div><Link className="button button-lime" href="/quote">Get a quote <ArrowUpRight size={17} /></Link></div></section>
      <section className="services-promise-bottom"><div className="page-container"><div className="service-bottom-note"><span className="service-bottom-icon">✳</span><div><span className="eyebrow">THE SHIP FUSION PROMISE</span><h2>Fast. Easy. Affordable. Reliable.</h2><p>That&apos;s the Ship Fusion Promise!</p></div><Link href="/how-it-works">See how it works <ArrowRight size={16} /></Link></div></div></section>
    </>
  );
}
