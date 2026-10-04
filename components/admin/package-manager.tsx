"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  CircleDollarSign,
  Clock3,
  Edit3,
  FilterX,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  ACTIVE_PACKAGE_STATUSES,
  AdminPackage,
  PACKAGE_STATUSES,
  PackageStatus,
  SHIPPING_METHODS,
  ShippingMethod,
  formatDate,
  formatDateTime,
  formatUsd,
  getCustomerBalance,
  getPackageBalance,
  getPackagePaymentStatus,
  packageTotal,
} from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { StatusBadge } from "@/components/admin/status-badge";

export function PackageManager() {
  const { database } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [methodFilter, setMethodFilter] = useState("All methods");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("customer");
    const search = params.get("search");
    if (customerId) {
      const customer = database.customers.find((item) => item.id === customerId);
      if (customer) setQuery(customer.name);
    } else if (search) {
      setQuery(search);
    }
  }, [database.customers]);

  const filteredPackages = useMemo(() => database.packages.filter((item) => {
    const customer = database.customers.find((entry) => entry.id === item.customerId);
    const searchTarget = `${item.id} ${item.description} ${customer?.name ?? ""} ${customer?.phone ?? ""} ${customer?.email ?? ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || item.status === statusFilter;
    const matchesMethod = methodFilter === "All methods" || item.method === methodFilter;
    const matchesPayment = paymentFilter === "All payments" || getPackagePaymentStatus(item) === paymentFilter;
    const updatedDate = item.lastUpdated.slice(0, 10);
    const matchesFrom = !dateFrom || updatedDate >= dateFrom;
    const matchesTo = !dateTo || updatedDate <= dateTo;
    return matchesSearch && matchesStatus && matchesMethod && matchesPayment && matchesFrom && matchesTo;
  }).sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)), [database.customers, database.packages, dateFrom, dateTo, methodFilter, paymentFilter, query, statusFilter]);

  const selectedPackage = database.packages.find((item) => item.id === selectedId);
  const activeCount = database.packages.filter((item) => ACTIVE_PACKAGE_STATUSES.includes(item.status)).length;
  const resetFilters = () => { setQuery(""); setStatusFilter("All statuses"); setMethodFilter("All methods"); setPaymentFilter("All payments"); setDateFrom(""); setDateTo(""); };
  const hasFilters = Boolean(query || statusFilter !== "All statuses" || methodFilter !== "All methods" || paymentFilter !== "All payments" || dateFrom || dateTo);

  return (
    <div className="admin-page admin-packages-page">
      <div className="admin-page-heading"><div><div className="admin-eyebrow"><span /> SHIPPING OPERATIONS <i>·</i> PACKAGE CONTROL</div><h1>Packages<span>.</span></h1><p>Search, review, and update every customer shipment.</p></div><div className="admin-heading-actions"><button type="button" className="admin-primary-button" onClick={() => setAddDialogOpen(true)}><Plus size={15} /> Add package</button><div className="admin-heading-stat"><span><Box size={15} /> PACKAGE RECORDS</span><strong>{database.packages.length}<small> total <i>·</i> {activeCount} active</small></strong></div></div></div>
      <div className="admin-package-notice"><span><ShieldCheck size={16} /></span><p><strong>Every status change is recorded.</strong> A status update adds a separate tracking-history entry with the previous value, new value, timestamp, admin, and note.</p><Link href="/admin/activity">View audit log <ArrowUpRight size={14} /></Link></div>

      <section className="admin-panel admin-package-table-panel">
        <div className="admin-table-panel-heading"><div><span className="admin-section-kicker">ALL SHIPMENTS</span><h2>Package manager <small>{filteredPackages.length}</small></h2><p>Search by customer, phone, or tracking number. Select a tracking ID to manage details.</p></div><span className="admin-table-demo-tag"><i /> DEMO SHIPMENTS</span></div>
        <div className="admin-package-toolbar">
          <label className="admin-search-box admin-package-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer name, phone, tracking number…" aria-label="Search packages" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label>
          <button className={`admin-filter-toggle ${filtersOpen ? "admin-filter-toggle-open" : ""}`} type="button" onClick={() => setFiltersOpen((open) => !open)}><ArrowDownUp size={15} /> Filters <span>{[statusFilter !== "All statuses", methodFilter !== "All methods", paymentFilter !== "All payments", Boolean(dateFrom || dateTo)].filter(Boolean).length || ""}</span></button>
          {hasFilters && <button type="button" className="admin-clear-filters" onClick={resetFilters}><FilterX size={14} /> Clear filters</button>}
        </div>
        <div className={`admin-package-filters ${filtersOpen ? "admin-package-filters-open" : ""}`}>
          <label><span>PACKAGE STATUS</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{PACKAGE_STATUSES.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
          <label><span>SHIPPING METHOD</span><select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)}><option>All methods</option>{SHIPPING_METHODS.map((method) => <option value={method} key={method}>{method}</option>)}</select></label>
          <label><span>PAYMENT STATUS</span><select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}><option>All payments</option><option>Paid</option><option>Partially paid</option><option>Balance due</option></select></label>
          <label><span>UPDATED FROM</span><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="Updated from" /></label>
          <label><span>UPDATED TO</span><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Updated to" /></label>
        </div>
        <div className="admin-table-scroll admin-package-table-scroll"><table className="admin-data-table admin-package-table"><thead><tr><th>Tracking number</th><th>Customer</th><th>Package description</th><th>Shipping method</th><th>Origin → destination</th><th>Current status</th><th>Shipping price</th><th>Amount paid</th><th>Outstanding</th><th>Est. delivery</th><th>Last updated</th><th><span className="admin-sr-only">Manage package</span></th></tr></thead><tbody>
          {filteredPackages.map((item) => {
            const customer = database.customers.find((entry) => entry.id === item.customerId);
            const packageBalance = getPackageBalance(item);
            return <tr key={item.id}>
              <td><button type="button" className="admin-tracking-button" onClick={() => setSelectedId(item.id)}>{item.id}<ArrowUpRight size={12} /></button></td>
              <td>{customer ? <Link href={`/admin/customers/${customer.id}`} className="admin-table-customer-link">{customer.name}<small>{customer.phone}</small></Link> : "—"}</td>
              <td><span className="admin-table-package-name">{item.description}</span></td><td>{item.method}</td>
              <td><span className="admin-table-route"><span>{item.origin}</span><i>→</i><span>{item.destination}</span></span></td>
              <td><StatusBadge status={item.status} /></td><td>{formatUsd(item.shippingPrice)}</td><td>{formatUsd(item.amountPaid)}<small className="admin-table-subline"><StatusBadge status={getPackagePaymentStatus(item)} /></small></td><td><strong className={packageBalance > 0 ? "admin-table-balance-due" : "admin-table-balance-clear"}>{formatUsd(packageBalance)}</strong></td><td>{formatDate(item.estimatedDelivery)}</td><td>{formatDateTime(item.lastUpdated)}</td><td><button type="button" className="admin-row-action" onClick={() => setSelectedId(item.id)} aria-label={`Manage package ${item.id}`}><Edit3 size={14} /></button></td>
            </tr>;
          })}
          {filteredPackages.length === 0 && <tr><td className="admin-table-empty" colSpan={12}>No package records match these filters. Try a different search or clear the filters.</td></tr>}
        </tbody></table></div>
        <div className="admin-table-foot"><span>Showing <strong>{filteredPackages.length}</strong> of <strong>{database.packages.length}</strong> package records</span><span>Dates filter on <strong>last updated</strong></span></div>
      </section>
      <div className="admin-package-page-footer"><span><Clock3 size={14} /> Customer-visible and internal notes are stored separately.</span><Link href="/admin/customers">Go to customer accounts <ArrowRight size={14} /></Link></div>
      {selectedPackage && <PackageDetailsDialog key={selectedPackage.id} item={selectedPackage} onClose={() => setSelectedId(null)} />}
      {addDialogOpen && <AddPackageDialog onClose={() => setAddDialogOpen(false)} onCreated={(packageId) => { setAddDialogOpen(false); setSelectedId(packageId); }} />}
    </div>
  );
}

type AddPackageDialogProps = { onClose: () => void; onCreated: (packageId: string) => void };

const defaultAddPackageValues = {
  customerId: "",
  description: "",
  method: "Air Freight" as ShippingMethod,
  dateReceived: new Date().toISOString().slice(0, 10),
  weight: "",
  dimensions: "",
  origin: "Miami, FL",
  destination: "Kingston, Jamaica",
  status: "Received" as PackageStatus,
  estimatedDelivery: "",
  shippingPrice: "0",
  customsFees: "0",
  additionalFees: "0",
  amountPaid: "0",
  declaredValue: "0",
  customerVisibleNotes: "",
  internalNotes: "",
};

function AddPackageDialog({ onClose, onCreated }: AddPackageDialogProps) {
  const { database, addPackage } = useAdminData();
  const [values, setValues] = useState(defaultAddPackageValues);
  const [error, setError] = useState("");

  function setField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const selectedCustomer = database.customers.find((customer) => customer.id === values.customerId);
  const shippingPrice = Number(values.shippingPrice);
  const customsFees = Number(values.customsFees);
  const additionalFees = Number(values.additionalFees);
  const amountPaid = Number(values.amountPaid);
  const declaredValue = Number(values.declaredValue);
  const totalCharges = [shippingPrice, customsFees, additionalFees].every(Number.isFinite) ? shippingPrice + customsFees + additionalFees : 0;
  const outstanding = Math.max(totalCharges - (Number.isFinite(amountPaid) ? amountPaid : 0), 0);

  function submitPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.customerId) { setError("Select the customer this package belongs to."); return; }
    if (!values.description.trim() || !values.origin.trim() || !values.destination.trim()) { setError("Add a package description, origin, and destination before creating the package."); return; }
    if ([shippingPrice, customsFees, additionalFees, amountPaid, declaredValue].some((value) => !Number.isFinite(value) || value < 0)) { setError("Amounts must be valid numbers of $0.00 or more."); return; }
    if (amountPaid > totalCharges) { setError("The initial payment cannot be greater than the package total."); return; }

    const createdId = addPackage({
      customerId: values.customerId,
      description: values.description,
      method: values.method,
      dateReceived: values.dateReceived || null,
      weight: values.weight,
      dimensions: values.dimensions,
      origin: values.origin,
      destination: values.destination,
      status: values.status,
      estimatedDelivery: values.estimatedDelivery || null,
      shippingPrice,
      customsFees,
      additionalFees,
      amountPaid,
      declaredValue,
      customerVisibleNotes: values.customerVisibleNotes,
      internalNotes: values.internalNotes,
    });
    if (createdId) onCreated(createdId);
    else setError("Unable to create the package. Check the required fields and try again.");
  }

  return (
    <div className="admin-modal-backdrop admin-package-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-modal admin-package-details-modal admin-add-package-modal" role="dialog" aria-modal="true" aria-labelledby="add-package-title">
        <div className="admin-package-modal-header"><span className="admin-package-modal-icon"><Plus size={19} /></span><div><span className="admin-section-kicker">NEW PACKAGE</span><h2 id="add-package-title">Add package</h2><p>Create a shipment, post initial charges, and open the new tracking record.</p></div><button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close add package"><X size={18} /></button></div>
        <div className="admin-package-modal-content">
          <form className="admin-package-edit-form admin-add-package-form" onSubmit={submitPackage}>
            <div className="admin-package-section-title"><span><PackageCheck size={15} /></span><div><strong>Package basics</strong><small>Select the customer and enter the shipment details.</small></div></div>
            <div className="admin-package-edit-grid">
              <label className="admin-edit-full">Customer<select value={values.customerId} onChange={(event) => setField("customerId", event.target.value)} required><option value="">Select customer…</option>{database.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · #{customer.accountNumber} · {customer.phone}</option>)}</select></label>
              <label className="admin-edit-full">Package description<input value={values.description} onChange={(event) => setField("description", event.target.value)} placeholder="e.g. Electronics package" required /></label>
              <label>Shipping method<select value={values.method} onChange={(event) => setField("method", event.target.value as ShippingMethod)}>{SHIPPING_METHODS.map((method) => <option key={method}>{method}</option>)}</select></label>
              <label>Status<select value={values.status} onChange={(event) => setField("status", event.target.value as PackageStatus)}>{PACKAGE_STATUSES.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
              <label>Date received<input type="date" value={values.dateReceived} onChange={(event) => setField("dateReceived", event.target.value)} /></label>
              <label>Estimated delivery<input type="date" value={values.estimatedDelivery} onChange={(event) => setField("estimatedDelivery", event.target.value)} /></label>
              <label>Weight<input value={values.weight} onChange={(event) => setField("weight", event.target.value)} placeholder="e.g. 4.5 lb" /></label>
              <label>Dimensions<input value={values.dimensions} onChange={(event) => setField("dimensions", event.target.value)} placeholder="L × W × H in" /></label>
              <label>Origin<input value={values.origin} onChange={(event) => setField("origin", event.target.value)} required /></label>
              <label>Destination<input value={values.destination} onChange={(event) => setField("destination", event.target.value)} required /></label>
            </div>

            <div className="admin-package-section-title admin-package-section-cost"><span><CircleDollarSign size={15} /></span><div><strong>Charges and payment</strong><small>Charges are posted to the customer ledger when the package is created.</small></div></div>
            <div className="admin-package-edit-grid admin-package-cost-grid"><label>Shipping price<input type="number" min="0" step="0.01" required value={values.shippingPrice} onChange={(event) => setField("shippingPrice", event.target.value)} /></label><label>Customs fees<input type="number" min="0" step="0.01" required value={values.customsFees} onChange={(event) => setField("customsFees", event.target.value)} /></label><label>Additional fees<input type="number" min="0" step="0.01" required value={values.additionalFees} onChange={(event) => setField("additionalFees", event.target.value)} /></label><label>Amount paid<input type="number" min="0" step="0.01" required value={values.amountPaid} onChange={(event) => setField("amountPaid", event.target.value)} /></label><label>Declared value<input type="number" min="0" step="0.01" required value={values.declaredValue} onChange={(event) => setField("declaredValue", event.target.value)} /></label></div>
            <div className="admin-add-package-summary"><div><span>Package total</span><strong>{formatUsd(totalCharges)}</strong></div><div><span>Initial payment</span><strong>{formatUsd(Number.isFinite(amountPaid) ? amountPaid : 0)}</strong></div><div><span>Outstanding</span><strong className={outstanding > 0 ? "admin-table-balance-due" : "admin-table-balance-clear"}>{formatUsd(outstanding)}</strong></div>{selectedCustomer && <div><span>Customer</span><strong>{selectedCustomer.name}</strong></div>}</div>

            <div className="admin-note-separation"><div className="admin-package-section-title"><span><ShieldCheck size={15} /></span><div><strong>Notes & visibility</strong><small>Add public customer notes and private internal context.</small></div></div><label className="admin-customer-note-field">Customer-visible notes<textarea rows={3} value={values.customerVisibleNotes} onChange={(event) => setField("customerVisibleNotes", event.target.value)} placeholder="Share a useful package update…" /></label><label className="admin-internal-note-field">Internal admin notes <small>PRIVATE · not shown to customers</small><textarea rows={3} value={values.internalNotes} onChange={(event) => setField("internalNotes", event.target.value)} placeholder="Private operations notes…" /></label></div>
            {error && <p className="admin-form-error" role="alert">{error}</p>}
            <div className="admin-package-form-footer"><span>New packages receive the next available SFJ tracking number.</span><div className="admin-add-package-actions"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button"><Plus size={14} /> Create package</button></div></div>
          </form>
        </div>
      </section>
    </div>
  );
}

type PackageDetailsDialogProps = { item: AdminPackage; onClose: () => void };

function PackageDetailsDialog({ item, onClose }: PackageDetailsDialogProps) {
  const { database, changePackageStatus, updatePackage } = useAdminData();
  const customer = database.customers.find((entry) => entry.id === item.customerId);
  const [nextStatus, setNextStatus] = useState<PackageStatus>(item.status);
  const [statusNote, setStatusNote] = useState("");
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmPriceChange, setConfirmPriceChange] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    description: item.description,
    weight: item.weight,
    dimensions: item.dimensions,
    method: item.method,
    origin: item.origin,
    destination: item.destination,
    shippingPrice: item.shippingPrice.toString(),
    customsFees: item.customsFees.toString(),
    additionalFees: item.additionalFees.toString(),
    estimatedDelivery: item.estimatedDelivery ?? "",
    internalNotes: item.internalNotes,
    customerVisibleNotes: item.customerVisibleNotes,
  });
  const history = database.packageStatusHistory.filter((entry) => entry.packageId === item.id).sort((a, b) => b.changedAt.localeCompare(a.changedAt));

  function setField<K extends keyof typeof formValues>(key: K, value: (typeof formValues)[K]) {
    setFormValues((values) => ({ ...values, [key]: value }));
  }

  const shippingPricePreview = Number(formValues.shippingPrice);
  const customsFeesPreview = Number(formValues.customsFees);
  const additionalFeesPreview = Number(formValues.additionalFees);
  const priceDelta = Number.isFinite(shippingPricePreview + customsFeesPreview + additionalFeesPreview)
    ? Math.round((shippingPricePreview + customsFeesPreview + additionalFeesPreview - packageTotal(item) + Number.EPSILON) * 100) / 100
    : 0;
  const customerBalance = customer ? getCustomerBalance(database, customer.id) : 0;

  function savePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const shippingPrice = Number(formValues.shippingPrice);
    const customsFees = Number(formValues.customsFees);
    const additionalFees = Number(formValues.additionalFees);
    if ([shippingPrice, customsFees, additionalFees].some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Package charges must be valid amounts of $0.00 or more.");
      return;
    }
    if (!formValues.description.trim() || !formValues.origin.trim() || !formValues.destination.trim()) {
      setError("Add a package description, origin, and destination before saving.");
      return;
    }
    setError("");
    if (priceDelta !== 0) {
      setConfirmPriceChange(true);
      return;
    }
    persistPackageChanges();
  }

  function persistPackageChanges() {
    updatePackage(item.id, {
      description: formValues.description.trim(),
      weight: formValues.weight.trim() || "—",
      dimensions: formValues.dimensions.trim() || "—",
      method: formValues.method,
      origin: formValues.origin.trim(),
      destination: formValues.destination.trim(),
      shippingPrice: Number(formValues.shippingPrice),
      customsFees: Number(formValues.customsFees),
      additionalFees: Number(formValues.additionalFees),
      estimatedDelivery: formValues.estimatedDelivery || null,
      internalNotes: formValues.internalNotes.trim(),
      customerVisibleNotes: formValues.customerVisibleNotes.trim(),
    });
    setConfirmPriceChange(false);
    setError("");
    setSaveMessage(priceDelta === 0 ? "Package details saved. An audit entry was added." : "Package and account ledger updated. Audit entries were added.");
    window.setTimeout(() => setSaveMessage(""), 4500);
  }

  function confirmStatusChange() {
    changePackageStatus(item.id, nextStatus, statusNote);
    setConfirmStatus(false);
    setStatusSaved(true);
    setStatusNote("");
  }

  return (
    <div className="admin-modal-backdrop admin-package-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-modal admin-package-details-modal" role="dialog" aria-modal="true" aria-labelledby="package-dialog-title">
        <div className="admin-package-modal-header"><span className="admin-package-modal-icon"><PackageCheck size={19} /></span><div><span className="admin-section-kicker">PACKAGE MANAGEMENT</span><h2 id="package-dialog-title">{item.id}</h2><p>{customer?.name ?? "Customer"} <i>·</i> {item.description}</p></div><button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close package details"><X size={18} /></button></div>
        <div className="admin-package-modal-content">
          <div className="admin-package-manage-grid">
            <div className="admin-package-manage-main">
              <form className="admin-package-edit-form" onSubmit={savePackage}>
                <div className="admin-package-section-title"><span><Edit3 size={15} /></span><div><strong>Edit package information</strong><small>Changes are attributed to the signed-in admin.</small></div></div>
                <div className="admin-package-edit-grid">
                  <label className="admin-edit-full">Package description<input value={formValues.description} onChange={(event) => setField("description", event.target.value)} required /></label>
                  <label>Shipping method<select value={formValues.method} onChange={(event) => setField("method", event.target.value as ShippingMethod)}>{SHIPPING_METHODS.map((method) => <option key={method}>{method}</option>)}</select></label>
                  <label>Weight<input value={formValues.weight} onChange={(event) => setField("weight", event.target.value)} placeholder="e.g. 4.5 lb" /></label>
                  <label>Dimensions<input value={formValues.dimensions} onChange={(event) => setField("dimensions", event.target.value)} placeholder="L × W × H in" /></label>
                  <label>Estimated delivery<input type="date" value={formValues.estimatedDelivery} onChange={(event) => setField("estimatedDelivery", event.target.value)} /></label>
                  <label>Origin<input value={formValues.origin} onChange={(event) => setField("origin", event.target.value)} required /></label>
                  <label>Destination<input value={formValues.destination} onChange={(event) => setField("destination", event.target.value)} required /></label>
                </div>
                <div className="admin-package-section-title admin-package-section-cost"><span><CircleDollarSign size={15} /></span><div><strong>Package charges</strong><small>These are package fields. Customer balances remain ledger-based.</small></div></div>
                <div className="admin-package-edit-grid admin-package-cost-grid"><label>Shipping price<input type="number" min="0" step="0.01" required value={formValues.shippingPrice} onChange={(event) => setField("shippingPrice", event.target.value)} /></label><label>Customs fees<input type="number" min="0" step="0.01" required value={formValues.customsFees} onChange={(event) => setField("customsFees", event.target.value)} /></label><label>Additional fees<input type="number" min="0" step="0.01" required value={formValues.additionalFees} onChange={(event) => setField("additionalFees", event.target.value)} /></label></div>
                <div className="admin-note-separation"><div className="admin-package-section-title"><span><ShieldCheck size={15} /></span><div><strong>Notes & visibility</strong><small>Keep private operations notes separate from customer updates.</small></div></div><label className="admin-customer-note-field">Customer-visible notes<small>This is the note intended for the customer to see.</small><textarea rows={3} value={formValues.customerVisibleNotes} onChange={(event) => setField("customerVisibleNotes", event.target.value)} placeholder="Share a useful package update…" /></label><label className="admin-internal-note-field">Internal admin notes <small>PRIVATE · not shown to customers</small><textarea rows={3} value={formValues.internalNotes} onChange={(event) => setField("internalNotes", event.target.value)} placeholder="Private operations notes…" /></label></div>
                {error && <p className="admin-form-error" role="alert">{error}</p>}{saveMessage && <p className="admin-inline-success" role="status"><Check size={14} />{saveMessage}</p>}
                <div className="admin-package-form-footer"><span>Last updated {formatDateTime(item.lastUpdated)}</span><button type="submit" className="admin-primary-button"><Check size={14} /> Save package details</button></div>
              </form>
            </div>
            <aside className="admin-package-manage-side">
              <section className="admin-package-status-card"><div className="admin-package-section-title"><span><ArrowRight size={15} /></span><div><strong>Update status</strong><small>Customer tracking changes after confirmation.</small></div></div><div className="admin-current-status-block"><span>CURRENT STATUS</span><StatusBadge status={item.status} /></div><label className="admin-status-select-label">New status<select value={nextStatus} onChange={(event) => { setNextStatus(event.target.value as PackageStatus); setStatusSaved(false); }}>{PACKAGE_STATUSES.map((status) => <option value={status} key={status}>{status}</option>)}</select></label><label className="admin-status-note-label">Admin note <span>Optional</span><textarea rows={3} value={statusNote} onChange={(event) => setStatusNote(event.target.value)} placeholder="Reason or update detail" /></label><button className="admin-status-update-button" type="button" disabled={nextStatus === item.status} onClick={() => setConfirmStatus(true)}>Review status change <ArrowRight size={14} /></button>{statusSaved && <p className="admin-inline-success"><Check size={14} />Status updated and history recorded.</p>}</section>
              <section className="admin-package-history-card"><div className="admin-package-section-title"><span><Clock3 size={15} /></span><div><strong>Tracking history</strong><small>{history.length} recorded status updates</small></div></div><div className="admin-package-history-list">{history.map((entry) => <div className="admin-package-history-entry" key={entry.id}><i /><div><strong>{entry.newStatus}</strong><time>{formatDateTime(entry.changedAt)}</time>{entry.previousStatus && <small>{entry.previousStatus} <b>→</b> {entry.newStatus}</small>}{entry.note && <small className="admin-history-entry-note">{entry.note}</small>}<em>by {entry.adminName}</em></div></div>)}{history.length === 0 && <div className="admin-empty-state">No history has been recorded.</div>}</div></section>
              <div className="admin-package-customer-link"><span><MapPin size={14} /></span><div><small>CUSTOMER ACCOUNT</small><strong>{customer?.name ?? "Customer"}</strong></div>{customer && <Link href={`/admin/customers/${customer.id}`} aria-label={`View ${customer.name} account`}><ArrowUpRight size={14} /></Link>}</div>
            </aside>
          </div>
        </div>
        {confirmStatus && <div className="admin-confirm-layer"><section className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="status-confirm-title"><button type="button" className="admin-modal-close" onClick={() => setConfirmStatus(false)} aria-label="Cancel status change"><X size={17} /></button><span className="admin-confirm-icon"><PackageCheck size={19} /></span><span className="admin-section-kicker">TRACKING UPDATE</span><h3 id="status-confirm-title">Confirm status change</h3><p>Are you sure you want to change this package&apos;s status?</p><div className="admin-status-transition"><div><span>Previous status</span><StatusBadge status={item.status} /></div><ArrowRight size={17} /><div><span>New status</span><StatusBadge status={nextStatus} /></div></div>{statusNote && <div className="admin-confirm-note"><strong>Admin note</strong><span>{statusNote}</span></div>}<div className="admin-confirm-actions"><button type="button" className="admin-secondary-button" onClick={() => setConfirmStatus(false)}>Cancel</button><button type="button" className="admin-primary-button" onClick={confirmStatusChange}><Check size={15} /> Yes, update status</button></div><small className="admin-confirm-audit-note"><ShieldCheck size={13} /> Previous and new status, time, admin, and note are saved to history.</small></section></div>}
        {confirmPriceChange && <div className="admin-confirm-layer"><section className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="price-confirm-title"><button type="button" className="admin-modal-close" onClick={() => setConfirmPriceChange(false)} aria-label="Cancel package edit"><X size={17} /></button><span className="admin-confirm-icon admin-confirm-icon-money"><CircleDollarSign size={19} /></span><span className="admin-section-kicker">ACCOUNT IMPACT REVIEW</span><h3 id="price-confirm-title">Confirm package price change</h3><p>Changing the package total will add a new ledger transaction for {customer?.name ?? "this customer"}. The balance will not be overwritten.</p><div className="admin-adjustment-preview"><div><span>Current account balance</span><strong>{formatUsd(customerBalance)}</strong></div><div><span>Package total</span><strong>{formatUsd(packageTotal(item))} <small>→ {formatUsd(shippingPricePreview + customsFeesPreview + additionalFeesPreview)}</small></strong></div><div><span>Ledger adjustment</span><strong className={priceDelta >= 0 ? "admin-amount-positive" : "admin-amount-negative"}>{priceDelta >= 0 ? "+" : "−"}{formatUsd(Math.abs(priceDelta))}</strong></div><div className="admin-preview-new"><span>New account balance</span><strong>{formatUsd(customerBalance + priceDelta)}</strong></div></div><div className="admin-confirm-actions"><button type="button" className="admin-secondary-button" onClick={() => setConfirmPriceChange(false)}>Cancel</button><button type="button" className="admin-primary-button" onClick={persistPackageChanges}><Check size={15} /> Confirm & save</button></div><small className="admin-confirm-audit-note"><ShieldCheck size={13} /> Package edit and balance adjustment will both be audited.</small></section></div>}
      </section>
    </div>
  );
}
