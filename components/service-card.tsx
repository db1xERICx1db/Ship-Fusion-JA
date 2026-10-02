import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({ icon: Icon, title, description, accent = "blue" }: { icon: LucideIcon; title: string; description: string; accent?: string }) {
  return (
    <article className="service-card">
      <div className={`service-icon service-icon-${accent}`}><Icon size={22} strokeWidth={1.8} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="card-arrow" href="/quote" aria-label={`Get a quote for ${title}`}><ArrowUpRight size={17} /></Link>
    </article>
  );
}
