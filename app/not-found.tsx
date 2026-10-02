import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Home, PackageSearch, SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found. Head back to Ship Fusion Jamaica to track a package or request a quote.",
};

const quickLinks = [
  { href: "/services", label: "Our services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/shipping", label: "Shipping options" },
  { href: "/quote", label: "Request a quote" },
  { href: "/contact", label: "Contact support" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="not-found-page">
          <div className="page-container not-found-inner">
            <div className="not-found-copy">
              <div className="hero-eyebrow"><span className="live-dot" /> ERROR 404 · DESTINATION UNKNOWN</div>
              <h1><span>THIS PAGE MISSED</span><em>ITS FLIGHT.</em></h1>
              <p>
                The link you followed doesn&apos;t match anything on our manifest. It may have been moved,
                renamed, or never left the dock—but your shipment tracking is still right where you left it.
              </p>
              <div className="not-found-actions">
                <Link className="button button-lime button-large" href="/"><Home size={17} /> Back to home</Link>
                <Link className="button button-outline-light button-large" href="/dashboard/packages"><PackageSearch size={17} /> Track a package</Link>
              </div>
              <div className="not-found-links">
                <span>Popular routes</span>
                {quickLinks.map(({ href, label }) => (
                  <Link key={href} href={href}>{label} <ArrowRight size={13} /></Link>
                ))}
              </div>
            </div>

            <div className="not-found-card">
              <div className="not-found-card-top"><span><span className="live-dot" /> SHIPMENT SCAN</span><SearchX size={16} /></div>
              <div className="not-found-route">
                <div><span className="not-found-point">MIA</span><strong>Miami</strong><small>United States</small></div>
                <div className="not-found-route-line"><span /><i>?</i><span /></div>
                <div className="not-found-destination"><span className="not-found-point not-found-point-muted">???</span><strong>Off the manifest</strong><small>No matching page</small></div>
              </div>
              <div className="not-found-card-rows">
                <div><span>Scan result</span><strong>404 — not found</strong></div>
                <div><span>Searched</span><strong>Every route in the system</strong></div>
              </div>
              <Link className="not-found-card-link" href="/contact">Need a hand? Talk to the team <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
