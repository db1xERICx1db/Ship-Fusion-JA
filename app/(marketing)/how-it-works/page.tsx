import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MapPin, Plane, Ship } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { Eyebrow, SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/demo-data";

export const metadata: Metadata = { title: "How shipping works" };

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro eyebrow="FOUR SIMPLE STEPS" title="From your cart to your doorstep." description="Shipping from the U.S. to Jamaica doesn’t have to be complicated. Here’s how we make every step feel easy." />
      <section className="how-page-section"><div className="page-container"><div className="how-page-heading"><SectionHeading eyebrow="YOUR SHIPMENT, STEP BY STEP" title="You shop. We handle the journey." description="Clear updates, careful handling, and a friendly team at every turn." center /></div><div className="how-step-list">{processSteps.map(({ number, title, description, icon: Icon }, index) => <article className="how-step-card" key={number}><div className="how-step-number">{number}</div><div className="how-step-icon"><Icon size={23} /></div><div className="how-step-copy"><h3>{title}</h3><p>{description}</p>{index === 0 && <div className="step-tip"><Check size={15} /> We&apos;ll give you your personal U.S. shipping address.</div>}{index === 2 && <div className="step-tip"><Check size={15} /> Track every milestone from your online account.</div>}</div>{index < processSteps.length - 1 && <div className="step-connector"><span /><ArrowRight size={15} /></div>}</article>)}</div></div></section>
      <section className="address-guide-section"><div className="page-container address-guide-grid"><div className="address-guide-copy"><Eyebrow>YOUR U.S. SHIPPING ADDRESS</Eyebrow><h2>Ready to shop<br />the U.S.?</h2><p>Create a customer account and we’ll provide the delivery details to use at checkout. Your package tracking stays organized in one place.</p><Link className="button button-dark" href="/dashboard">Visit customer portal <ArrowUpRight size={16} /></Link></div><div className="address-guide-card"><div className="address-card-header"><span className="address-card-icon"><MapPin size={18} /></span><div><strong>SHIP FUSION JA</strong><small>YOUR U.S. DELIVERY DETAILS</small></div><span className="address-card-secure">SECURE</span></div><div className="address-placeholder"><span>Get your personal shipping address</span><p>Sign in to your customer portal for your assigned warehouse address and account details.</p><Link href="/dashboard">Go to my portal <ArrowRight size={15} /></Link></div><div className="address-card-foot"><span><Plane size={15} /> AIR & SEA FREIGHT</span><span><Ship size={15} /> U.S. → JAMAICA</span></div></div></div></section>
      <section className="how-bottom-cta"><div className="page-container how-bottom-inner"><div><span className="eyebrow eyebrow-light"><span /> YOUR NEXT PACKAGE IS CLOSER</span><h2>Let’s get your shipment started.</h2></div><Link className="button button-lime" href="/quote">Request a quote <ArrowUpRight size={17} /></Link></div></section>
    </>
  );
}
