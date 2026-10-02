import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Clock3, Container, Package, Plane, Ship, Truck } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { Eyebrow, SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Air, sea, barrel and container shipping" };

const options = [
  { number: "01", icon: Plane, title: "Air freight", marker: "FASTEST ROUTE", description: "When time matters, air freight gets your online orders and smaller packages moving fast. Typical delivery in 24–48 hours after departure.", details: ["Ideal for everyday online orders", "Frequent weekly departures", "Track from warehouse to Jamaica"], rate: "Best for speed" },
  { number: "02", icon: Ship, title: "Sea freight", marker: "GREAT VALUE", description: "A cost-conscious choice for heavier or larger shipments. Get the room you need and a friendly team handling the details.", details: ["Ideal for larger or heavier items", "Flexible consolidated shipments", "Clear updates as your cargo moves"], rate: "Best for bigger loads" },
  { number: "03", icon: Package, title: "Barrel shipping", marker: "PERSONAL SHIPMENTS", description: "Send household goods, personal items, and more with convenient barrel shipping and support through customs clearance.", details: ["Easy barrel and customs brokerage", "Careful handling at each stage", "Great for sending more at once"], rate: "Best for home & family" },
  { number: "04", icon: Container, title: "Container shipping", marker: "MORE ROOM TO MOVE", description: "For commercial cargo, household moves, and shipments that need more space. Tell us what you're moving and we'll plan a solution.", details: ["Flexible personal & commercial options", "Support for planning your shipment", "Shipping solutions for big or small"], rate: "Best for larger shipments" },
];

export default function ShippingPage() {
  return (
    <>
      <PageIntro eyebrow="CHOOSE YOUR ROUTE" title="The right way to ship, for everything you ship." description="A single package, a family barrel, or a larger commercial load—we have shipping options to match your priorities." />
      <section className="shipping-page-section"><div className="page-container"><div className="shipping-page-heading"><SectionHeading eyebrow="AIR · SEA · BARREL · CONTAINER" title={<>Different shipments.<br /><span>One trusted team.</span></>} description="We make getting packages from the U.S. to Jamaica feel straightforward. Choose a service, and we’ll help you take it from there." /></div><div className="shipping-option-list">{options.map(({ number, icon: Icon, title, marker, description, details, rate }) => <article className="shipping-option-card" key={title}><div className="shipping-option-left"><span className="shipping-option-number">{number}</span><div className="shipping-option-icon"><Icon size={25} /></div><span className="shipping-option-marker">{marker}</span><h2>{title}</h2><p>{description}</p></div><div className="shipping-option-right"><div className="shipping-option-details">{details.map((detail) => <span key={detail}><Check size={16} />{detail}</span>)}</div><div className="shipping-option-footer"><span><Clock3 size={15} />{rate}</span><Link className="button button-dark" href={`/quote?method=${encodeURIComponent(title)}`}>Request a quote <ArrowUpRight size={15} /></Link></div></div></article>)}</div></div></section>
      <section className="shipping-help-band"><div className="page-container shipping-help-inner"><div><Eyebrow light>NOT SURE WHICH ONE?</Eyebrow><h2>Tell us what you have in mind.</h2><p>We’ll help you choose the service that fits your shipment.</p></div><Link className="button button-lime" href="/contact">Talk to our team <ArrowUpRight size={17} /></Link></div></section>
      <section className="shipping-note"><div className="page-container"><span className="shipping-note-icon"><Truck size={20} /></span><p><strong>Every shipment gets our care.</strong> From secure handling in the U.S. to customs support and updates along the way, Ship Fusion is with you through the whole journey.</p></div></section>
    </>
  );
}
