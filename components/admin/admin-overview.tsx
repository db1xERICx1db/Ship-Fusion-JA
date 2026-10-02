"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  PackageCheck,
  Plane,
  ShieldAlert,
  Truck,
  UsersRound,
} from "lucide-react";
import {
  ACTIVE_PACKAGE_STATUSES,
  CANCELLED_PACKAGE_STATUSES,
  CUSTOMS_PACKAGE_STATUSES,
  DELIVERED_PACKAGE_STATUSES,
  DELIVERY_QUEUE_STATUSES,
  formatDateTime,
  formatUsd,
  getCustomerBalance,
  HELD_PACKAGE_STATUSES,
  IN_TRANSIT_PACKAGE_STATUSES,
  PACKAGE_STATUS_GROUPS,
  SHIPPING_METHODS,
} from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";

export function AdminOverview() {
  const { database } = useAdminData();
  const activePackages = database.packages.filter((item) => ACTIVE_PACKAGE_STATUSES.includes(item.status)).length;
  const inTransit = database.packages.filter((item) => IN_TRANSIT_PACKAGE_STATUSES.includes(item.status)).length;
  const customs = database.packages.filter((item) => CUSTOMS_PACKAGE_STATUSES.includes(item.status)).length;
  const readyForDelivery = database.packages.filter((item) => DELIVERY_QUEUE_STATUSES.includes(item.status)).length;
  const delivered = database.packages.filter((item) => DELIVERED_PACKAGE_STATUSES.includes(item.status)).length;
  const outstanding = database.customers.reduce((total, customer) => total + Math.max(getCustomerBalance(database, customer.id), 0), 0);
  const packageValue = database.packages.filter((item) => !CANCELLED_PACKAGE_STATUSES.includes(item.status)).reduce((total, item) => total + item.declaredValue, 0);
  const latestUpdates = [...database.packageStatusHistory].sort((a, b) => b.changedAt.localeCompare(a.changedAt)).slice(0, 6);
  const largestBar = Math.max(...PACKAGE_STATUS_GROUPS.map(({ statuses }) => database.packages.filter((item) => statuses.includes(item.status)).length), 1);
  const methodRows = SHIPPING_METHODS.map((method) => ({ method, count: database.packages.filter((item) => item.method === method).length }));
  const largestMethod = Math.max(...methodRows.map((item) => item.count), 1);

  const metrics = [
    { label: "Total customers", value: database.customers.length.toString(), hint: "Active demo accounts", icon: UsersRound, tone: "blue" },
    { label: "Active packages", value: activePackages.toString(), hint: "All open shipments", icon: Box, tone: "lime" },
    { label: "Packages in transit", value: inTransit.toString(), hint: "Moving between facilities", icon: Plane, tone: "blue" },
    { label: "Awaiting customs", value: customs.toString(), hint: "Needs clearance", icon: ShieldAlert, tone: "amber" },
    { label: "Ready for delivery", value: readyForDelivery.toString(), hint: "Pickup or last-mile", icon: Truck, tone: "violet" },
    { label: "Delivered packages", value: delivered.toString(), hint: "Successfully completed", icon: PackageCheck, tone: "green" },
    { label: "Outstanding balances", value: formatUsd(outstanding), hint: "Derived from account ledger", icon: CreditCard, tone: "amber" },
    { label: "Total package value", value: formatUsd(packageValue), hint: "Declared value · active + delivered", icon: DollarSign, tone: "lime" },
  ];

  return (
    <div className="admin-page admin-overview-page">
      <div className="admin-page-heading admin-overview-heading">
        <div><div className="admin-eyebrow"><span /> OPERATIONS SUMMARY <i>·</i> OCTOBER 2026</div><h1>Good morning, Alex<span>.</span></h1><p>Here’s what’s moving across Ship Fusion Jamaica today.</p></div>
        <div className="admin-heading-actions"><span className="admin-demo-pill"><i /> Fictional demo data</span><Link className="admin-primary-button" href="/admin/packages">Manage packages <ArrowRight size={15} /></Link></div>
      </div>

      <div className="admin-demo-notice"><span><ShieldAlert size={16} /></span><p><strong>Demo workspace.</strong> Records and account activity are fictional and saved only in this browser. Status, balance, and package edits are added to the audit trail.</p><span className="admin-demo-notice-tag">NOT LIVE OPERATIONS</span></div>

      <section className="admin-stat-grid" aria-label="Admin dashboard metrics">
        {metrics.map(({ label, value, hint, icon: Icon, tone }) => <article key={label} className="admin-stat-card"><div className="admin-stat-card-top"><span>{label}</span><i className={`admin-stat-icon admin-stat-${tone}`}><Icon size={17} /></i></div><strong className={label.includes("Balances") || label.includes("value") ? "admin-stat-currency" : ""}>{value}</strong><small>{hint}</small></article>)}
      </section>

      <div className="admin-overview-grid">
        <section className="admin-panel admin-pipeline-panel">
          <div className="admin-panel-heading"><div><span className="admin-section-kicker">PACKAGE FLOW</span><h2>Current pipeline</h2><p>Every package, grouped by its latest status.</p></div><span className="admin-panel-icon"><ChartNoAxesColumnIncreasing size={18} /></span></div>
          <div className="admin-pipeline-chart" role="img" aria-label="Current package counts by shipping stage">
            {PACKAGE_STATUS_GROUPS.map(({ label, statuses, tone }) => {
              const count = database.packages.filter((item) => statuses.includes(item.status)).length;
              return <div className="admin-pipeline-row" key={label}><div className="admin-pipeline-label"><span>{label}</span><strong>{count}</strong></div><div className="admin-pipeline-track"><span className={`admin-pipeline-fill admin-fill-${tone}`} style={{ width: `${count === 0 ? 0 : Math.max((count / largestBar) * 100, 8)}%` }} /></div></div>;
            })}
          </div>
          <div className="admin-pipeline-footer"><span><i className="admin-chart-dot" /> {database.packages.length} package records</span><span>{database.packages.filter((item) => HELD_PACKAGE_STATUSES.includes(item.status)).length} on hold <i>·</i> {database.packages.filter((item) => CANCELLED_PACKAGE_STATUSES.includes(item.status)).length} cancelled</span></div>
        </section>

        <section className="admin-panel admin-method-panel">
          <div className="admin-panel-heading"><div><span className="admin-section-kicker">SHIPPING MIX</span><h2>By method</h2><p>Package volume by service selected.</p></div><span className="admin-panel-icon admin-panel-icon-soft"><Plane size={18} /></span></div>
          <div className="admin-method-chart">
            {methodRows.map(({ method, count }, index) => <div className="admin-method-row" key={method}><div className="admin-method-row-title"><span><i className={`admin-method-swatch admin-method-swatch-${index + 1}`} />{method}</span><strong>{count}<small> / {database.packages.length}</small></strong></div><div className="admin-method-track"><span className={`admin-method-fill admin-method-fill-${index + 1}`} style={{ width: `${count === 0 ? 0 : Math.max((count / largestMethod) * 100, 8)}%` }} /></div></div>)}
          </div>
          <Link href="/admin/packages" className="admin-panel-link">View all packages <ArrowUpRight size={14} /></Link>
        </section>
      </div>

      <section className="admin-panel admin-updates-panel">
        <div className="admin-panel-heading admin-updates-heading"><div><span className="admin-section-kicker">LIVE TRACKING ACTIVITY</span><h2>Recent package updates</h2><p>The latest status changes recorded by the operations team.</p></div><Link href="/admin/activity" className="admin-panel-link">Full activity log <ArrowUpRight size={14} /></Link></div>
        <div className="admin-updates-list">
          {latestUpdates.map((update) => {
            const item = database.packages.find((entry) => entry.id === update.packageId);
            const customer = database.customers.find((entry) => entry.id === item?.customerId);
            if (!item) return null;
            return <Link className="admin-update-row" href="/admin/packages" key={update.id}><span className="admin-update-icon"><PackageCheck size={16} /></span><span className="admin-update-copy"><strong>{item.id}<i> · </i>{item.description}</strong><small>{customer?.name ?? "Customer"} <b>·</b> {update.previousStatus ? `${update.previousStatus} → ` : ""}{update.newStatus}</small></span><span className="admin-update-admin">{update.adminName}</span><time>{formatDateTime(update.changedAt)}</time><ArrowUpRight className="admin-update-arrow" size={15} /></Link>;
          })}
          {latestUpdates.length === 0 && <div className="admin-empty-state">Package updates will appear here when a status is changed.</div>}
        </div>
        <div className="admin-updates-bottom"><span><Clock3 size={14} /> All timestamps are shown in your browser’s local time.</span><Link href="/admin/packages">Open package manager <ArrowRight size={14} /></Link></div>
      </section>

      <section className="admin-cashflow-note"><span><CheckCircle2 size={17} /></span><div><strong>Balances are ledger-based, not overwritten.</strong><p>Charges, payments, credits, refunds, and fees are stored as individual transactions.</p></div><Link href="/admin/customers">Review customer accounts <ArrowRight size={14} /></Link><ArrowDownRight className="admin-cashflow-watermark" size={44} />
    </section>
    </div>
  );
}
