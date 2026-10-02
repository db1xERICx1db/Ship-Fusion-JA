export type PackageStatus =
  | "Awaiting Package"
  | "Received"
  | "Processing"
  | "Shipped"
  | "In Transit"
  | "Arrived in Jamaica"
  | "Customs Processing"
  | "Ready for Delivery"
  | "Out for Delivery"
  | "Delivered"
  | "On Hold"
  | "Cancelled";

export const PACKAGE_STATUSES: PackageStatus[] = [
  "Awaiting Package",
  "Received",
  "Processing",
  "Shipped",
  "In Transit",
  "Arrived in Jamaica",
  "Customs Processing",
  "Ready for Delivery",
  "Out for Delivery",
  "Delivered",
  "On Hold",
  "Cancelled",
];

export const PACKAGE_STATUS_GROUPS: { label: string; statuses: PackageStatus[]; tone: string }[] = [
  { label: "Awaiting receipt", statuses: ["Awaiting Package"], tone: "slate" },
  { label: "Warehouse", statuses: ["Received", "Processing"], tone: "blue" },
  { label: "In transit", statuses: ["Shipped", "In Transit"], tone: "lime" },
  { label: "Jamaica clearance", statuses: ["Arrived in Jamaica", "Customs Processing"], tone: "amber" },
  { label: "Last mile", statuses: ["Ready for Delivery", "Out for Delivery"], tone: "violet" },
  { label: "Delivered", statuses: ["Delivered"], tone: "green" },
];
export const ACTIVE_PACKAGE_STATUSES: PackageStatus[] = PACKAGE_STATUSES.filter((status) => !["Delivered", "Cancelled"].includes(status));
export const IN_TRANSIT_PACKAGE_STATUSES: PackageStatus[] = ["Shipped", "In Transit", "Arrived in Jamaica"];
export const DELIVERY_QUEUE_STATUSES: PackageStatus[] = ["Ready for Delivery", "Out for Delivery"];
export const CUSTOMS_PACKAGE_STATUSES: PackageStatus[] = ["Customs Processing"];
export const DELIVERED_PACKAGE_STATUSES: PackageStatus[] = ["Delivered"];
export const HELD_PACKAGE_STATUSES: PackageStatus[] = ["On Hold"];
export const CANCELLED_PACKAGE_STATUSES: PackageStatus[] = ["Cancelled"];

export type AdminStatusTone = "complete" | "ready" | "moving" | "attention" | "cancelled" | "partial" | "processing";
export type PaymentStatus = "Paid" | "Partially paid" | "Balance due";
export const PACKAGE_STATUS_TONES: Record<PackageStatus, AdminStatusTone> = {
  "Awaiting Package": "processing",
  Received: "processing",
  Processing: "processing",
  Shipped: "moving",
  "In Transit": "moving",
  "Arrived in Jamaica": "moving",
  "Customs Processing": "attention",
  "Ready for Delivery": "ready",
  "Out for Delivery": "ready",
  Delivered: "complete",
  "On Hold": "attention",
  Cancelled: "cancelled",
};
export const PAYMENT_STATUS_TONES: Record<PaymentStatus, AdminStatusTone> = {
  Paid: "complete",
  "Partially paid": "partial",
  "Balance due": "attention",
};
export function getStatusTone(status: PackageStatus | PaymentStatus): AdminStatusTone {
  return status in PACKAGE_STATUS_TONES
    ? PACKAGE_STATUS_TONES[status as PackageStatus]
    : PAYMENT_STATUS_TONES[status as PaymentStatus];
}

export type ShippingMethod = "Air Freight" | "Sea Freight" | "Express Courier";
export const SHIPPING_METHODS: ShippingMethod[] = ["Air Freight", "Sea Freight", "Express Courier"];

export type AdjustmentType = "Charge" | "Credit" | "Payment" | "Refund" | "Fee" | "Manual adjustment";
export const ADJUSTMENT_TYPES: AdjustmentType[] = ["Charge", "Credit", "Payment", "Refund", "Fee", "Manual adjustment"];

export type AdminPermission =
  | "dashboard:read"
  | "packages:read"
  | "packages:write"
  | "customers:read"
  | "balances:write"
  | "activity:read";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  title: string;
  permissions: AdminPermission[];
};

export type CustomerRecord = {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  accountStatus: "Active" | "Review" | "Inactive";
  address: string;
};

export type AdminPackage = {
  id: string;
  customerId: string;
  description: string;
  method: ShippingMethod;
  dateReceived: string | null;
  weight: string;
  dimensions: string;
  origin: string;
  destination: string;
  status: PackageStatus;
  estimatedDelivery: string | null;
  shippingPrice: number;
  customsFees: number;
  additionalFees: number;
  amountPaid: number;
  declaredValue: number;
  customerVisibleNotes: string;
  internalNotes: string;
  lastUpdated: string;
};

export type PackageStatusHistoryEntry = {
  id: string;
  packageId: string;
  previousStatus: PackageStatus | null;
  newStatus: PackageStatus;
  changedAt: string;
  adminId: string;
  adminName: string;
  note: string;
};

export type BalanceTransaction = {
  id: string;
  customerId: string;
  type: AdjustmentType;
  amount: number;
  description: string;
  adminNote: string;
  occurredAt: string;
  adminId: string;
  adminName: string;
  packageId?: string;
  paymentId?: string;
};

export type PaymentRecord = {
  id: string;
  customerId: string;
  amount: number;
  method: string;
  reference: string;
  status: "Completed" | "Pending" | "Refunded";
  paidAt: string;
  recordedBy: string;
  note: string;
  packageId?: string;
};

export type AdminAuditLog = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  objectType: "package" | "customer" | "payment";
  objectId: string;
  customerId?: string;
  packageId?: string;
  previousValue: string;
  newValue: string;
  occurredAt: string;
  note: string;
};

export type AdminDatabase = {
  version: 1;
  customers: CustomerRecord[];
  packages: AdminPackage[];
  packageStatusHistory: PackageStatusHistoryEntry[];
  balanceTransactions: BalanceTransaction[];
  payments: PaymentRecord[];
  adminUsers: AdminUser[];
  adminAuditLogs: AdminAuditLog[];
};

export const DEMO_ADMIN: AdminUser = {
  id: "admin-001",
  name: "Alex Morgan",
  email: "admin@shipfusionja.com",
  role: "admin",
  title: "Operations administrator",
  permissions: ["dashboard:read", "packages:read", "packages:write", "customers:read", "balances:write", "activity:read"],
};

export const DEMO_ADMIN_DATABASE: AdminDatabase = {
  version: 1,
  adminUsers: [
    DEMO_ADMIN,
    {
      id: "admin-002",
      name: "Sarah Bennett",
      email: "sarah.bennett@shipfusionja.demo",
      role: "viewer",
      title: "Customer support",
      permissions: ["dashboard:read", "packages:read", "customers:read", "activity:read"],
    },
  ],
  customers: [
    { id: "customer-1048", accountNumber: "1048", name: "Jordan Campbell", email: "jordan.campbell@example.com", phone: "+1 (876) 555-0148", joinedAt: "2024-03-14", accountStatus: "Active", address: "Kingston 8, St. Andrew, Jamaica" },
    { id: "customer-1049", accountNumber: "1049", name: "John Smith", email: "john.smith.demo@example.com", phone: "+1 (876) 555-0101", joinedAt: "2022-11-08", accountStatus: "Active", address: "Half Way Tree, St. Andrew, Jamaica" },
    { id: "customer-1052", accountNumber: "1052", name: "Sarah Williams", email: "sarah.williams.demo@example.com", phone: "+1 (876) 555-0102", joinedAt: "2023-06-21", accountStatus: "Active", address: "Montego Bay, St. James, Jamaica" },
    { id: "customer-1053", accountNumber: "1053", name: "Michael Brown", email: "michael.brown.demo@example.com", phone: "+1 (876) 555-0103", joinedAt: "2024-01-17", accountStatus: "Active", address: "Spanish Town, St. Catherine, Jamaica" },
    { id: "customer-1057", accountNumber: "1057", name: "Keisha Thompson", email: "keisha.thompson.demo@example.com", phone: "+1 (876) 555-0107", joinedAt: "2025-02-03", accountStatus: "Review", address: "Portmore, St. Catherine, Jamaica" },
    { id: "customer-1061", accountNumber: "1061", name: "Andre Blake", email: "andre.blake.demo@example.com", phone: "+1 (876) 555-0111", joinedAt: "2025-08-26", accountStatus: "Active", address: "Mandeville, Manchester, Jamaica" },
  ],
  packages: [
    {
      id: "SFJ-2026-10482", customerId: "customer-1048", description: "Electronics Package", method: "Air Freight", dateReceived: "2026-09-28", weight: "8.4 lb", dimensions: "16 × 12 × 8 in", origin: "Miami, FL", destination: "Kingston, Jamaica", status: "In Transit", estimatedDelivery: "2026-10-05", shippingPrice: 86.5, customsFees: 8.5, additionalFees: 4, amountPaid: 0, declaredValue: 499, customerVisibleNotes: "Your package is on its way to our Kingston hub.", internalNotes: "Fragile electronics. Verify outer carton condition at arrival.", lastUpdated: "2026-10-02T14:18:00.000Z",
    },
    {
      id: "SFJ-2026-10397", customerId: "customer-1048", description: "Home & Kitchen Box", method: "Air Freight", dateReceived: "2026-09-25", weight: "6.2 lb", dimensions: "14 × 10 × 9 in", origin: "Miami, FL", destination: "Kingston, Jamaica", status: "Ready for Delivery", estimatedDelivery: "2026-10-03", shippingPrice: 64, customsFees: 6, additionalFees: 0, amountPaid: 70, declaredValue: 225, customerVisibleNotes: "Ready for collection at the Kingston hub.", internalNotes: "Customer prefers an afternoon pickup.", lastUpdated: "2026-10-01T20:40:00.000Z",
    },
    {
      id: "SFJ-2026-10261", customerId: "customer-1048", description: "Sneakers & Apparel", method: "Air Freight", dateReceived: "2026-09-18", weight: "3.8 lb", dimensions: "13 × 9 × 6 in", origin: "Fort Lauderdale, FL", destination: "Kingston, Jamaica", status: "Delivered", estimatedDelivery: "2026-09-25", shippingPrice: 42.75, customsFees: 3.25, additionalFees: 0, amountPaid: 46, declaredValue: 180, customerVisibleNotes: "Delivered successfully. Thanks for shipping with us!", internalNotes: "Delivery signature received.", lastUpdated: "2026-09-25T15:16:00.000Z",
    },
    {
      id: "SFJ-2026-10140", customerId: "customer-1048", description: "Personal Care Supplies", method: "Sea Freight", dateReceived: "2026-09-12", weight: "24.0 lb", dimensions: "24 × 18 × 16 in", origin: "Miami, FL", destination: "Kingston, Jamaica", status: "Processing", estimatedDelivery: "2026-10-14", shippingPrice: 128, customsFees: 12, additionalFees: 0, amountPaid: 0, declaredValue: 320, customerVisibleNotes: "We are preparing your shipment for the next scheduled container.", internalNotes: "Consolidate with the October 7 container.", lastUpdated: "2026-09-30T19:20:00.000Z",
    },
    {
      id: "SFJ-2026-10086", customerId: "customer-1048", description: "Awaiting online order", method: "Air Freight", dateReceived: null, weight: "—", dimensions: "—", origin: "Miami, FL", destination: "Kingston, Jamaica", status: "Awaiting Package", estimatedDelivery: null, shippingPrice: 0, customsFees: 0, additionalFees: 0, amountPaid: 0, declaredValue: 0, customerVisibleNotes: "We are waiting for your retailer to deliver this order.", internalNotes: "Tracking number entered by customer through the portal.", lastUpdated: "2026-09-30T13:12:00.000Z",
    },
    {
      id: "SFJ-2026-10412", customerId: "customer-1049", description: "Laptop Accessories", method: "Air Freight", dateReceived: "2026-09-29", weight: "5.5 lb", dimensions: "15 × 11 × 7 in", origin: "Miami, FL", destination: "Kingston, Jamaica", status: "Shipped", estimatedDelivery: "2026-10-06", shippingPrice: 72, customsFees: 9, additionalFees: 5, amountPaid: 0, declaredValue: 350, customerVisibleNotes: "Your shipment has left our Miami facility.", internalNotes: "Confirm customer collection preference after arrival.", lastUpdated: "2026-10-01T22:35:00.000Z",
    },
    {
      id: "SFJ-2026-10388", customerId: "customer-1049", description: "Running Shoes", method: "Sea Freight", dateReceived: "2026-09-11", weight: "4.1 lb", dimensions: "14 × 10 × 6 in", origin: "Orlando, FL", destination: "Kingston, Jamaica", status: "Delivered", estimatedDelivery: "2026-09-26", shippingPrice: 34, customsFees: 4, additionalFees: 6, amountPaid: 44, declaredValue: 145, customerVisibleNotes: "Delivered to the address on file.", internalNotes: "Delivery receipt filed.", lastUpdated: "2026-09-26T17:02:00.000Z",
    },
    {
      id: "SFJ-2026-10219", customerId: "customer-1049", description: "Automotive Part", method: "Air Freight", dateReceived: "2026-09-23", weight: "11.0 lb", dimensions: "18 × 14 × 11 in", origin: "Orlando, FL", destination: "Kingston, Jamaica", status: "Ready for Delivery", estimatedDelivery: "2026-10-02", shippingPrice: 42, customsFees: 5, additionalFees: 3, amountPaid: 11, declaredValue: 260, customerVisibleNotes: "Your package is ready. Please contact us to arrange pickup.", internalNotes: "Balance due before release to customer.", lastUpdated: "2026-10-02T12:40:00.000Z",
    },
    {
      id: "SFJ-2026-10406", customerId: "customer-1052", description: "Beauty & Wellness Box", method: "Express Courier", dateReceived: "2026-09-27", weight: "4.8 lb", dimensions: "13 × 10 × 8 in", origin: "Fort Lauderdale, FL", destination: "Montego Bay, Jamaica", status: "Shipped", estimatedDelivery: "2026-10-04", shippingPrice: 38, customsFees: 6, additionalFees: 2, amountPaid: 46, declaredValue: 210, customerVisibleNotes: "Your express shipment is moving toward Jamaica.", internalNotes: "Express service selected; confirm arrival scan with carrier.", lastUpdated: "2026-10-01T09:12:00.000Z",
    },
    {
      id: "SFJ-2026-10401", customerId: "customer-1053", description: "Kitchen Appliance", method: "Sea Freight", dateReceived: "2026-09-26", weight: "22.0 lb", dimensions: "22 × 18 × 14 in", origin: "Miami, FL", destination: "Spanish Town, Jamaica", status: "Customs Processing", estimatedDelivery: "2026-10-07", shippingPrice: 89, customsFees: 10, additionalFees: 5, amountPaid: 25.5, declaredValue: 410, customerVisibleNotes: "Your shipment is being reviewed by Jamaica Customs.", internalNotes: "Awaiting customs assessment. Do not promise release date.", lastUpdated: "2026-10-02T11:22:00.000Z",
    },
    {
      id: "SFJ-2026-10371", customerId: "customer-1053", description: "Books & School Supplies", method: "Air Freight", dateReceived: "2026-09-18", weight: "7.2 lb", dimensions: "15 × 12 × 8 in", origin: "Miami, FL", destination: "Spanish Town, Jamaica", status: "Delivered", estimatedDelivery: "2026-09-29", shippingPrice: 48, customsFees: 5, additionalFees: 2, amountPaid: 55, declaredValue: 165, customerVisibleNotes: "Delivered successfully.", internalNotes: "No issues reported.", lastUpdated: "2026-09-29T16:35:00.000Z",
    },
    {
      id: "SFJ-2026-10319", customerId: "customer-1053", description: "Small Home Goods", method: "Air Freight", dateReceived: "2026-09-22", weight: "6.0 lb", dimensions: "14 × 10 × 8 in", origin: "Orlando, FL", destination: "Spanish Town, Jamaica", status: "Processing", estimatedDelivery: "2026-10-06", shippingPrice: 62, customsFees: 6, additionalFees: 2, amountPaid: 70, declaredValue: 190, customerVisibleNotes: "Your package is being processed at our U.S. facility.", internalNotes: "Normal handling.", lastUpdated: "2026-09-30T14:00:00.000Z",
    },
    {
      id: "SFJ-2026-10280", customerId: "customer-1053", description: "Phone & Accessories", method: "Express Courier", dateReceived: "2026-09-16", weight: "3.2 lb", dimensions: "12 × 9 × 5 in", origin: "Miami, FL", destination: "Spanish Town, Jamaica", status: "Out for Delivery", estimatedDelivery: "2026-10-02", shippingPrice: 24, customsFees: 4, additionalFees: 2, amountPaid: 30, declaredValue: 280, customerVisibleNotes: "Your package is with our local delivery partner today.", internalNotes: "Customer requested call on arrival.", lastUpdated: "2026-10-02T10:05:00.000Z",
    },
    {
      id: "SFJ-2026-10202", customerId: "customer-1053", description: "Garden Tools", method: "Sea Freight", dateReceived: "2026-09-19", weight: "16.0 lb", dimensions: "20 × 15 × 12 in", origin: "Orlando, FL", destination: "Spanish Town, Jamaica", status: "Received", estimatedDelivery: "2026-10-20", shippingPrice: 33, customsFees: 6, additionalFees: 2.5, amountPaid: 41.5, declaredValue: 125, customerVisibleNotes: "Your package was received and is being checked in.", internalNotes: "Check for restricted item declaration before export.", lastUpdated: "2026-09-28T13:26:00.000Z",
    },
    {
      id: "SFJ-2026-10328", customerId: "customer-1057", description: "Furniture Hardware", method: "Sea Freight", dateReceived: "2026-09-10", weight: "18.5 lb", dimensions: "19 × 15 × 12 in", origin: "Miami, FL", destination: "Portmore, Jamaica", status: "On Hold", estimatedDelivery: "2026-10-11", shippingPrice: 65, customsFees: 8, additionalFees: 5, amountPaid: 50, declaredValue: 230, customerVisibleNotes: "We need a little more information before this package can move forward. Our team will be in touch.", internalNotes: "Hold for updated invoice from customer. Keep this note internal.", lastUpdated: "2026-10-01T18:50:00.000Z",
    },
    {
      id: "SFJ-2026-10211", customerId: "customer-1057", description: "Children's Books", method: "Air Freight", dateReceived: "2026-09-17", weight: "5.4 lb", dimensions: "13 × 10 × 7 in", origin: "Fort Lauderdale, FL", destination: "Portmore, Jamaica", status: "Arrived in Jamaica", estimatedDelivery: "2026-10-04", shippingPrice: 24, customsFees: 4, additionalFees: 4, amountPaid: 32, declaredValue: 95, customerVisibleNotes: "Your package has arrived in Jamaica and is moving through clearance.", internalNotes: "Priority release once customs scan is received.", lastUpdated: "2026-10-02T08:44:00.000Z",
    },
    {
      id: "SFJ-2026-10423", customerId: "customer-1061", description: "Online Store Return", method: "Air Freight", dateReceived: null, weight: "—", dimensions: "—", origin: "Miami, FL", destination: "Mandeville, Jamaica", status: "Cancelled", estimatedDelivery: null, shippingPrice: 0, customsFees: 0, additionalFees: 0, amountPaid: 0, declaredValue: 80, customerVisibleNotes: "This shipment request has been cancelled.", internalNotes: "Customer cancelled before warehouse receipt.", lastUpdated: "2026-09-24T16:15:00.000Z",
    },
    {
      id: "SFJ-2026-10350", customerId: "customer-1061", description: "Small Business Samples", method: "Air Freight", dateReceived: "2026-09-21", weight: "9.3 lb", dimensions: "17 × 13 × 9 in", origin: "Miami, FL", destination: "Mandeville, Jamaica", status: "Received", estimatedDelivery: "2026-10-08", shippingPrice: 54, customsFees: 6, additionalFees: 2, amountPaid: 62, declaredValue: 375, customerVisibleNotes: "Your package was received at our Miami warehouse.", internalNotes: "Business shipment; keep goods grouped as one consignment.", lastUpdated: "2026-09-27T12:32:00.000Z",
    },
  ],
  packageStatusHistory: [
    { id: "hist-10482-1", packageId: "SFJ-2026-10482", previousStatus: "Awaiting Package", newStatus: "Received", changedAt: "2026-09-28T15:42:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Checked in at the Doral warehouse." },
    { id: "hist-10482-2", packageId: "SFJ-2026-10482", previousStatus: "Received", newStatus: "Processing", changedAt: "2026-09-29T18:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Weighed, measured, and prepared for air freight." },
    { id: "hist-10482-3", packageId: "SFJ-2026-10482", previousStatus: "Processing", newStatus: "Shipped", changedAt: "2026-09-30T01:30:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Flight departed Miami International Airport." },
    { id: "hist-10482-4", packageId: "SFJ-2026-10482", previousStatus: "Shipped", newStatus: "In Transit", changedAt: "2026-10-02T14:18:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Shipment is moving to the Kingston hub." },
    { id: "hist-10397-1", packageId: "SFJ-2026-10397", previousStatus: "Awaiting Package", newStatus: "Received", changedAt: "2026-09-25T16:12:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Received at the Doral warehouse." },
    { id: "hist-10397-2", packageId: "SFJ-2026-10397", previousStatus: "Shipped", newStatus: "Arrived in Jamaica", changedAt: "2026-09-28T11:05:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Arrived at the Kingston hub." },
    { id: "hist-10397-3", packageId: "SFJ-2026-10397", previousStatus: "Arrived in Jamaica", newStatus: "Ready for Delivery", changedAt: "2026-10-01T20:40:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Ready for collection or local delivery." },
    { id: "hist-10261-1", packageId: "SFJ-2026-10261", previousStatus: "In Transit", newStatus: "Delivered", changedAt: "2026-09-25T15:16:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Delivered successfully. Signature on file." },
    { id: "hist-10140-1", packageId: "SFJ-2026-10140", previousStatus: "Received", newStatus: "Processing", changedAt: "2026-09-13T21:20:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Consolidating with the next scheduled container." },
    { id: "hist-10086-1", packageId: "SFJ-2026-10086", previousStatus: null, newStatus: "Awaiting Package", changedAt: "2026-09-30T13:12:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Tracking number added by customer." },
    { id: "hist-10412-1", packageId: "SFJ-2026-10412", previousStatus: "Received", newStatus: "Shipped", changedAt: "2026-10-01T22:35:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Manifest closed for the Miami departure." },
    { id: "hist-10388-1", packageId: "SFJ-2026-10388", previousStatus: "Out for Delivery", newStatus: "Delivered", changedAt: "2026-09-26T17:02:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Delivered to the address on file." },
    { id: "hist-10219-1", packageId: "SFJ-2026-10219", previousStatus: "Customs Processing", newStatus: "Ready for Delivery", changedAt: "2026-10-02T12:40:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Cleared and ready for customer collection." },
    { id: "hist-10406-1", packageId: "SFJ-2026-10406", previousStatus: "Processing", newStatus: "Shipped", changedAt: "2026-10-01T09:12:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Express carrier pickup confirmed." },
    { id: "hist-10401-1", packageId: "SFJ-2026-10401", previousStatus: "Arrived in Jamaica", newStatus: "Customs Processing", changedAt: "2026-10-02T11:22:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Submitted for customs assessment." },
    { id: "hist-10371-1", packageId: "SFJ-2026-10371", previousStatus: "Out for Delivery", newStatus: "Delivered", changedAt: "2026-09-29T16:35:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Delivered successfully." },
    { id: "hist-10319-1", packageId: "SFJ-2026-10319", previousStatus: "Received", newStatus: "Processing", changedAt: "2026-09-30T14:00:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Package processing started." },
    { id: "hist-10280-1", packageId: "SFJ-2026-10280", previousStatus: "Ready for Delivery", newStatus: "Out for Delivery", changedAt: "2026-10-02T10:05:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Handed to the local delivery partner." },
    { id: "hist-10202-1", packageId: "SFJ-2026-10202", previousStatus: null, newStatus: "Received", changedAt: "2026-09-28T13:26:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Checked in at the Orlando partner facility." },
    { id: "hist-10328-1", packageId: "SFJ-2026-10328", previousStatus: "Processing", newStatus: "On Hold", changedAt: "2026-10-01T18:50:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Waiting on an updated customer invoice." },
    { id: "hist-10211-1", packageId: "SFJ-2026-10211", previousStatus: "Shipped", newStatus: "Arrived in Jamaica", changedAt: "2026-10-02T08:44:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Arrived at Norman Manley International Airport." },
    { id: "hist-10423-1", packageId: "SFJ-2026-10423", previousStatus: "Awaiting Package", newStatus: "Cancelled", changedAt: "2026-09-24T16:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", note: "Customer cancelled before warehouse receipt." },
    { id: "hist-10350-1", packageId: "SFJ-2026-10350", previousStatus: null, newStatus: "Received", changedAt: "2026-09-27T12:32:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", note: "Received at the Miami warehouse." },
  ],
  balanceTransactions: [
    { id: "txn-jc-1", customerId: "customer-1048", type: "Charge", amount: 86.5, description: "Shipping charge · SFJ-2026-10482", adminNote: "Air freight shipping charge", occurredAt: "2026-09-28T15:45:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10482" },
    { id: "txn-jc-2", customerId: "customer-1048", type: "Fee", amount: 12.5, description: "Customs and handling fees · SFJ-2026-10482", adminNote: "Customs 8.50 · handling 4.00", occurredAt: "2026-09-28T15:46:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10482" },
    { id: "txn-jc-3", customerId: "customer-1048", type: "Charge", amount: 64, description: "Shipping charge · SFJ-2026-10397", adminNote: "Air freight shipping charge", occurredAt: "2026-09-25T16:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10397" },
    { id: "txn-jc-4", customerId: "customer-1048", type: "Fee", amount: 6, description: "Customs fees · SFJ-2026-10397", adminNote: "Customs assessment", occurredAt: "2026-09-25T16:16:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10397" },
    { id: "txn-jc-5", customerId: "customer-1048", type: "Payment", amount: -70, description: "Payment received · SFJ-2026-10397", adminNote: "Card payment", occurredAt: "2026-09-29T17:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10397", paymentId: "pay-jc-1" },
    { id: "txn-jc-6", customerId: "customer-1048", type: "Charge", amount: 42.75, description: "Shipping charge · SFJ-2026-10261", adminNote: "Air freight shipping charge", occurredAt: "2026-09-18T14:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10261" },
    { id: "txn-jc-7", customerId: "customer-1048", type: "Fee", amount: 3.25, description: "Customs fees · SFJ-2026-10261", adminNote: "Customs assessment", occurredAt: "2026-09-18T14:01:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10261" },
    { id: "txn-jc-8", customerId: "customer-1048", type: "Payment", amount: -46, description: "Payment received · SFJ-2026-10261", adminNote: "Card payment", occurredAt: "2026-09-22T16:10:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10261", paymentId: "pay-jc-2" },
    { id: "txn-jc-9", customerId: "customer-1048", type: "Charge", amount: 128, description: "Shipping charge · SFJ-2026-10140", adminNote: "Sea freight shipping charge", occurredAt: "2026-09-12T20:25:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10140" },
    { id: "txn-jc-10", customerId: "customer-1048", type: "Fee", amount: 12, description: "Customs fees · SFJ-2026-10140", adminNote: "Customs assessment", occurredAt: "2026-09-12T20:26:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10140" },

    { id: "txn-js-1", customerId: "customer-1049", type: "Charge", amount: 72, description: "Shipping charge · SFJ-2026-10412", adminNote: "Air freight shipping charge", occurredAt: "2026-09-29T15:00:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", packageId: "SFJ-2026-10412" },
    { id: "txn-js-2", customerId: "customer-1049", type: "Fee", amount: 14, description: "Customs and handling fees · SFJ-2026-10412", adminNote: "Customs 9.00 · handling 5.00", occurredAt: "2026-09-29T15:01:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", packageId: "SFJ-2026-10412" },
    { id: "txn-js-3", customerId: "customer-1049", type: "Charge", amount: 34, description: "Shipping charge · SFJ-2026-10388", adminNote: "Sea freight shipping charge", occurredAt: "2026-09-11T13:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10388" },
    { id: "txn-js-4", customerId: "customer-1049", type: "Fee", amount: 10, description: "Customs and handling fees · SFJ-2026-10388", adminNote: "Customs 4.00 · handling 6.00", occurredAt: "2026-09-11T13:01:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10388" },
    { id: "txn-js-5", customerId: "customer-1049", type: "Payment", amount: -44, description: "Payment received · SFJ-2026-10388", adminNote: "Mobile payment", occurredAt: "2026-09-26T17:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10388", paymentId: "pay-js-1" },
    { id: "txn-js-6", customerId: "customer-1049", type: "Charge", amount: 42, description: "Shipping charge · SFJ-2026-10219", adminNote: "Air freight shipping charge", occurredAt: "2026-09-23T14:45:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10219" },
    { id: "txn-js-7", customerId: "customer-1049", type: "Fee", amount: 8, description: "Customs and handling fees · SFJ-2026-10219", adminNote: "Customs 5.00 · handling 3.00", occurredAt: "2026-09-23T14:46:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10219" },
    { id: "txn-js-8", customerId: "customer-1049", type: "Payment", amount: -11, description: "Partial payment received · SFJ-2026-10219", adminNote: "Cash payment recorded", occurredAt: "2026-10-02T12:41:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10219", paymentId: "pay-js-2" },

    { id: "txn-sw-1", customerId: "customer-1052", type: "Charge", amount: 38, description: "Shipping charge · SFJ-2026-10406", adminNote: "Express courier shipping charge", occurredAt: "2026-09-27T12:10:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10406" },
    { id: "txn-sw-2", customerId: "customer-1052", type: "Fee", amount: 8, description: "Customs and handling fees · SFJ-2026-10406", adminNote: "Customs 6.00 · handling 2.00", occurredAt: "2026-09-27T12:11:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10406" },
    { id: "txn-sw-3", customerId: "customer-1052", type: "Payment", amount: -46, description: "Payment received · SFJ-2026-10406", adminNote: "Card payment", occurredAt: "2026-09-27T12:20:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10406", paymentId: "pay-sw-1" },

    { id: "txn-mb-1", customerId: "customer-1053", type: "Charge", amount: 89, description: "Shipping charge · SFJ-2026-10401", adminNote: "Sea freight shipping charge", occurredAt: "2026-09-26T14:20:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10401" },
    { id: "txn-mb-2", customerId: "customer-1053", type: "Fee", amount: 15, description: "Customs and handling fees · SFJ-2026-10401", adminNote: "Customs 10.00 · handling 5.00", occurredAt: "2026-09-26T14:21:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10401" },
    { id: "txn-mb-3", customerId: "customer-1053", type: "Payment", amount: -25.5, description: "Payment received · SFJ-2026-10401", adminNote: "Partial card payment", occurredAt: "2026-09-28T16:30:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10401", paymentId: "pay-mb-1" },
    { id: "txn-mb-4", customerId: "customer-1053", type: "Charge", amount: 48, description: "Shipping charge · SFJ-2026-10371", adminNote: "Air freight shipping charge", occurredAt: "2026-09-18T13:40:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10371" },
    { id: "txn-mb-5", customerId: "customer-1053", type: "Fee", amount: 7, description: "Customs and handling fees · SFJ-2026-10371", adminNote: "Customs 5.00 · handling 2.00", occurredAt: "2026-09-18T13:41:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10371" },
    { id: "txn-mb-6", customerId: "customer-1053", type: "Payment", amount: -55, description: "Payment received · SFJ-2026-10371", adminNote: "Card payment", occurredAt: "2026-09-29T16:40:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10371", paymentId: "pay-mb-2" },
    { id: "txn-mb-7", customerId: "customer-1053", type: "Charge", amount: 62, description: "Shipping charge · SFJ-2026-10319", adminNote: "Air freight shipping charge", occurredAt: "2026-09-22T15:30:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10319" },
    { id: "txn-mb-8", customerId: "customer-1053", type: "Fee", amount: 8, description: "Customs and handling fees · SFJ-2026-10319", adminNote: "Customs 6.00 · handling 2.00", occurredAt: "2026-09-22T15:31:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10319" },
    { id: "txn-mb-9", customerId: "customer-1053", type: "Payment", amount: -70, description: "Payment received · SFJ-2026-10319", adminNote: "Card payment", occurredAt: "2026-09-30T15:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10319", paymentId: "pay-mb-3" },
    { id: "txn-mb-10", customerId: "customer-1053", type: "Charge", amount: 24, description: "Shipping charge · SFJ-2026-10280", adminNote: "Express courier shipping charge", occurredAt: "2026-09-16T14:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10280" },
    { id: "txn-mb-11", customerId: "customer-1053", type: "Fee", amount: 6, description: "Customs and handling fees · SFJ-2026-10280", adminNote: "Customs 4.00 · handling 2.00", occurredAt: "2026-09-16T14:16:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10280" },
    { id: "txn-mb-12", customerId: "customer-1053", type: "Payment", amount: -30, description: "Payment received · SFJ-2026-10280", adminNote: "Card payment", occurredAt: "2026-10-02T10:15:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10280", paymentId: "pay-mb-4" },
    { id: "txn-mb-13", customerId: "customer-1053", type: "Charge", amount: 33, description: "Shipping charge · SFJ-2026-10202", adminNote: "Sea freight shipping charge", occurredAt: "2026-09-19T13:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10202" },
    { id: "txn-mb-14", customerId: "customer-1053", type: "Fee", amount: 8.5, description: "Customs and handling fees · SFJ-2026-10202", adminNote: "Customs 6.00 · handling 2.50", occurredAt: "2026-09-19T13:01:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10202" },
    { id: "txn-mb-15", customerId: "customer-1053", type: "Payment", amount: -41.5, description: "Payment received · SFJ-2026-10202", adminNote: "Card payment", occurredAt: "2026-09-28T14:30:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10202", paymentId: "pay-mb-5" },

    { id: "txn-kt-1", customerId: "customer-1057", type: "Charge", amount: 65, description: "Shipping charge · SFJ-2026-10328", adminNote: "Sea freight shipping charge", occurredAt: "2026-09-10T12:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10328" },
    { id: "txn-kt-2", customerId: "customer-1057", type: "Fee", amount: 13, description: "Customs and handling fees · SFJ-2026-10328", adminNote: "Customs 8.00 · handling 5.00", occurredAt: "2026-09-10T12:01:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10328" },
    { id: "txn-kt-3", customerId: "customer-1057", type: "Payment", amount: -50, description: "Payment received · SFJ-2026-10328", adminNote: "Partial payment", occurredAt: "2026-09-18T11:30:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10328", paymentId: "pay-kt-1" },
    { id: "txn-kt-4", customerId: "customer-1057", type: "Charge", amount: 24, description: "Shipping charge · SFJ-2026-10211", adminNote: "Air freight shipping charge", occurredAt: "2026-09-17T13:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10211" },
    { id: "txn-kt-5", customerId: "customer-1057", type: "Fee", amount: 8, description: "Customs and handling fees · SFJ-2026-10211", adminNote: "Customs 4.00 · handling 4.00", occurredAt: "2026-09-17T13:01:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10211" },
    { id: "txn-kt-6", customerId: "customer-1057", type: "Payment", amount: -32, description: "Payment received · SFJ-2026-10211", adminNote: "Card payment", occurredAt: "2026-09-28T09:00:00.000Z", adminId: "admin-001", adminName: "Alex Morgan", packageId: "SFJ-2026-10211", paymentId: "pay-kt-2" },

    { id: "txn-ab-1", customerId: "customer-1061", type: "Charge", amount: 54, description: "Shipping charge · SFJ-2026-10350", adminNote: "Air freight shipping charge", occurredAt: "2026-09-21T14:00:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", packageId: "SFJ-2026-10350" },
    { id: "txn-ab-2", customerId: "customer-1061", type: "Fee", amount: 8, description: "Customs and handling fees · SFJ-2026-10350", adminNote: "Customs 6.00 · handling 2.00", occurredAt: "2026-09-21T14:01:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", packageId: "SFJ-2026-10350" },
    { id: "txn-ab-3", customerId: "customer-1061", type: "Payment", amount: -62, description: "Payment received · SFJ-2026-10350", adminNote: "Card payment", occurredAt: "2026-09-27T12:45:00.000Z", adminId: "admin-002", adminName: "Sarah Bennett", packageId: "SFJ-2026-10350", paymentId: "pay-ab-1" },
  ],
  payments: [
    { id: "pay-jc-1", customerId: "customer-1048", amount: 70, method: "Visa •••• 2841", reference: "SFJ-PAY-80421", status: "Completed", paidAt: "2026-09-29T17:00:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10397" },
    { id: "pay-jc-2", customerId: "customer-1048", amount: 46, method: "Visa •••• 2841", reference: "SFJ-PAY-79644", status: "Completed", paidAt: "2026-09-22T16:10:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10261" },
    { id: "pay-js-1", customerId: "customer-1049", amount: 44, method: "Mobile payment", reference: "SFJ-PAY-78811", status: "Completed", paidAt: "2026-09-26T17:15:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10388" },
    { id: "pay-js-2", customerId: "customer-1049", amount: 11, method: "Cash", reference: "SFJ-PAY-81602", status: "Completed", paidAt: "2026-10-02T12:41:00.000Z", recordedBy: "Alex Morgan", note: "Partial payment for SFJ-2026-10219" },
    { id: "pay-sw-1", customerId: "customer-1052", amount: 46, method: "Visa •••• 5186", reference: "SFJ-PAY-79201", status: "Completed", paidAt: "2026-09-27T12:20:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10406" },
    { id: "pay-mb-1", customerId: "customer-1053", amount: 25.5, method: "Visa •••• 0364", reference: "SFJ-PAY-79311", status: "Completed", paidAt: "2026-09-28T16:30:00.000Z", recordedBy: "Alex Morgan", note: "Partial payment for SFJ-2026-10401" },
    { id: "pay-mb-2", customerId: "customer-1053", amount: 55, method: "Visa •••• 0364", reference: "SFJ-PAY-78109", status: "Completed", paidAt: "2026-09-29T16:40:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10371" },
    { id: "pay-mb-3", customerId: "customer-1053", amount: 70, method: "Visa •••• 0364", reference: "SFJ-PAY-79882", status: "Completed", paidAt: "2026-09-30T15:00:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10319" },
    { id: "pay-mb-4", customerId: "customer-1053", amount: 30, method: "Visa •••• 0364", reference: "SFJ-PAY-81609", status: "Completed", paidAt: "2026-10-02T10:15:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10280" },
    { id: "pay-mb-5", customerId: "customer-1053", amount: 41.5, method: "Visa •••• 0364", reference: "SFJ-PAY-79421", status: "Completed", paidAt: "2026-09-28T14:30:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10202" },
    { id: "pay-kt-1", customerId: "customer-1057", amount: 50, method: "Cash", reference: "SFJ-PAY-77381", status: "Completed", paidAt: "2026-09-18T11:30:00.000Z", recordedBy: "Alex Morgan", note: "Partial payment for SFJ-2026-10328" },
    { id: "pay-kt-2", customerId: "customer-1057", amount: 32, method: "Visa •••• 6281", reference: "SFJ-PAY-79912", status: "Completed", paidAt: "2026-09-28T09:00:00.000Z", recordedBy: "Alex Morgan", note: "Payment for SFJ-2026-10211" },
    { id: "pay-ab-1", customerId: "customer-1061", amount: 62, method: "Visa •••• 1193", reference: "SFJ-PAY-79610", status: "Completed", paidAt: "2026-09-27T12:45:00.000Z", recordedBy: "Sarah Bennett", note: "Payment for SFJ-2026-10350" },
  ],
  adminAuditLogs: [
    { id: "audit-seed-1", adminId: "admin-001", adminName: "Alex Morgan", action: "updated package status", objectType: "package", objectId: "SFJ-2026-10482", packageId: "SFJ-2026-10482", customerId: "customer-1048", previousValue: "Processing", newValue: "In Transit", occurredAt: "2026-10-02T14:18:00.000Z", note: "Shipment is moving to the Kingston hub." },
    { id: "audit-seed-2", adminId: "admin-001", adminName: "Alex Morgan", action: "recorded payment", objectType: "payment", objectId: "SFJ-PAY-81602", customerId: "customer-1049", packageId: "SFJ-2026-10219", previousValue: "Outstanding $50.00", newValue: "Payment $11.00 · balance $39.00", occurredAt: "2026-10-02T12:41:00.000Z", note: "Cash payment recorded." },
    { id: "audit-seed-3", adminId: "admin-002", adminName: "Sarah Bennett", action: "updated package status", objectType: "package", objectId: "SFJ-2026-10401", packageId: "SFJ-2026-10401", customerId: "customer-1053", previousValue: "Arrived in Jamaica", newValue: "Customs Processing", occurredAt: "2026-10-02T11:22:00.000Z", note: "Submitted for customs assessment." },
    { id: "audit-seed-4", adminId: "admin-001", adminName: "Alex Morgan", action: "updated package status", objectType: "package", objectId: "SFJ-2026-10280", packageId: "SFJ-2026-10280", customerId: "customer-1053", previousValue: "Ready for Delivery", newValue: "Out for Delivery", occurredAt: "2026-10-02T10:05:00.000Z", note: "Handed to the local delivery partner." },
    { id: "audit-seed-5", adminId: "admin-001", adminName: "Alex Morgan", action: "recorded payment", objectType: "payment", objectId: "SFJ-PAY-80421", customerId: "customer-1048", packageId: "SFJ-2026-10397", previousValue: "Outstanding $70.00", newValue: "Payment $70.00 · balance $0.00", occurredAt: "2026-09-29T17:00:00.000Z", note: "Card payment received." },
  ],
};

export function getCustomerBalance(database: AdminDatabase, customerId: string): number {
  return roundCurrency(database.balanceTransactions.filter((item) => item.customerId === customerId).reduce((total, item) => total + item.amount, 0));
}

export function getCustomerFinancials(database: AdminDatabase, customerId: string) {
  const transactions = database.balanceTransactions.filter((item) => item.customerId === customerId);
  const balance = roundCurrency(transactions.reduce((total, item) => total + item.amount, 0));
  const shippingCharges = roundCurrency(database.packages.filter((item) => item.customerId === customerId).reduce((total, item) => total + item.shippingPrice, 0));
  const totalPayments = roundCurrency(Math.abs(transactions.filter((item) => item.type === "Payment").reduce((total, item) => total + item.amount, 0)));
  return { currentBalance: balance, shippingCharges, totalPayments, outstandingAmount: Math.max(balance, 0) };
}

export function packageTotal(item: AdminPackage): number {
  return roundCurrency(item.shippingPrice + item.customsFees + item.additionalFees);
}

export function getPackageBalance(item: AdminPackage): number {
  return roundCurrency(Math.max(packageTotal(item) - item.amountPaid, 0));
}

export function getPackagePaymentStatus(item: AdminPackage): PaymentStatus {
  const balance = getPackageBalance(item);
  if (balance <= 0) return "Paid";
  return item.amountPaid > 0 ? "Partially paid" : "Balance due";
}

export function hasAdminPermission(user: AdminUser, permission: AdminPermission): boolean {
  return user.role === "admin" && user.permissions.includes(permission);
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatDate(value: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", ...options }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}
