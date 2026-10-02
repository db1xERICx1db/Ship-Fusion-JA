import type { ShipmentStatus } from "@/lib/demo-data";

export function StatusBadge({ status }: { status: ShipmentStatus | "Paid" | "Balance due" }) {
  const variant = status === "Delivered" || status === "Paid" ? "success" : status === "Ready for Delivery" ? "ready" : status === "Awaiting Package" ? "muted" : status === "Balance due" ? "warning" : status === "Customs" ? "purple" : "blue";
  return <span className={`status-badge status-${variant}`}><i />{status}</span>;
}
