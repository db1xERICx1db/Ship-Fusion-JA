"use client";

import { useState } from "react";
import { ArrowUpRight, Check, CreditCard } from "lucide-react";

export function PayNowButton({ amount }: { amount: string }) {
  const [showMessage, setShowMessage] = useState(false);
  return <div className="pay-now-control"><button className="button button-lime" onClick={() => setShowMessage(true)}><CreditCard size={17} /> Pay now <ArrowUpRight size={16} /></button>{showMessage && <div className="payment-demo-message" role="status"><Check size={15} /> Demo only — payment processing isn’t connected. Contact our team to settle your {amount} balance.</div>}</div>;
}
