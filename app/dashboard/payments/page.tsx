import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CreditCard, Download, ReceiptText, WalletCards } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PayNowButton } from "@/components/pay-now-button";

export const metadata: Metadata = { title: "Payments & billing", robots: { index: false, follow: false } };
const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const invoices = [
  { id: "SFJ-INV-10218", tracking: "SFJ-2026-10482", description: "Electronics Package", date: "Sep 30, 2026", method: "—", amount: 99, status: "Balance due" as const },
  { id: "SFJ-INV-10047", tracking: "SFJ-2026-10140", description: "Personal Care Supplies", date: "Sep 15, 2026", method: "—", amount: 140, status: "Balance due" as const },
  { id: "SFJ-INV-09122", tracking: "SFJ-2026-10397", description: "Home & Kitchen Box", date: "Sep 28, 2026", method: "Visa •••• 4821", amount: 70, status: "Paid" as const },
  { id: "SFJ-INV-09025", tracking: "SFJ-2026-10261", description: "Sneakers & Apparel", date: "Sep 25, 2026", method: "Visa •••• 4821", amount: 46, status: "Paid" as const },
];

export default function PaymentsPage() {
  const outstanding = 239;
  return (
    <div className="dashboard-page payments-page">
      <div className="dashboard-page-heading"><div><div className="dashboard-kicker"><CreditCard size={14} /> ACCOUNT FINANCES</div><h1>Payments & billing<span>.</span></h1><p>A clear view of shipment charges and your payment history.</p></div><span className="sample-data-chip"><span /> SAMPLE ACCOUNT DATA</span></div>
      <div className="billing-summary-grid"><article className="billing-outstanding-card"><div className="billing-card-top"><span className="billing-card-label">OUTSTANDING BALANCE</span><span className="billing-icon billing-icon-light"><WalletCards size={18} /></span></div><strong>{usd(outstanding)}</strong><p>Across 2 open invoices</p><PayNowButton amount={usd(outstanding)} /><span className="billing-card-foot"><span /> Payment demo only · No charge will be made</span></article><article className="billing-stat-card"><span className="billing-stat-icon"><ReceiptText size={18} /></span><span className="billing-card-label">TOTAL SHIPPING COSTS</span><strong>{usd(355)}</strong><p>Across 4 processed packages</p><Link href="/dashboard/packages">View shipments <ArrowRight size={14} /></Link></article><article className="billing-stat-card billing-stat-green"><span className="billing-stat-icon"><Check size={18} /></span><span className="billing-card-label">PREVIOUS PAYMENTS</span><strong>{usd(116)}</strong><p>2 completed payments</p><span className="billing-card-caption">Most recent · Sep 28, 2026</span></article></div>
      <div className="billing-payment-tip"><span className="billing-tip-icon"><CreditCard size={17} /></span><p><strong>Secure checkout, when connected.</strong> Your live account will let you pay outstanding balances online. This sample dashboard does not process payments.</p><Link href="/contact">Payment help <ArrowUpRight size={14} /></Link></div>
      <div className="billing-table-heading"><div><span className="dashboard-kicker">YOUR ACCOUNT ACTIVITY</span><h2>Invoices & payments</h2></div><button className="billing-download"><Download size={15} /> Export history</button></div>
      <div className="billing-table-card"><div className="billing-table-wrap"><table className="billing-table"><thead><tr><th>Invoice</th><th>Shipment</th><th>Date</th><th>Payment method</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.id}</strong><small>Shipping invoice</small></td><td><Link href={`/dashboard/packages/${invoice.tracking}`}>{invoice.description}<small>{invoice.tracking}</small></Link></td><td>{invoice.date}</td><td>{invoice.method}</td><td className="billing-amount">{usd(invoice.amount)}</td><td><StatusBadge status={invoice.status} /></td><td>{invoice.status === "Paid" ? <span className="invoice-receipt"><Download size={14} /> Receipt</span> : <Link className="invoice-pay" href={`/dashboard/packages/${invoice.tracking}`}>Pay <ArrowUpRight size={13} /></Link>}</td></tr>)}</tbody></table></div><div className="billing-table-foot"><span>4 invoices in sample account</span><span>Amounts shown in USD</span></div></div>
    </div>
  );
}
