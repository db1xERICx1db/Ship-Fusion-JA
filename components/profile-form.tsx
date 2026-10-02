"use client";

import { useState, type FormEvent } from "react";
import { Check, Save } from "lucide-react";
import { customer } from "@/lib/demo-data";

export function ProfileForm() {
  const [saved, setSaved] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaved(true); }
  return <form className="profile-form-card" onSubmit={handleSubmit}><div className="profile-card-heading"><div><span className="form-kicker">YOUR DETAILS</span><h2>Personal information</h2></div><span className="profile-verified"><Check size={14} /> DEMO PROFILE</span></div><div className="form-grid profile-form-grid"><label>Full name<input defaultValue={customer.name} /></label><label>Email address<input type="email" defaultValue={customer.email} /></label><label>Phone / WhatsApp<input type="tel" defaultValue={customer.phone} /></label><label>Preferred destination<input defaultValue="Kingston, Jamaica" /></label><label className="form-full">Default delivery address<textarea rows={3} defaultValue="Add your preferred delivery address when you're ready to use a live account." /></label></div><div className="profile-save-row">{saved && <span className="profile-saved-note"><Check size={15} /> Saved for this demo session</span>}<button className="button button-dark" type="submit"><Save size={16} /> Save changes</button></div></form>;
}
