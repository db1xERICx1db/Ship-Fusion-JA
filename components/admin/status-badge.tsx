import { getStatusTone, PackageStatus, PaymentStatus } from "@/lib/admin-data";

export function StatusBadge({ status }: { status: PackageStatus | PaymentStatus }) {
  const tone = getStatusTone(status);
  return <span className={`admin-status-badge admin-status-${tone}`}><i />{status}</span>;
}
