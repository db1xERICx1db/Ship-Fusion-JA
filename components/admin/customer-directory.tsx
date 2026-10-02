"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleDollarSign, Filter, Search, ShieldCheck, UsersRound } from "lucide-react";
import { ACTIVE_PACKAGE_STATUSES, DELIVERED_PACKAGE_STATUSES, formatUsd, getCustomerBalance } from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";

export function CustomerDirectory() {
  const { database } = useAdminData();
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("All accounts");
  const customers = useMemo(() => database.customers.filter((customer) => {
    const searchTarget = `${customer.name} ${customer.phone} ${customer.email} ${customer.accountNumber}`.toLowerCase();
    const matchesQuery = searchTarget.includes(query.trim().toLowerCase());
    const matchesStatus = accountFilter === "All accounts" || customer.accountStatus === accountFilter;
    return matchesQuery && matchesStatus;
  }), [accountFilter, database.customers, query]);
  const totalOutstanding = database.customers.reduce((sum, customer) => sum + Math.max(getCustomerBalance(database, customer.id), 0), 0);
  const reviewCount = database.customers.filter((customer) => customer.accountStatus === "Review").length;
  const activePackageCount = database.packages.filter((item) => ACTIVE_PACKAGE_STATUSES.includes(item.status)).length;

  return (
    <div className="admin-page admin-directory-page">
      <div className="admin-page-heading"><div><div className="admin-eyebrow"><span /> CUSTOMER ACCOUNTS <i>·</i> PRIVATE RECORDS</div><h1>Customers<span>.</span></h1><p>View customer activity and ledger-based account balances.</p></div><Link className="admin-outline-button" href="/admin/activity"><ShieldCheck size={15} /> Audit history <ArrowUpRight size={14} /></Link></div>
      <div className="admin-directory-stats"><article><span className="admin-directory-icon admin-directory-blue"><UsersRound size={17} /></span><div><strong>{database.customers.length}</strong><small>Customer accounts</small></div></article><article><span className="admin-directory-icon admin-directory-lime"><CircleDollarSign size={17} /></span><div><strong>{formatUsd(totalOutstanding)}</strong><small>Total outstanding</small></div></article><article><span className="admin-directory-icon admin-directory-amber"><Filter size={17} /></span><div><strong>{reviewCount}</strong><small>Accounts for review</small></div></article><article><span className="admin-directory-icon admin-directory-soft"><UsersRound size={17} /></span><div><strong>{activePackageCount}</strong><small>Active packages</small></div></article></div>

      <section className="admin-panel admin-customer-table-panel">
        <div className="admin-table-panel-heading"><div><span className="admin-section-kicker">CUSTOMER DIRECTORY</span><h2>Accounts <small>{customers.length}</small></h2><p>Select a customer to review profile, payments, balance history, and activity.</p></div><span className="admin-table-demo-tag"><i /> Demo customer data</span></div>
        <div className="admin-table-toolbar">
          <label className="admin-search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, email or account #" aria-label="Search customers" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label>
          <label className="admin-select-filter"><span>ACCOUNT STATUS</span><select value={accountFilter} onChange={(event) => setAccountFilter(event.target.value)}><option>All accounts</option><option>Active</option><option>Review</option><option>Inactive</option></select></label>
        </div>
        <div className="admin-table-scroll"><table className="admin-data-table admin-customer-table"><thead><tr><th>Customer</th><th>Packages</th><th>Shipping charges</th><th>Total payments</th><th>Outstanding</th><th>Account</th><th>Joined</th><th><span className="admin-sr-only">View profile</span></th></tr></thead><tbody>
          {customers.map((customer) => {
            const customerPackages = database.packages.filter((item) => item.customerId === customer.id);
            const active = customerPackages.filter((item) => ACTIVE_PACKAGE_STATUSES.includes(item.status)).length;
            const delivered = customerPackages.filter((item) => DELIVERED_PACKAGE_STATUSES.includes(item.status)).length;
            const transactions = database.balanceTransactions.filter((item) => item.customerId === customer.id);
            const shippingCharges = customerPackages.reduce((sum, item) => sum + item.shippingPrice, 0);
            const totalPayments = Math.abs(transactions.filter((item) => item.type === "Payment").reduce((sum, item) => sum + item.amount, 0));
            const balance = getCustomerBalance(database, customer.id);
            return <tr key={customer.id}>
              <td><Link href={`/admin/customers/${customer.id}`} className="admin-customer-cell"><span className="admin-customer-avatar">{customer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{customer.name}</strong><small>#{customer.accountNumber} <i>·</i> {customer.email}</small></span></Link></td>
              <td><span className="admin-package-count">{active} active <i>·</i> {delivered} delivered</span></td>
              <td>{formatUsd(shippingCharges)}</td><td>{formatUsd(totalPayments)}</td><td><strong className={balance > 0 ? "admin-table-balance-due" : "admin-table-balance-clear"}>{balance < 0 ? `Credit ${formatUsd(Math.abs(balance))}` : formatUsd(balance)}</strong></td>
              <td><span className={`admin-account-status admin-account-${customer.accountStatus.toLowerCase()}`}><i />{customer.accountStatus}</span></td><td>{new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${customer.joinedAt}T12:00:00`))}</td><td><Link href={`/admin/customers/${customer.id}`} className="admin-row-action" aria-label={`Open ${customer.name} account`}><ArrowRight size={15} /></Link></td>
            </tr>;
          })}
          {customers.length === 0 && <tr><td className="admin-table-empty" colSpan={8}>No customers match your search. Try a different name, email, or account number.</td></tr>}
        </tbody></table></div>
        <div className="admin-table-foot"><span>Showing <strong>{customers.length}</strong> of <strong>{database.customers.length}</strong> demo accounts</span><span><ShieldCheck size={13} /> Balances are calculated from transaction history</span></div>
      </section>
      <div className="admin-directory-note"><span><ShieldCheck size={16} /></span><p><strong>Financial integrity by design.</strong> Every adjustment adds a transaction; there is no balance overwrite control.</p></div>
    </div>
  );
}
