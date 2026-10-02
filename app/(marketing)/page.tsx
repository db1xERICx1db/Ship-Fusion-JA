import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Box, Check, CircleHelp,
  Clock3, MapPin, PackageCheck, Plane, Quote, ShieldCheck, Ship, Truck,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { services, processSteps } from "@/lib/demo-data";

const shippingOptions = [
  { icon: Plane, title: "Air freight", text: "A quick connection for the packages you can't wait to open.", tag: "24–48 hour service" },
  { icon: Ship, title: "Sea freight", text: "A smart, cost-friendly route for larger and heavier shipments.", tag: "Room for more" },
  { icon: Box, title: "Barrel shipping", text: "Send more of what matters with easy barrel shipping.", tag: "Customs support" },
  { icon: Truck, title: "Container shipping", text: "Flexible space for personal moves and commercial cargo.", tag: "Big or small" },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-image" />
        <div className="home-hero-shade" />
        <div className="hero-grid-lines" />
        <div className="page-container home-hero-container">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="live-dot" /> U.S. TO JAMAICA · SHIPPING MADE EASY</div>
            <h1><span>SHIP FUSION</span><em>JAMAICA</em></h1>
            <p className="hero-tagline">Your packages, <strong>our priority!</strong></p>
            <div className="hero-promise-row"><span><Check size={14} /> Fast</span><i /> <span>Easy</span><i /> <span>Affordable</span><i /> <span>Reliable</span></div>
            <div className="hero-schedule"><span className="schedule-icon"><Plane size={21} /></span><div><strong>WE SHIP 5 TIMES PER WEEK!</strong><span>Fast, consistent departures from the U.S.</span></div><div className="schedule-divider" /><div className="schedule-fast"><strong>24–48 <small>HRS</small></strong><span>FAST SHIPPING</span></div></div>
            <div className="hero-actions"><Link href="/quote" className="button button-lime button-large">Get a quote <ArrowUpRight size={18} /></Link><a href="https://wa.me/18764264516" className="button button-outline-light button-large" target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={17} /></a></div>
            <Link href="/dashboard" className="hero-login"><span className="hero-login-icon"><Box size={16} /></span>Already shipping with us? <strong>Customer login</strong><ArrowRight size={15} /></Link>
          </div>
          <div className="hero-proof-card"><div className="hero-proof-card-top"><span><span className="live-dot" /> SHIPMENT ACTIVITY</span><ArrowUpRight size={16} /></div><div className="hero-route-top"><div><span className="hero-route-point">MIA</span><strong>Miami</strong><small>United States</small></div><div className="hero-route-graphic"><span className="route-plane"><Plane size={17} /></span><div className="route-dash-line" /><span className="route-jm-dot" /></div><div className="hero-route-destination"><span className="hero-route-point hero-route-point-green">KIN</span><strong>Kingston</strong><small>Jamaica</small></div></div><div className="hero-card-progress"><div><span>Today&apos;s route</span><strong>On schedule <span className="progress-live-dot" /></strong></div><div className="mini-progress"><span /></div><div className="hero-card-bottom"><span><Clock3 size={14} /> 24–48 hours</span><span><ShieldCheck size={14} /> Tracked & secure</span></div></div></div>
          <div className="hero-scroll-note"><span /> BUILT AROUND YOUR JOURNEY</div>
        </div>
      </section>
      <div className="value-strip"><div className="page-container value-strip-inner"><span className="value-lead">THAT’S THE SHIP FUSION PROMISE</span><div className="value-word">FAST <i>✳</i></div><div className="value-word">EASY <i>✳</i></div><div className="value-word">AFFORDABLE <i>✳</i></div><div className="value-word">RELIABLE <i>✳</i></div><Link href="/services" className="value-more">Why Ship Fusion <ArrowRight size={15} /></Link></div></div>
      <section className="home-services section-pad" id="services"><div className="page-container"><div className="home-section-top"><SectionHeading eyebrow="A BETTER WAY TO SHIP" title={<>We take the worry<br />out of <span>getting it there.</span></>} description="From your online cart to your doorstep, our team makes shipping between the U.S. and Jamaica feel easy." /><Link className="text-link desktop-service-link" href="/services">Explore all services <ArrowRight size={16} /></Link></div><div className="service-card-grid home-service-grid">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div><div className="service-promise-line"><div className="promise-shield"><ShieldCheck size={20} /></div><p><strong>We don’t just ship packages.</strong> We deliver reliability, convenience & peace of mind.</p><Link href="/services">Meet your shipping partner <ArrowRight size={15} /></Link></div></div></section>
      <section className="home-how section-pad"><div className="page-container"><div className="home-how-header"><div><span className="eyebrow eyebrow-light"><span /> EASY AS 1, 2, 3, 4</span><h2>One smooth journey.<br /><span>Four simple steps.</span></h2></div><p>We keep the process clear, so you can focus on what’s in the box—not how it gets there.</p></div><div className="home-steps">{processSteps.map(({ number, title, description, icon: Icon }, index) => <article className="home-step" key={number}><div className="home-step-head"><span>{number}</span><div className="home-step-icon"><Icon size={22} /></div>{index < processSteps.length - 1 && <div className="home-step-connector" />}</div><h3>{title}</h3><p>{description}</p></article>)}</div><div className="home-how-footer"><span><MapPin size={16} /> From the United States to anywhere in Jamaica</span><Link className="text-link text-link-light" href="/how-it-works">See how it works <ArrowRight size={16} /></Link></div></div></section>
      <section className="home-shipping section-pad"><div className="page-container"><div className="home-section-top"><SectionHeading eyebrow="THE WAY YOU WANT TO SHIP" title={<>Air, sea, barrel, or<br /><span>container—it’s your call.</span></>} description="One reliable partner for every kind of shipment. Choose the option that fits your timeline and your load." /><Link className="text-link desktop-service-link" href="/shipping">Compare shipping options <ArrowRight size={16} /></Link></div><div className="shipping-card-grid">{shippingOptions.map(({ icon: Icon, title, text, tag }, index) => <article className={`shipping-card shipping-card-${index + 1}`} key={title}><div className="shipping-card-top"><span className="shipping-card-icon"><Icon size={22} /></span><span className="shipping-card-number">0{index + 1}</span></div><div><span className="shipping-card-tag">{tag}</span><h3>{title}</h3><p>{text}</p></div><Link href={`/quote?method=${encodeURIComponent(title)}`} aria-label={`Request a quote for ${title}`}><ArrowUpRight size={19} /></Link></article>)}</div></div></section>
      <section className="home-trust-band"><div className="page-container trust-band-grid"><div className="trust-band-copy"><span className="eyebrow eyebrow-light"><span /> THE SHIP FUSION PROMISE</span><h2>Good things are<br />on their way.</h2><p>Fast, easy, affordable, reliable—that&apos;s the Ship Fusion Promise. We care for your package like it has somewhere important to be.</p><Link href="/quote" className="button button-lime">Get started <ArrowUpRight size={17} /></Link></div><div className="trust-stat-grid"><div className="trust-stat"><span className="trust-stat-icon"><Clock3 size={21} /></span><strong>24–48<small>HOURS FAST</small></strong><p>Quick air freight from the U.S. to Jamaica.</p></div><div className="trust-stat"><span className="trust-stat-icon"><PackageCheck size={21} /></span><strong>5×<small>EVERY WEEK</small></strong><p>Frequent departures mean fewer long waits.</p></div><div className="trust-stat"><span className="trust-stat-icon"><BadgeCheck size={21} /></span><strong>ONE<small>TEAM TO TRUST</small></strong><p>Helpful support from first scan to delivery.</p></div><div className="trust-stat trust-stat-quote"><Quote size={22} /><p>“We don’t just ship packages… we deliver reliability, convenience & peace of mind!”</p><span>THE SHIP FUSION PROMISE</span></div></div></div></section>
      <section className="home-contact-cta"><div className="page-container home-contact-inner"><div className="home-contact-mark"><CircleHelp size={21} /></div><div><span className="eyebrow">WE’RE READY WHEN YOU ARE</span><h2>Questions about your shipment?</h2><p>Talk to a real person. We’ll help you find the right way to ship.</p></div><a className="button button-dark" href="https://wa.me/18764264516" target="_blank" rel="noreferrer">WhatsApp 876-426-4516 <ArrowUpRight size={17} /></a></div></section>
    </>
  );
}
