import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-top">
          <div className="footer-brand-block">
            <BrandMark light />
            <p>Your packages, our priority.<br />Fast, easy and reliable shipping from the U.S. to Jamaica.</p>
            <div className="footer-socials">
              <a aria-label="Ship Fusion Jamaica on Instagram" href="https://instagram.com/ShipFusionJA" target="_blank" rel="noreferrer"><Instagram size={17} /></a>
              <a aria-label="Ship Fusion Jamaica on Facebook" href="https://facebook.com/ShipFusionJA" target="_blank" rel="noreferrer"><Facebook size={17} /></a>
            </div>
          </div>
          <div className="footer-links-column"><h3>Explore</h3><Link href="/services">Our services</Link><Link href="/how-it-works">How it works</Link><Link href="/shipping">Shipping options</Link><Link href="/quote">Request a quote</Link></div>
          <div className="footer-links-column"><h3>Customer zone</h3><Link href="/dashboard">Customer login</Link><Link href="/dashboard/packages">Track a package</Link><Link href="/dashboard/payments">Payments & billing</Link><Link href="/contact">Contact support</Link></div>
          <div className="footer-contact-block"><h3>Let’s get it moving.</h3><a className="footer-phone" href="tel:+18764264516"><Phone size={16} /> 876-426-4516</a><span><MapPin size={15} /> U.S. to Jamaica</span><Link className="footer-cta" href="/quote">Get started <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Ship Fusion Jamaica. All rights reserved.</span><span>Fast. Easy. Affordable. Reliable.</span><span className="demo-footer-tag">Independent Jamaican freight forwarding</span></div>
      </div>
    </footer>
  );
}
