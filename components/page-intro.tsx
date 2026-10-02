import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/section-heading";

export function PageIntro({ eyebrow, title, description, action = true }: { eyebrow: string; title: string; description: string; action?: boolean }) {
  return (
    <section className="page-intro">
      <div className="page-container page-intro-inner">
        <div className="page-intro-copy">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{description}</p>
          {action && <div className="page-intro-actions"><Link className="button button-lime" href="/quote">Request a quote <ArrowUpRight size={17} /></Link><Link className="intro-text-link" href="/how-it-works">How it works <ArrowRight size={16} /></Link></div>}
        </div>
        <div className="page-intro-route"><span className="route-dot route-dot-us" /><span className="route-line" /><span className="route-dot route-dot-jm" /><div className="route-label route-label-us">UNITED STATES</div><div className="route-label route-label-jm">JAMAICA</div></div>
        <div className="intro-decor intro-decor-one" /><div className="intro-decor intro-decor-two" />
      </div>
    </section>
  );
}
