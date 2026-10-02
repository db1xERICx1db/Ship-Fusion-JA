"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import type { DemoPackage, ShipmentStatus } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";

const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const filters: ("All packages" | ShipmentStatus)[] = ["All packages", "Awaiting Package", "Received", "Processing", "Shipped", "In Transit", "Customs", "Ready for Delivery", "Delivered"];

export function PackageList({ items }: { items: DemoPackage[] }) {
  const [filter, setFilter] = useState<string>("All packages");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => (filter === "All packages" || item.status === filter) && `${item.id} ${item.description} ${item.method}`.toLowerCase().includes(query.toLowerCase())), [filter, items, query]);

  return (
    <div className="package-table-card">
      <div className="package-table-tools"><div className="package-search"><Search size={16} /><input aria-label="Search packages" placeholder="Search by tracking number or description" value={query} onChange={(event) => setQuery(event.target.value)} /></div><label className="package-filter"><SlidersHorizontal size={15} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter packages by status">{filters.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <div className="package-table-scroll"><table className="package-table"><thead><tr><th>Tracking number</th><th>Package</th><th>Method</th><th>Date received</th><th>Current location</th><th>Status</th><th>Est. arrival</th><th>Price</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><Link className="table-tracking-link" href={`/dashboard/packages/${item.id}`}>{item.id}<ArrowUpRight size={13} /></Link></td><td><Link className="table-package-link" href={`/dashboard/packages/${item.id}`}><strong>{item.description}</strong></Link></td><td>{item.method}</td><td>{item.dateReceived}</td><td>{item.location}</td><td><StatusBadge status={item.status} /></td><td>{item.eta}</td><td>{item.price > 0 ? usd(item.price) : "—"}</td><td><Link className="table-open-link" href={`/dashboard/packages/${item.id}`} aria-label={`View ${item.id}`}>View <ArrowUpRight size={14} /></Link></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="package-table-empty">No packages match that search. Try a different tracking number or status.</div>}
      <div className="package-table-foot"><span>Showing <strong>{filtered.length}</strong> of {items.length} demo shipments</span><span>All times shown in Jamaica Standard Time</span></div>
    </div>
  );
}
