"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AdminDatabase,
  AdminPackage,
  AdjustmentType,
  DEMO_ADMIN,
  DEMO_ADMIN_DATABASE,
  PackageStatus,
  getCustomerBalance,
  getPackageBalance,
  hasAdminPermission,
  packageTotal,
  roundCurrency,
} from "@/lib/admin-data";

const STORAGE_KEY = "ship-fusion-ja-admin-demo-v1";

type EditablePackageFields = Pick<
  AdminPackage,
  | "description"
  | "weight"
  | "dimensions"
  | "method"
  | "origin"
  | "destination"
  | "shippingPrice"
  | "customsFees"
  | "additionalFees"
  | "estimatedDelivery"
  | "internalNotes"
  | "customerVisibleNotes"
>;

type AddPackageInput = Pick<
  AdminPackage,
  | "customerId"
  | "description"
  | "method"
  | "dateReceived"
  | "weight"
  | "dimensions"
  | "origin"
  | "destination"
  | "status"
  | "estimatedDelivery"
  | "shippingPrice"
  | "customsFees"
  | "additionalFees"
  | "amountPaid"
  | "declaredValue"
  | "customerVisibleNotes"
  | "internalNotes"
>;

type AddBalanceAdjustmentInput = {
  customerId: string;
  type: AdjustmentType;
  amount: number;
  description: string;
  adminNote: string;
  paymentMethod?: string;
  packageId?: string;
};

type AdminDataContextValue = {
  database: AdminDatabase;
  currentAdmin: typeof DEMO_ADMIN;
  ready: boolean;
  changePackageStatus: (packageId: string, newStatus: PackageStatus, note: string) => void;
  updatePackage: (packageId: string, fields: EditablePackageFields) => void;
  addPackage: (input: AddPackageInput) => string | null;
  addBalanceAdjustment: (input: AddBalanceAdjustmentInput) => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [database, setDatabase] = useState<AdminDatabase>(DEMO_ADMIN_DATABASE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminDatabase;
        if (
          parsed.version === 1 &&
          Array.isArray(parsed.customers) &&
          Array.isArray(parsed.packages) &&
          Array.isArray(parsed.packageStatusHistory) &&
          Array.isArray(parsed.balanceTransactions) &&
          Array.isArray(parsed.payments) &&
          Array.isArray(parsed.adminAuditLogs)
        ) {
          setDatabase(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }, [database, ready]);

  const value = useMemo<AdminDataContextValue>(() => ({
    database,
    currentAdmin: DEMO_ADMIN,
    ready,
    changePackageStatus(packageId, newStatus, note) {
      setDatabase((current) => {
        if (!hasAdminPermission(DEMO_ADMIN, "packages:write")) return current;
        const item = current.packages.find((entry) => entry.id === packageId);
        if (!item || item.status === newStatus) return current;

        const changedAt = new Date().toISOString();
        const statusEntry = {
          id: createId("status"),
          packageId,
          previousStatus: item.status,
          newStatus,
          changedAt,
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          note: note.trim(),
        };
        const auditEntry = {
          id: createId("audit"),
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          action: "updated package status",
          objectType: "package" as const,
          objectId: packageId,
          packageId,
          customerId: item.customerId,
          previousValue: item.status,
          newValue: newStatus,
          occurredAt: changedAt,
          note: note.trim(),
        };

        return {
          ...current,
          packages: current.packages.map((entry) => entry.id === packageId ? { ...entry, status: newStatus, lastUpdated: changedAt } : entry),
          packageStatusHistory: [statusEntry, ...current.packageStatusHistory],
          adminAuditLogs: [auditEntry, ...current.adminAuditLogs],
        };
      });
    },
    updatePackage(packageId, fields) {
      setDatabase((current) => {
        if (!hasAdminPermission(DEMO_ADMIN, "packages:write")) return current;
        const item = current.packages.find((entry) => entry.id === packageId);
        if (!item) return current;
        const changedAt = new Date().toISOString();
        const updatedItem = { ...item, ...fields };
        const priceDelta = roundCurrency(packageTotal(updatedItem) - packageTotal(item));
        const oldBalance = getCustomerBalance(current, item.customerId);
        const newBalance = roundCurrency(oldBalance + priceDelta);
        const auditEntry = {
          id: createId("audit"),
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          action: "edited package information",
          objectType: "package" as const,
          objectId: packageId,
          packageId,
          customerId: item.customerId,
          previousValue: summarizePackage(item),
          newValue: summarizePackage(updatedItem),
          occurredAt: changedAt,
          note: priceDelta === 0
            ? "Package details saved from the admin workspace."
            : `Package charge change posted to the account ledger: ${formatBalance(packageTotal(item))} → ${formatBalance(packageTotal(updatedItem))}.`,
        };
        const chargeAdjustment = priceDelta === 0 ? null : {
          id: createId("txn"),
          customerId: item.customerId,
          type: "Manual adjustment" as const,
          amount: priceDelta,
          description: `Package charge adjustment · ${packageId}`,
          adminNote: `Package total changed from ${formatBalance(packageTotal(item))} to ${formatBalance(packageTotal(updatedItem))}.`,
          occurredAt: changedAt,
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          packageId,
        };
        const balanceAudit = priceDelta === 0 ? null : {
          id: createId("audit"),
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          action: "recorded package price adjustment",
          objectType: "customer" as const,
          objectId: `Account #${current.customers.find((entry) => entry.id === item.customerId)?.accountNumber ?? "—"}`,
          customerId: item.customerId,
          packageId,
          previousValue: `Balance ${formatBalance(oldBalance)}`,
          newValue: `Adjustment ${formatBalance(priceDelta)} · balance ${formatBalance(newBalance)}`,
          occurredAt: changedAt,
          note: `Charge difference for ${packageId}.`,
        };
        return {
          ...current,
          packages: current.packages.map((entry) => entry.id === packageId ? { ...entry, ...fields, lastUpdated: changedAt } : entry),
          balanceTransactions: chargeAdjustment ? [chargeAdjustment, ...current.balanceTransactions] : current.balanceTransactions,
          adminAuditLogs: [auditEntry, ...(balanceAudit ? [balanceAudit] : []), ...current.adminAuditLogs],
        };
      });
    },
    addPackage(input) {
      const charges = roundCurrency(input.shippingPrice + input.customsFees + input.additionalFees);
      const canCreate = hasAdminPermission(DEMO_ADMIN, "packages:write")
        && Boolean(database.customers.find((entry) => entry.id === input.customerId))
        && Boolean(input.description.trim())
        && Boolean(input.origin.trim())
        && Boolean(input.destination.trim())
        && [input.shippingPrice, input.customsFees, input.additionalFees, input.amountPaid, input.declaredValue].every((value) => Number.isFinite(value) && value >= 0)
        && input.amountPaid <= charges;
      if (!canCreate) return null;

      const packageId = createTrackingId(database);
      setDatabase((current) => {
        const customer = current.customers.find((entry) => entry.id === input.customerId);
        if (!customer || current.packages.some((entry) => entry.id === packageId)) return current;

        const occurredAt = new Date().toISOString();
        const packageRecord: AdminPackage = {
          ...input,
          id: packageId,
          description: input.description.trim(),
          weight: input.weight.trim() || "—",
          dimensions: input.dimensions.trim() || "—",
          origin: input.origin.trim(),
          destination: input.destination.trim(),
          dateReceived: input.dateReceived || null,
          estimatedDelivery: input.estimatedDelivery || null,
          customerVisibleNotes: input.customerVisibleNotes.trim(),
          internalNotes: input.internalNotes.trim(),
          shippingPrice: roundCurrency(input.shippingPrice),
          customsFees: roundCurrency(input.customsFees),
          additionalFees: roundCurrency(input.additionalFees),
          amountPaid: roundCurrency(input.amountPaid),
          declaredValue: roundCurrency(input.declaredValue),
          lastUpdated: occurredAt,
        };
        const statusEntry = {
          id: createId("status"),
          packageId,
          previousStatus: null,
          newStatus: input.status,
          changedAt: occurredAt,
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          note: "Package created in the admin console.",
        };
        const transactions = [
          input.shippingPrice > 0 ? {
            id: createId("txn"),
            customerId: input.customerId,
            type: "Charge" as const,
            amount: roundCurrency(input.shippingPrice),
            description: `Shipping charge · ${packageId}`,
            adminNote: `${input.method} shipping charge recorded with package creation.`,
            occurredAt,
            adminId: DEMO_ADMIN.id,
            adminName: DEMO_ADMIN.name,
            packageId,
          } : null,
          input.customsFees + input.additionalFees > 0 ? {
            id: createId("txn"),
            customerId: input.customerId,
            type: "Fee" as const,
            amount: roundCurrency(input.customsFees + input.additionalFees),
            description: `Customs and handling fees · ${packageId}`,
            adminNote: `Customs ${formatBalance(input.customsFees, false)} · additional ${formatBalance(input.additionalFees, false)}`,
            occurredAt,
            adminId: DEMO_ADMIN.id,
            adminName: DEMO_ADMIN.name,
            packageId,
          } : null,
          input.amountPaid > 0 ? {
            id: createId("txn"),
            customerId: input.customerId,
            type: "Payment" as const,
            amount: -roundCurrency(input.amountPaid),
            description: `Payment received · ${packageId}`,
            adminNote: "Initial payment recorded with package creation.",
            occurredAt,
            adminId: DEMO_ADMIN.id,
            adminName: DEMO_ADMIN.name,
            packageId,
            paymentId: createId("payment"),
          } : null,
        ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
        const paymentTransaction = transactions.find((entry) => entry.type === "Payment");
        const payment = paymentTransaction ? {
          id: paymentTransaction.paymentId!,
          customerId: input.customerId,
          amount: roundCurrency(input.amountPaid),
          method: "Admin recorded",
          reference: `SFJ-${paymentTransaction.paymentId!.toUpperCase()}`,
          status: "Completed" as const,
          paidAt: occurredAt,
          recordedBy: DEMO_ADMIN.name,
          note: `Initial payment for ${packageId}`,
          packageId,
        } : null;
        const auditEntry = {
          id: createId("audit"),
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          action: "created package",
          objectType: "package" as const,
          objectId: packageId,
          packageId,
          customerId: input.customerId,
          previousValue: "No package record",
          newValue: summarizePackage(packageRecord),
          occurredAt,
          note: `Package created for ${customer.name}.`,
        };

        return {
          ...current,
          packages: [packageRecord, ...current.packages],
          packageStatusHistory: [statusEntry, ...current.packageStatusHistory],
          balanceTransactions: [...transactions, ...current.balanceTransactions],
          payments: payment ? [payment, ...current.payments] : current.payments,
          adminAuditLogs: [auditEntry, ...current.adminAuditLogs],
        };
      });
      return packageId;
    },
    addBalanceAdjustment(input) {
      setDatabase((current) => {
        if (!hasAdminPermission(DEMO_ADMIN, "balances:write")) return current;
        const customer = current.customers.find((entry) => entry.id === input.customerId);
        const linkedPackage = input.packageId ? current.packages.find((entry) => entry.id === input.packageId) : undefined;
        if (!customer || !Number.isFinite(input.amount) || input.amount === 0) return current;
        if (input.packageId && (input.type !== "Payment" || !linkedPackage || linkedPackage.customerId !== customer.id)) return current;
        if (linkedPackage && Math.abs(input.amount) > getPackageBalance(linkedPackage)) return current;

        const occurredAt = new Date().toISOString();
        const transactionId = createId("txn");
        const paymentId = input.type === "Payment" ? createId("payment") : undefined;
        const oldBalance = getCustomerBalance(current, input.customerId);
        const newBalance = roundCurrency(oldBalance + input.amount);
        const transaction = {
          id: transactionId,
          customerId: input.customerId,
          type: input.type,
          amount: roundCurrency(input.amount),
          description: input.description.trim(),
          adminNote: input.adminNote.trim(),
          occurredAt,
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          ...(paymentId ? { paymentId } : {}),
          ...(input.packageId ? { packageId: input.packageId } : {}),
        };
        const payment = paymentId ? {
          id: paymentId,
          customerId: input.customerId,
          amount: Math.abs(roundCurrency(input.amount)),
          method: input.paymentMethod?.trim() || "Admin recorded",
          reference: `SFJ-${paymentId.toUpperCase()}`,
          status: "Completed" as const,
          paidAt: occurredAt,
          recordedBy: DEMO_ADMIN.name,
          note: input.packageId ? `${input.description.trim()} · ${input.packageId}` : input.description.trim(),
          ...(input.packageId ? { packageId: input.packageId } : {}),
        } : null;
        const auditEntry = {
          id: createId("audit"),
          adminId: DEMO_ADMIN.id,
          adminName: DEMO_ADMIN.name,
          action: `recorded ${input.type.toLowerCase()}`,
          objectType: input.type === "Payment" ? "payment" as const : "customer" as const,
          objectId: payment?.reference ?? `Account #${customer.accountNumber}`,
          customerId: customer.id,
          ...(input.packageId ? { packageId: input.packageId } : {}),
          previousValue: linkedPackage
            ? `Balance ${formatBalance(oldBalance)} · package paid ${formatBalance(linkedPackage.amountPaid, false)}`
            : `Balance ${formatBalance(oldBalance)}`,
          newValue: `Adjustment ${formatBalance(input.amount)} · balance ${formatBalance(newBalance)}${linkedPackage ? ` · package paid ${formatBalance(linkedPackage.amountPaid + Math.abs(input.amount), false)}` : ""}`,
          occurredAt,
          note: [input.description.trim(), input.adminNote.trim()].filter(Boolean).join(" — "),
        };

        return {
          ...current,
          packages: linkedPackage
            ? current.packages.map((item) => item.id === linkedPackage.id ? { ...item, amountPaid: roundCurrency(item.amountPaid + Math.abs(input.amount)), lastUpdated: occurredAt } : item)
            : current.packages,
          balanceTransactions: [transaction, ...current.balanceTransactions],
          payments: payment ? [payment, ...current.payments] : current.payments,
          adminAuditLogs: [auditEntry, ...current.adminAuditLogs],
        };
      });
    },
  }), [database, ready]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataContextValue {
  const value = useContext(AdminDataContext);
  if (!value) throw new Error("useAdminData must be used inside AdminDataProvider.");
  return value;
}

function createId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

function formatBalance(amount: number, includeSign = true): string {
  const abs = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(amount));
  if (!includeSign) return abs;
  return amount > 0 ? `+$${abs.replace("$", "")}` : amount < 0 ? `−${abs}` : abs;
}

function createTrackingId(database: AdminDatabase): string {
  const year = new Date().getFullYear();
  const existingNumbers = database.packages
    .map((item) => item.id.match(new RegExp(`^SFJ-${year}-(\\d+)$`))?.[1])
    .filter((value): value is string => Boolean(value))
    .map((value) => Number(value));
  const nextNumber = Math.max(10000, ...existingNumbers) + 1;
  let candidate = `SFJ-${year}-${nextNumber}`;
  let increment = 1;
  while (database.packages.some((item) => item.id === candidate)) {
    candidate = `SFJ-${year}-${nextNumber + increment}`;
    increment += 1;
  }
  return candidate;
}

function summarizePackage(item: AdminPackage): string {
  return JSON.stringify({
    description: item.description,
    method: item.method,
    route: `${item.origin} → ${item.destination}`,
    shippingPrice: item.shippingPrice,
    customsFees: item.customsFees,
    additionalFees: item.additionalFees,
    estimatedDelivery: item.estimatedDelivery,
    total: packageTotal(item),
    customerVisibleNotes: item.customerVisibleNotes,
    internalNotes: item.internalNotes,
  });
}
