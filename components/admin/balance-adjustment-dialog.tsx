"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { ADJUSTMENT_TYPES, AdjustmentType, CustomerRecord, formatUsd, getCustomerBalance, getPackageBalance } from "@/lib/admin-data";
import { useAdminData } from "@/components/admin/admin-data-provider";

type BalanceAdjustmentDialogProps = {
  customer: CustomerRecord;
  onClose: () => void;
  onSaved: () => void;
};

export function BalanceAdjustmentDialog({ customer, onClose, onSaved }: BalanceAdjustmentDialogProps) {
  const { database, addBalanceAdjustment } = useAdminData();
  const [type, setType] = useState<AdjustmentType>("Charge");
  const [amount, setAmount] = useState("");
  const [manualDirection, setManualDirection] = useState<"charge" | "credit">("charge");
  const [description, setDescription] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [packageId, setPackageId] = useState("");
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [error, setError] = useState("");

  const currentBalance = getCustomerBalance(database, customer.id);
  const eligiblePackages = database.packages.filter((item) => item.customerId === customer.id && getPackageBalance(item) > 0);
  const selectedPackage = type === "Payment" ? eligiblePackages.find((item) => item.id === packageId) : undefined;
  const amountNumber = Number(amount);
  const adjustment = useMemo(() => {
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) return 0;
    if (["Payment", "Credit", "Refund"].includes(type)) return -amountNumber;
    if (type === "Manual adjustment" && manualDirection === "credit") return -amountNumber;
    return amountNumber;
  }, [amountNumber, manualDirection, type]);
  const newBalance = Math.round((currentBalance + adjustment + Number.EPSILON) * 100) / 100;

  function reviewAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Enter an adjustment amount greater than $0.00.");
      return;
    }
    if (!description.trim()) {
      setError("Add a description or reason so this change can be audited.");
      return;
    }
    if (type === "Payment" && selectedPackage && amountNumber > getPackageBalance(selectedPackage)) {
      setError("The payment exceeds this package’s remaining balance. Apply the excess to the account balance instead.");
      return;
    }
    setError("");
    setStep("confirm");
  }

  function confirmAdjustment() {
    addBalanceAdjustment({ customerId: customer.id, type, amount: adjustment, description, adminNote, paymentMethod, ...(type === "Payment" && packageId ? { packageId } : {}) });
    onSaved();
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-modal admin-balance-modal" role="dialog" aria-modal="true" aria-labelledby="balance-dialog-title">
        <div className="admin-modal-top"><span className="admin-modal-icon"><ShieldCheck size={18} /></span><button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close balance adjustment"><X size={18} /></button></div>
        {step === "edit" ? <>
          <div className="admin-modal-heading"><span className="admin-section-kicker">ACCOUNT #{customer.accountNumber}</span><h2 id="balance-dialog-title">Adjust balance</h2><p>Create a ledger entry for {customer.name}. The current balance will never be overwritten.</p></div>
          <div className="admin-balance-current"><span>Current balance</span><strong>{formatUsd(currentBalance)}</strong></div>
          <form className="admin-balance-form" onSubmit={reviewAdjustment}>
            <label>Adjustment type<select value={type} onChange={(event) => setType(event.target.value as AdjustmentType)}>{ADJUSTMENT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            {type === "Manual adjustment" && <label>Adjustment direction<select value={manualDirection} onChange={(event) => setManualDirection(event.target.value as "charge" | "credit")}><option value="charge">Increase balance (+)</option><option value="credit">Reduce balance (−)</option></select></label>}
            <label>Amount<input type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
            {type === "Payment" && <label>Payment method<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option>Cash</option><option>Card terminal</option><option>Bank transfer</option><option>Online payment</option><option>Other</option></select></label>}
            {type === "Payment" && <label>Apply payment to<select value={packageId} onChange={(event) => setPackageId(event.target.value)}><option value="">Customer account balance (not package-specific)</option>{eligiblePackages.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.description} · due {formatUsd(getPackageBalance(item))}</option>)}</select></label>}
            <label>Description / reason<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Customs assessment for package…" maxLength={140} required /></label>
            <label>Admin note <span className="admin-optional-label">Optional · internal only</span><textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} placeholder="Add context for the audit trail" rows={3} maxLength={400} /></label>
            {error && <p className="admin-form-error" role="alert">{error}</p>}
            <div className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button">Review adjustment <ArrowRight size={15} /></button></div>
          </form>
          <div className="admin-modal-footnote"><LockKeyhole size={13} /> Saving creates a permanent balance transaction and audit record.</div>
        </> : <>
          <div className="admin-modal-heading"><span className="admin-section-kicker">FINAL REVIEW</span><h2 id="balance-dialog-title">Confirm Balance Adjustment</h2><p>Review the account impact before adding this transaction to the ledger.</p></div>
          <div className="admin-adjustment-preview"><div><span>Customer</span><strong>{customer.name} <small>#{customer.accountNumber}</small></strong></div><div><span>Current Balance</span><strong>{formatUsd(currentBalance)}</strong></div><div><span>Adjustment</span><strong className={adjustment >= 0 ? "admin-amount-positive" : "admin-amount-negative"}>{adjustment >= 0 ? "+" : "−"}{formatUsd(Math.abs(adjustment))}</strong></div><div className="admin-preview-new"><span>New Balance</span><strong>{formatUsd(newBalance)}</strong></div></div>
          <div className="admin-confirm-reason"><span>{type} · {description}</span>{selectedPackage && <small>Applied to package: {selectedPackage.id}</small>}{adminNote && <small>Admin note: {adminNote}</small>}</div>
          <div className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={() => setStep("edit")}><ArrowLeft size={14} /> Back</button><button type="button" className="admin-primary-button" onClick={confirmAdjustment}><Check size={15} /> Confirm & save</button></div>
          <div className="admin-modal-footnote"><ShieldCheck size={14} /> This entry will be attributed to Alex Morgan and cannot be silently removed.</div>
        </>}
      </section>
    </div>
  );
}
