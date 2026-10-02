import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Box, PackagePlus, Plus } from "lucide-react";
import { packages } from "@/lib/demo-data";
import { PackageList } from "@/components/package-list";

export const metadata: Metadata = { title: "My packages", robots: { index: false, follow: false } };

export default function PackagesPage() {
  const delivered = packages.filter((item) => item.status === "Delivered").length;
  const inProgress = packages.filter((item) => !["Delivered", "Awaiting Package"].includes(item.status)).length;
  const awaiting = packages.filter((item) => item.status === "Awaiting Package").length;
  return (
    <div className="dashboard-page packages-page">
      <div className="dashboard-page-heading"><div><div className="dashboard-kicker"><Box size={14} /> PACKAGE MANAGEMENT</div><h1>My packages<span>.</span></h1><p>Every shipment in one place, with clear updates along the way.</p></div><Link className="button button-dark" href="/quote"><PackagePlus size={17} /> Add a shipment <ArrowUpRight size={15} /></Link></div>
      <div className="packages-summary"><div><span className="summary-card-icon"><Box size={18} /></span><div><strong>{packages.length.toString().padStart(2, "0")}</strong><span>Total shipments</span></div></div><div><span className="summary-card-icon summary-card-icon-green"><PackagePlus size={18} /></span><div><strong>{inProgress.toString().padStart(2, "0")}</strong><span>In progress</span></div></div><div><span className="summary-card-icon summary-card-icon-dark"><Plus size={18} /></span><div><strong>{awaiting.toString().padStart(2, "0")}</strong><span>Awaiting receipt</span></div></div><div><span className="summary-card-icon summary-card-icon-lime"><PackagePlus size={18} /></span><div><strong>{delivered.toString().padStart(2, "0")}</strong><span>Delivered</span></div></div></div>
      <div className="package-list-heading"><div><h2>All shipments</h2><p>Click a tracking number to view its full shipment timeline.</p></div><span className="sample-data-chip">SAMPLE ACCOUNT DATA</span></div>
      <PackageList items={packages} />
      <div className="packages-help"><div className="packages-help-icon"><Box size={19} /></div><div><strong>Expecting another package?</strong><p>Add the tracking number in your account so we can match it when it arrives at our U.S. location.</p></div><Link href="/contact">How do I add a package? <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}
