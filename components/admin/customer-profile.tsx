"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Plus,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  ACTIVE_PACKAGE_STATUSES,
  DELIVERED_PACKAGE_STATUSES,
  formatDate,
  formatDateTime,
  formatUsd,
  getCustomerFinancials,
  getPackageBalance,
} from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { BalanceAdjustmentDialog } from "@/components/admin/balance-adjustment-dialog";
import { StatusBadge } from "@/components/admin/status-badge";

export function CustomerProfile({ customerId }: { customerId: string }) {
  const { database } = useAdminData();
  const [adjusting, setAdjusting] = useState(false);
  const [notice, setNotice] = useState("");
  const customer = database.customers.find((item) => item.id === customerId);
  const customerPackages = useMemo(() => database.packages.filter((item) => item.customerId === customerId).sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)), [customerId, database.packages]);
  const transactions = useMemo(() => database.balanceTransactions.filter((item) => item.customerId === customerId).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [customerId, database.balanceTransactions]);
  const payments = useMemo(() => database.payments.filter((item) => item.customerId === customerId).sort((a, b) => b.paidAt.localeCompare(a.paidAt)), [customerId, database.payments]);
  const relatedPackageIds = useMemo(() => new Set(customerPackages.map((item) => item.id)), [customerPackages]);
  const activity = useMemo(() => database.adminAuditLogs.filter((item) => item.customerId === customerId || (item.packageId && relatedPackageIds.has(item.packageId))).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [customerId, database.adminAuditLogs, relatedPackageIds]);

  if (!customer) {
    return <div className="admin-page"><Link className="admin-back-link" href="/admin/customers"><ArrowLeft size={15} /> Back to customers</Link><div className="admin-not-found-card"><span><UserRound size={22} /></span><h1>Customer not found</h1><p>This customer is not in the current demo dataset.</p><Link className="admin-primary-button" href="/admin/customers">Return to customers <ArrowRight size={15} /></Link></div></div>;
  }

  const financials = getCustomerFinancials(database, customerId);
  const activeCount = customerPackages.filter((item) => ACTIVE_PACKAGE_STATUSES.includes(item.status)).length;
  const deliveredCount = customerPackages.filter((item) => DELIVERED_PACKAGE_STATUSES.includes(item.status)).length;

  function showSavedNotice() {
    setAdjusting(false);
    setNotice("Balance adjustment saved to the account ledger.");
    window.setTimeout(() => setNotice(""), 4500);
  }

  return (
    <div className="admin-page admin-customer-profile-page">
      <div className="admin-profile-toolbar"><Link className="admin-back-link" href="/admin/customers"><ArrowLeft size={15} /> All customers</Link><span className="admin-profile-id">ACCOUNT #{customer.accountNumber}</span></div>
      <div className="admin-profile-heading"><div className="admin-profile-heading-main"><span className="admin-profile-avatar">{customer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><div className="admin-eyebrow"><span /> CUSTOMER PROFILE <i>·</i> SAMPLE RECORD</div><h1>{customer.name}<span>.</span></h1><p>Customer since {formatDate(customer.joinedAt, { year: "numeric" })} <i>·</i> {customer.accountStatus} account</p></div></div><div className="admin-profile-actions"><Link className="admin-outline-button" href={`/admin/packages?customer=${customer.id}`}><Box size={15} /> View packages <ArrowUpRight size={14} /></Link><button className="admin-primary-button" type="button" onClick={() => setAdjusting(true)}><Plus size={15} /> Adjust balance</button><a className="admin-outline-button" href="#payments"><CreditCard size={15} /> View payment history</a><a className="admin-outline-button" href="#activity"><Activity size={15} /> View account activity</a></div></div>

      {notice && <div className="admin-success-banner" role="status"><Check size={16} />{notice}</div>}

      <div className="admin-customer-overview-grid">
        <section className="admin-panel admin-contact-panel"><div className="admin-panel-heading"><div><span className="admin-section-kicker">CUSTOMER</span><h2>Contact information</h2></div><span className="admin-profile-status"><i />{customer.accountStatus}</span></div><div className="admin-contact-details"><div><span><Mail size={14} /> EMAIL</span><a href={`mailto:${customer.email}`}>{customer.email}</a></div><div><span><Phone size={14} /> PHONE</span><a href={`tel:${customer.phone.replace(/[^+\d]/g, "")}`}>{customer.phone}</a></div><div><span><MapPin size={14} /> DELIVERY ADDRESS</span><strong>{customer.address}</strong></div><div><span><CalendarDays size={14} /> MEMBER SINCE</span><strong>{formatDate(customer.joinedAt)}</strong></div></div></section>
        <section className="admin-panel admin-account-summary-panel"><div className="admin-account-summary-head"><span className="admin-account-summary-icon"><CircleDollarSign size={19} /></span><div><span className="admin-section-kicker">ACCOUNT BALANCE</span><p>Ledger-derived current balance</p></div></div><strong className="admin-account-balance-value">{formatUsd(financials.currentBalance)}</strong><div className="admin-balance-helper"><span>{financials.currentBalance > 0 ? "Outstanding amount" : financials.currentBalance < 0 ? "Credit on account" : "Account settled"}</span><strong>{formatUsd(financials.outstandingAmount)}</strong></div><button type="button" className="admin-adjust-inline" onClick={() => setAdjusting(true)}><Plus size={14} /> Add account transaction</button></section>
      </div>

      <section className="admin-financial-metrics" aria-label="Customer account summary"><article><span>Current balance</span><strong>{formatUsd(financials.currentBalance)}</strong><small>Sum of all ledger entries</small></article><article><span>Total shipping charges</span><strong>{formatUsd(financials.shippingCharges)}</strong><small>Across linked packages</small></article><article><span>Total payments</span><strong>{formatUsd(financials.totalPayments)}</strong><small>Recorded payments</small></article><article><span>Outstanding amount</span><strong className={financials.outstandingAmount > 0 ? "admin-outstanding-red" : "admin-outstanding-green"}>{formatUsd(financials.outstandingAmount)}</strong><small>Amount currently due</small></article></section>

      <section className="admin-panel admin-profile-packages-panel"><div className="admin-panel-heading admin-profile-section-heading"><div><span className="admin-section-kicker">SHIPMENT OVERVIEW</span><h2>Packages <small>{customerPackages.length}</small></h2><p>{activeCount} active <i>·</i> {deliveredCount} delivered</p></div><Link className="admin-panel-link" href={`/admin/packages?customer=${customer.id}`}>View package manager <ArrowUpRight size={14} /></Link></div><div className="admin-table-scroll"><table className="admin-data-table admin-profile-package-table"><thead><tr><th>Tracking number</th><th>Package</th><th>Method</th><th>Status</th><th>Package balance</th><th>Last updated</th><th /></tr></thead><tbody>{customerPackages.map((item) => <tr key={item.id}><td><Link className="admin-tracking-link" href={`/admin/packages?search=${item.id}`}>{item.id}</Link></td><td>{item.description}</td><td>{item.method}</td><td><StatusBadge status={item.status} /></td><td><strong className={getPackageBalance(item) > 0 ? "admin-table-balance-due" : "admin-table-balance-clear"}>{formatUsd(getPackageBalance(item))}</strong></td><td>{formatDateTime(item.lastUpdated)}</td><td><Link href={`/admin/packages?search=${item.id}`} className="admin-row-action" aria-label={`Open ${item.id} in package manager`}><ArrowUpRight size={14} /></Link></td></tr>)}{customerPackages.length === 0 && <tr><td className="admin-table-empty" colSpan={7}>No package records are linked to this account yet.</td></tr>}</tbody></table></div></section>

      <div className="admin-profile-history-grid">
        <section className="admin-panel admin-history-panel" id="payments"><div className="admin-panel-heading"><div><span className="admin-section-kicker">PAYMENT HISTORY</span><h2>Payments <small>{payments.length}</small></h2><p>Completed and recorded account payments.</p></div><span className="admin-panel-icon admin-panel-icon-soft"><CreditCard size={17} /></span></div><div className="admin-payment-list">{payments.map((payment) => <div className="admin-payment-row" key={payment.id}><span className="admin-payment-icon"><ReceiptText size={16} /></span><span className="admin-payment-copy"><strong>{payment.method}</strong><small>{payment.reference} <i>·</i> {payment.note}</small><time>{formatDateTime(payment.paidAt)} <i>·</i> by {payment.recordedBy}</time></span><span className="admin-payment-amount">{formatUsd(payment.amount)}<small className={`admin-payment-status admin-payment-${payment.status.toLowerCase()}`}>{payment.status}</small></span></div>)}{payments.length === 0 && <div className="admin-empty-state">Payments recorded for this account will appear here.</div>}</div><div className="admin-history-foot"><span><ShieldCheck size={13} /> Payment records are linked to balance transactions.</span></div></section>

        <section className="admin-panel admin-history-panel" id="balance-history"><div className="admin-panel-heading"><div><span className="admin-section-kicker">AUDITABLE LEDGER</span><h2>Balance history <small>{transactions.length}</small></h2><p>Every charge, fee, payment, and adjustment.</p></div><button className="admin-compact-action" type="button" onClick={() => setAdjusting(true)}><Plus size={13} /> Add entry</button></div><div className="admin-ledger-list">{transactions.map((transaction) => <div className="admin-ledger-row" key={transaction.id}><span className={`admin-ledger-mark ${transaction.amount > 0 ? "admin-ledger-plus" : "admin-ledger-minus"}`}>{transaction.amount > 0 ? "+" : "−"}</span><span className="admin-ledger-copy"><span><strong>{transaction.description}</strong><i className="admin-transaction-type">{transaction.type}</i></span><small>{transaction.adminName} <i>·</i> {formatDateTime(transaction.occurredAt)}</small>{transaction.adminNote && <small className="admin-ledger-note">Note: {transaction.adminNote}</small>}</span><strong className={transaction.amount > 0 ? "admin-amount-positive" : "admin-amount-negative"}>{transaction.amount > 0 ? "+" : "−"}{formatUsd(Math.abs(transaction.amount))}</strong></div>)}{transactions.length === 0 && <div className="admin-empty-state">No balance transactions are recorded for this account.</div>}</div></section>
      </div>

      <section className="admin-panel admin-account-activity-panel" id="activity"><div className="admin-panel-heading"><div><span className="admin-section-kicker">RECENT ACTIVITY</span><h2>Account activity <small>{activity.length}</small></h2><p>Administrative actions related to this customer and their packages.</p></div><Link className="admin-panel-link" href="/admin/activity">Open full audit log <ArrowUpRight size={14} /></Link></div><div className="admin-account-activity-list">{activity.slice(0, 8).map((entry) => <div className="admin-account-activity-row" key={entry.id}><span className="admin-activity-dot"><Activity size={14} /></span><span><strong>{entry.adminName} {entry.action}</strong><small>{entry.objectType === "package" ? entry.objectId : `Account #${customer.accountNumber}`} <i>·</i> {entry.previousValue} → {entry.newValue}</small>{entry.note && <small className="admin-activity-note">{entry.note}</small>}</span><time><Clock3 size={12} />{formatDateTime(entry.occurredAt)}</time></div>)}{activity.length === 0 && <div className="admin-empty-state">Account activity will appear here when an administrative action is recorded.</div>}</div></section>

      <div className="admin-financial-integrity-note"><span><ShieldCheck size={17} /></span><div><strong>Account balance is calculated from the ledger.</strong><p>There is no direct balance field to overwrite. New entries are associated with the signed-in admin and added to the audit log.</p></div><Link href={`/admin/activity?customer=${customer.id}`}>View audit log <ArrowRight size={14} /></Link></div>

      {adjusting && <BalanceAdjustmentDialog customer={customer} onClose={() => setAdjusting(false)} onSaved={showSavedNotice} />}
    </div>
  );
}
