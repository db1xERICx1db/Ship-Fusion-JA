"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, FileClock, Filter, Search, ShieldCheck } from "lucide-react";
import { AdminAuditLog, formatDateTime } from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";

const actionFilters = ["All activity", "Package status", "Package edits", "Balance adjustments", "Payments"] as const;
type ActionFilter = (typeof actionFilters)[number];

export function AdminActivityLog() {
  const { database } = useAdminData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActionFilter>("All activity");
  const logs = useMemo(() => [...database.adminAuditLogs].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).filter((entry) => {
    const customer = database.customers.find((item) => item.id === entry.customerId);
    const searchText = `${entry.adminName} ${entry.action} ${entry.objectId} ${entry.previousValue} ${entry.newValue} ${entry.note} ${customer?.name ?? ""} ${customer?.accountNumber ?? ""}`.toLowerCase();
    const matchesQuery = searchText.includes(query.trim().toLowerCase());
    const matchesFilter = filter === "All activity"
      || (filter === "Package status" && entry.action === "updated package status")
      || (filter === "Package edits" && entry.action === "edited package information")
      || (filter === "Balance adjustments" && entry.objectType === "customer")
      || (filter === "Payments" && entry.objectType === "payment");
    return matchesQuery && matchesFilter;
  }), [database.adminAuditLogs, database.customers, filter, query]);

  return (
    <div className="admin-page admin-activity-page">
      <div className="admin-page-heading"><div><div className="admin-eyebrow"><span /> GOVERNANCE <i>·</i> STAFF ACTIONS</div><h1>Activity log<span>.</span></h1><p>A reviewable record of important package and account changes.</p></div><span className="admin-audit-protected"><ShieldCheck size={15} /> ADMIN-ONLY RECORD</span></div>
      <div className="admin-audit-banner"><span><FileClock size={17} /></span><p><strong>Audit history is append-only in the demo workflow.</strong> Status updates, package edits, and balance transactions retain the admin, timestamp, previous value, new value, and an optional reason.</p><span className="admin-audit-count">{database.adminAuditLogs.length} RECORDS</span></div>
      <section className="admin-panel admin-audit-panel">
        <div className="admin-table-panel-heading"><div><span className="admin-section-kicker">ADMIN AUDIT LOG</span><h2>Administrative actions <small>{logs.length}</small></h2><p>Search for an admin, account, tracking ID, action, or reason.</p></div><span className="admin-audit-last-updated"><Activity size={14} /> Live demo log</span></div>
        <div className="admin-audit-toolbar"><label className="admin-search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search audit history…" aria-label="Search admin audit log" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label><label className="admin-audit-filter"><Filter size={14} /><select value={filter} onChange={(event) => setFilter(event.target.value as ActionFilter)}>{actionFilters.map((option) => <option key={option}>{option}</option>)}</select></label></div>
        <div className="admin-table-scroll"><table className="admin-data-table admin-audit-table"><thead><tr><th>Date / time</th><th>Admin</th><th>Action</th><th>Object affected</th><th>Previous value</th><th>New value</th><th>Reason / note</th></tr></thead><tbody>{logs.map((entry) => <AuditRow entry={entry} key={entry.id} />)}{logs.length === 0 && <tr><td colSpan={7} className="admin-table-empty">No administrative records match this search or filter.</td></tr>}</tbody></table></div>
        <div className="admin-table-foot"><span>Showing <strong>{logs.length}</strong> of <strong>{database.adminAuditLogs.length}</strong> audit records</span><span><ShieldCheck size={13} /> Read-only activity view</span></div>
      </section>
      <div className="admin-audit-footnote"><ShieldCheck size={15} /><p><strong>Designed for accountability.</strong> When a production data source is connected, keep these events server-written and access-controlled. Browser-only storage in this demo is not a production audit log.</p></div>
    </div>
  );
}

function AuditRow({ entry }: { entry: AdminAuditLog }) {
  const { database } = useAdminData();
  const customer = database.customers.find((item) => item.id === entry.customerId);
  const objectHref = entry.packageId ? `/admin/packages?search=${entry.packageId}` : customer ? `/admin/customers/${customer.id}` : "/admin/activity";
  const objectLabel = entry.packageId ? entry.packageId : customer ? `Account #${customer.accountNumber} · ${customer.name}` : entry.objectId;
  return <tr><td><span className="admin-audit-date">{formatDateTime(entry.occurredAt)}</span></td><td><span className="admin-audit-admin"><i>{entry.adminName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</i>{entry.adminName}</span></td><td><span className={`admin-audit-action-pill admin-audit-action-${entry.objectType}`}>{entry.action}</span></td><td><Link href={objectHref} className="admin-audit-object-link">{objectLabel}<ArrowUpRight size={11} /></Link></td><td><span className="admin-audit-value">{entry.previousValue || "—"}</span></td><td><span className="admin-audit-value admin-audit-new-value">{entry.newValue || "—"}</span></td><td><span className="admin-audit-note">{entry.note || "—"}</span></td></tr>;
}
