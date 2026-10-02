import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  Clock3,
  Headphones,
  MapPin,
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  Truck,
} from "lucide-react";
import { services, processSteps } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Home 2 · Fast shipping from the U.S. to Jamaica",
  description: "A bold alternate Ship Fusion Jamaica homepage concept: five weekly departures, fast 24–48 hour shipping, and friendly package support.",
};

export default function AlternateHomePage() {
  return (
    <>
      <section className="home2-hero">
        <div className="home2-hero-photo" aria-hidden="true" />
        <div className="home2-hero-shade" aria-hidden="true" />
        <div className="home2-hero-grid" aria-hidden="true" />
        <div className="page-container home2-hero-inner">
          <Link href="/" className="home2-version-switch"><span>02</span> View current homepage <ArrowUpRight size={14} /></Link>
          <div className="home2-hero-copy">
            <div className="home2-eyebrow"><i /> HOMEPAGE CONCEPT 02 <span>U.S. → JAMAICA</span></div>
            <div className="home2-logo-line"><span className="home2-logo-mark"><Plane size={17} /><Box size={12} /></span><strong>SHIPFUSION<span>JA</span></strong><i>Your packages, our priority!</i></div>
            <h1><span className="home2-title-ship">WE SHIP</span><span className="home2-frequency"><b>5</b><strong>TIMES</strong></span><em>PER WEEK!</em></h1>
            <div className="home2-speed-band"><strong>24–48</strong><span>HOURS</span><i>FAST!</i></div>
            <p className="home2-hero-description">Get your packages from the U.S. to Jamaica quickly, safely, and with a real team looking out for you.</p>
            <div className="home2-hero-actions"><Link href="/quote" className="home2-button home2-button-lime">Get a shipping quote <ArrowUpRight size={17} /></Link><a href="https://wa.me/18764264516" className="home2-button home2-button-outline" target="_blank" rel="noreferrer">WhatsApp our team <ArrowUpRight size={16} /></a></div>
            <Link className="home2-customer-login" href="/dashboard"><Box size={15} /> Already shipping with us? <strong>Customer login</strong><ArrowRight size={14} /></Link>
          </div>
          <div className="home2-hero-stamp"><span>YOUR PACKAGES,</span><strong>OUR PRIORITY!</strong><i>✦ ✦ ✦ ✦ ✦</i></div>
          <div className="home2-image-caption"><span className="home2-image-caption-dot" /> A smooth journey, from takeoff to touchdown</div>
        </div>
      </section>

      <section className="home2-promise-strip" aria-label="Shipping service highlights">
        <div className="page-container home2-promise-inner"><div className="home2-promise-heading"><span>THE SHIP FUSION PROMISE</span><strong>Fast. Easy. Affordable. Reliable.</strong></div><div className="home2-promise-stat"><Plane size={18} /><strong>5×</strong><span>WEEKLY DEPARTURES</span></div><div className="home2-promise-stat"><Clock3 size={18} /><strong>24–48</strong><span>HOURS FAST SHIPPING</span></div><div className="home2-promise-route"><span>MIA</span><i /><MapPin size={15} /><span>KIN</span></div></div>
      </section>

      <section className="home2-services section-pad" id="home2-services">
        <div className="page-container">
          <div className="home2-section-heading"><div><span className="home2-section-kicker"><i /> THE SHIP FUSION DIFFERENCE</span><h2>More than a shipment.<br /><em>A promise delivered.</em></h2></div><p>From your online cart to your door, our team brings the care, clarity, and convenience that make shipping feel easy.</p></div>
          <div className="home2-service-grid">{services.map(({ icon: Icon, title, description }, index) => <article className="home2-service-card" key={title}><span className={`home2-service-icon home2-service-icon-${index % 2 === 0 ? "lime" : "blue"}`}><Icon size={19} strokeWidth={1.9} /></span><div><span className="home2-service-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div><ArrowUpRight className="home2-service-arrow" size={15} /></article>)}</div>
          <div className="home2-service-note"><ShieldCheck size={17} /><p><strong>We don’t just ship packages.</strong> We deliver reliability, convenience, and peace of mind.</p><Link href="/services">See all services <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="home2-process-section">
        <div className="page-container">
          <div className="home2-process-heading"><span className="home2-section-kicker"><i /> FROM THE U.S. TO JAMAICA</span><h2>We make it easy<br /><em>all the way home.</em></h2><p>Four simple steps. Clear tracking. Helpful humans whenever you need us.</p></div>
          <div className="home2-process-grid">{processSteps.map(({ number, title, description, icon: Icon }, index) => <article className="home2-process-step" key={number}><div className="home2-process-top"><span>{number}</span><i><Icon size={20} /></i>{index < processSteps.length - 1 && <b />}</div><h3>{title}</h3><p>{description}</p></article>)}</div>
          <div className="home2-process-footer"><span><Check size={15} /> Track every package from receipt to delivery</span><Link href="/how-it-works">See how it works <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="home2-reliability-band">
        <div className="page-container home2-reliability-inner"><div className="home2-reliability-copy"><span className="home2-section-kicker"><i /> PEOPLE FIRST. PACKAGES ALWAYS.</span><h2>Good things are<br /><em>on their way.</em></h2><p>Whether it’s one online order or a whole container, our Jamaica-based team is here to make the journey dependable and stress-free.</p><div className="home2-reliability-tags"><span><PackageCheck size={14} /> Careful handling</span><span><Headphones size={14} /> Real support</span><span><Ship size={14} /> Air & sea freight</span></div></div><div className="home2-reliability-card"><span className="home2-quote-stars">★★★★★</span><p>“We don’t just ship packages… we deliver reliability, convenience & peace of mind!”</p><strong>THE SHIP FUSION PROMISE</strong><div className="home2-jamaica-mark" aria-hidden="true"><i /><b /><i /></div></div></div>
      </section>

      <section className="home2-final-cta"><div className="page-container home2-final-inner"><div><span className="home2-section-kicker"><i /> READY WHEN YOU ARE</span><h2>Your next delivery starts here.</h2><p>Shop with confidence. We’ll take it from there.</p></div><div className="home2-final-actions"><Link href="/quote" className="home2-button home2-button-lime">Get a quote <ArrowUpRight size={16} /></Link><a href="https://wa.me/18764264516" className="home2-button home2-button-outline" target="_blank" rel="noreferrer">Call or WhatsApp 876-426-4516 <ArrowUpRight size={15} /></a></div><div className="home2-final-plane"><Truck size={35} /></div></div></section>
    </>
  );
}
