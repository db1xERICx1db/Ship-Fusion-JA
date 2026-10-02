import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3, Facebook, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Contact Ship Fusion Jamaica" };

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="WE’RE HERE FOR YOU" title="Let’s talk about your next shipment." description="Questions about a package, a quote, or the best way to ship? Our team is ready to help you get it sorted." action={false} />
      <section className="contact-page-section"><div className="page-container"><div className="contact-page-heading"><SectionHeading eyebrow="GET IN TOUCH" title={<>Good service starts with<br /><span>a real conversation.</span></>} description="Choose the channel that works best for you. We’re happy to help." /></div><div className="contact-page-grid">
        <a className="contact-main-card" href="https://wa.me/18764264516" target="_blank" rel="noreferrer"><div className="contact-card-top"><span className="contact-icon contact-whatsapp"><MessageCircle size={24} /></span><span className="contact-card-arrow"><ArrowUpRight size={18} /></span></div><span className="contact-card-eyebrow">FASTEST WAY TO REACH US</span><h2>Call or WhatsApp</h2><p>Get a quick answer from our customer-care team.</p><strong>876-426-4516</strong><span className="contact-card-bottom">Message our team <ArrowUpRight size={15} /></span></a>
        <div className="contact-detail-stack"><a className="contact-detail-card" href="mailto:hello@shipfusionja.com"><span className="contact-icon"><Mail size={21} /></span><div><span>Email us</span><strong>hello@shipfusionja.com</strong><small>We’ll get back to you as soon as we can.</small></div><ArrowUpRight size={17} /></a><div className="contact-detail-card"><span className="contact-icon"><Clock3 size={21} /></span><div><span>Business hours</span><strong>Monday – Saturday</strong><small>Hours may vary on holidays. Message us to confirm.</small></div></div><div className="contact-detail-card"><span className="contact-icon"><MapPin size={21} /></span><div><span>Our route</span><strong>United States → Jamaica</strong><small>Shipping across the island, from Kingston and beyond.</small></div></div></div>
      </div><div className="contact-social-row"><span>Follow the journey</span><a href="https://instagram.com/ShipFusionJA" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram <b>@ShipFusionJA</b> <ArrowUpRight size={14} /></a><a href="https://facebook.com/ShipFusionJA" target="_blank" rel="noreferrer"><Facebook size={17} /> Facebook <b>ShipFusionJA</b> <ArrowUpRight size={14} /></a></div></div></section>
      <section className="contact-bottom-cta"><div className="page-container contact-bottom-inner"><div><span className="eyebrow eyebrow-light"><span /> READY WHEN YOU ARE</span><h2>Have a shipment in mind?</h2></div><Link className="button button-lime" href="/quote">Request a quote <ArrowUpRight size={17} /></Link></div></section>
    </>
  );
}
