import type { LucideIcon } from "lucide-react";
import {
  Box,
  CreditCard,
  Headphones,
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Truck,
} from "lucide-react";

export type ShipmentStatus =
  | "Awaiting Package"
  | "Received"
  | "Processing"
  | "Shipped"
  | "In Transit"
  | "Customs"
  | "Ready for Delivery"
  | "Delivered";

export type DemoPackage = {
  id: string;
  description: string;
  method: string;
  dateReceived: string;
  location: string;
  status: ShipmentStatus;
  eta: string;
  price: number;
  weight: string;
  dimensions: string;
  origin: string;
  destination: string;
  customs: number;
  additionalFees: number;
  paymentStatus: "Paid" | "Balance due";
  events: { date: string; title: string; detail: string; complete: boolean; current?: boolean }[];
};

export const customer = {
  name: "Jordan Campbell",
  initials: "JC",
  email: "jordan.campbell@example.com",
  phone: "+1 (876) 555-0148",
  membership: "Customer since 2024",
};

export const packages: DemoPackage[] = [
  {
    id: "SFJ-2026-10482",
    description: "Electronics Package",
    method: "Air Freight",
    dateReceived: "Sep 28, 2026",
    location: "Kingston Hub",
    status: "In Transit",
    eta: "Oct 5, 2026",
    price: 86.50,
    weight: "8.4 lb",
    dimensions: "16 × 12 × 8 in",
    origin: "Miami, FL",
    destination: "Kingston, Jamaica",
    customs: 8.50,
    additionalFees: 4.00,
    paymentStatus: "Balance due",
    events: [
      { date: "Sep 28 · 10:42 AM", title: "Package received", detail: "Checked in at our Doral, Florida warehouse.", complete: true },
      { date: "Sep 29 · 2:15 PM", title: "Package processed", detail: "Weighed, measured, and prepared for air freight.", complete: true },
      { date: "Sep 30 · 8:30 PM", title: "Departed U.S. facility", detail: "Flight departed Miami International Airport.", complete: true },
      { date: "Oct 2 · 9:18 AM", title: "Arrived in Jamaica", detail: "Landed at Norman Manley International Airport.", complete: true },
      { date: "Oct 3 · In progress", title: "Customs processing", detail: "Your shipment is being cleared for release.", complete: true, current: true },
      { date: "Oct 5 · Estimated", title: "Ready for delivery", detail: "We'll let you know as soon as it's ready.", complete: false },
    ],
  },
  {
    id: "SFJ-2026-10397",
    description: "Home & Kitchen Box",
    method: "Air Freight",
    dateReceived: "Sep 25, 2026",
    location: "Kingston Hub",
    status: "Ready for Delivery",
    eta: "Oct 3, 2026",
    price: 64.00,
    weight: "6.2 lb",
    dimensions: "14 × 10 × 9 in",
    origin: "Miami, FL",
    destination: "Kingston, Jamaica",
    customs: 6.00,
    additionalFees: 0,
    paymentStatus: "Paid",
    events: [
      { date: "Sep 25 · 11:12 AM", title: "Package received", detail: "Checked in at our Doral, Florida warehouse.", complete: true },
      { date: "Sep 26 · 1:45 PM", title: "Package processed", detail: "Shipment prepared for the next available flight.", complete: true },
      { date: "Sep 28 · 7:05 AM", title: "Arrived in Jamaica", detail: "Your package arrived at our Kingston hub.", complete: true },
      { date: "Oct 1 · 3:40 PM", title: "Ready for delivery", detail: "Collect or schedule delivery at your convenience.", complete: true, current: true },
    ],
  },
  {
    id: "SFJ-2026-10261",
    description: "Sneakers & Apparel",
    method: "Air Freight",
    dateReceived: "Sep 18, 2026",
    location: "Delivered to customer",
    status: "Delivered",
    eta: "Sep 25, 2026",
    price: 42.75,
    weight: "3.8 lb",
    dimensions: "13 × 9 × 6 in",
    origin: "Fort Lauderdale, FL",
    destination: "Kingston, Jamaica",
    customs: 3.25,
    additionalFees: 0,
    paymentStatus: "Paid",
    events: [
      { date: "Sep 18 · 9:05 AM", title: "Package received", detail: "Received at our Fort Lauderdale partner location.", complete: true },
      { date: "Sep 19 · 12:40 PM", title: "Package processed", detail: "Shipping label created and package secured.", complete: true },
      { date: "Sep 22 · 6:10 AM", title: "Arrived in Jamaica", detail: "Arrived at the Kingston hub.", complete: true },
      { date: "Sep 24 · 2:30 PM", title: "Out for delivery", detail: "With your local delivery partner.", complete: true },
      { date: "Sep 25 · 10:16 AM", title: "Delivered", detail: "Delivered successfully. Thanks for shipping with us!", complete: true, current: true },
    ],
  },
  {
    id: "SFJ-2026-10140",
    description: "Personal Care Supplies",
    method: "Sea Freight",
    dateReceived: "Sep 12, 2026",
    location: "Miami, FL warehouse",
    status: "Processing",
    eta: "Oct 14, 2026",
    price: 128.00,
    weight: "24.0 lb",
    dimensions: "24 × 18 × 16 in",
    origin: "Miami, FL",
    destination: "Kingston, Jamaica",
    customs: 12.00,
    additionalFees: 0,
    paymentStatus: "Balance due",
    events: [
      { date: "Sep 12 · 4:20 PM", title: "Package received", detail: "Checked in at our Doral, Florida warehouse.", complete: true },
      { date: "Sep 13 · In progress", title: "Preparing for sea freight", detail: "Consolidating with the next scheduled container.", complete: true, current: true },
      { date: "Oct 7 · Estimated", title: "Departing Miami", detail: "Scheduled container departure.", complete: false },
      { date: "Oct 14 · Estimated", title: "Arrive in Jamaica", detail: "We'll notify you when your shipment reaches Kingston.", complete: false },
    ],
  },
  {
    id: "SFJ-2026-10086",
    description: "Awaiting online order",
    method: "Air Freight",
    dateReceived: "—",
    location: "Waiting for delivery",
    status: "Awaiting Package",
    eta: "Pending receipt",
    price: 0,
    weight: "—",
    dimensions: "—",
    origin: "Miami, FL",
    destination: "Kingston, Jamaica",
    customs: 0,
    additionalFees: 0,
    paymentStatus: "Paid",
    events: [
      { date: "Sep 30 · 8:12 AM", title: "Tracking number added", detail: "We are waiting for your retailer to deliver the package.", complete: true, current: true },
      { date: "Pending", title: "Package received", detail: "We'll update your tracking as soon as it arrives.", complete: false },
    ],
  },
];

export const services: { icon: LucideIcon; title: string; description: string; accent: string }[] = [
  { icon: Plane, title: "Fast 24–48 hour shipping", description: "Get your packages quickly with our 24–48 hour delivery service from the U.S. to Jamaica.", accent: "lime" },
  { icon: PackageCheck, title: "Easy barrel & customs brokerage clearance", description: "We handle the brokerage process so you can spend less time worrying about paperwork.", accent: "blue" },
  { icon: Ship, title: "Efficient air & sea freight", description: "Choose the balance of speed and value that fits your shipment and your schedule.", accent: "blue" },
  { icon: Box, title: "Convenient self-packed packages", description: "Pack it your way. We'll take care of the careful handling and delivery from there.", accent: "lime" },
  { icon: Truck, title: "Affordable container shipments", description: "Big or small, personal or commercial, we've got room for what matters to you.", accent: "blue" },
  { icon: CreditCard, title: "Reliable online credit card purchases", description: "Shopping online is simple with support for your eligible credit-card purchases.", accent: "lime" },
  { icon: Headphones, title: "Excellent customer service", description: "Real support from a friendly team, here to help you every step of the way.", accent: "blue" },
  { icon: ShieldCheck, title: "Safe & secure handling", description: "Your packages are handled with care from our U.S. warehouse straight to Jamaica.", accent: "lime" },
];

export const processSteps = [
  { number: "01", title: "Shop or pack", description: "Order online or prepare your package. Use your Ship Fusion address at checkout.", icon: ShoppingBag },
  { number: "02", title: "Ship to Ship Fusion", description: "Send your items to our U.S. location and add your tracking number to your account.", icon: Truck },
  { number: "03", title: "Ship Fusion processes your package", description: "We receive, process, and move your shipment through the right freight channel.", icon: PackageCheck },
  { number: "04", title: "Receive in Jamaica", description: "Track your package online and collect or arrange delivery when it is ready.", icon: Box },
];

export const money = (amount: number) =>
  new Intl.NumberFormat("en-JM", { style: "currency", currency: "JMD", maximumFractionDigits: 0 }).format(amount);
