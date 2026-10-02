"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";

export function DemoDataAlert() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return <div className="dashboard-alert"><div className="alert-icon"><CircleHelp size={17} /></div><p><strong>Demo customer account.</strong> All packages, balances, and activity shown here are fictional sample data.</p><button aria-label="Dismiss demo message" onClick={() => setVisible(false)}>×</button></div>;
}
