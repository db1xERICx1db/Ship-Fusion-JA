import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { QuoteForm } from "@/components/quote-form";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Request a shipping quote" };

const reasons = ["A real team reviews your request", "Options for air, sea, barrels & containers", "No commitment to request a quote"];

export default function QuotePage() {
  return (
    <>
      <PageIntro eyebrow="YOUR NEXT SHIPMENT STARTS HERE" title="A clearer way to get moving." description="Tell us what you’re shipping and where it needs to go. We’ll help find the right route from the U.S. to Jamaica." />
      <section className="quote-page-section"><div className="page-container quote-layout"><aside className="quote-aside"><span className="quote-aside-number">01 <i>/ 01</i></span><h2>Every good delivery begins with a conversation.</h2><p>Whether it&apos;s one online order or a full container, we’ll help you choose the shipping option that works for you.</p><div className="quote-reasons">{reasons.map((reason) => <div key={reason}><CheckCircle2 size={18} />{reason}</div>)}</div><div className="quote-aside-help"><span>Prefer to talk?</span><a href="https://wa.me/18764264516" target="_blank" rel="noreferrer">WhatsApp us <ArrowRight size={15} /></a></div></aside><QuoteForm /></div></section>
      <section className="quote-faq-strip"><div className="page-container quote-faq-inner"><div><span className="eyebrow"><span /> NEED A QUICK ANSWER?</span><h2>Not sure what to choose?</h2></div><p>We can help you compare air and sea freight, estimate your shipment, and get your packages on their way.</p><Link className="text-link" href="/contact">Talk to our team <ArrowRight size={16} /></Link></div></section>
    </>
  );
}
