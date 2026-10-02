"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Package, ShieldCheck, Sparkles } from "lucide-react";

const demoEmail = "admin@shipfusionja.com";
const demoPassword = "FusionAdmin26!";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to sign in. Check your details and try again.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("We could not reach the sign-in service. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand-panel">
        <Link className="admin-brand admin-login-brand" href="/" aria-label="Back to Ship Fusion Jamaica home">
          <span className="admin-brand-icon"><Package size={21} strokeWidth={2.2} /></span>
          <span className="admin-brand-word"><strong>SHIP FUSION</strong><small>JAMAICA <i>·</i> STAFF</small></span>
        </Link>
        <div className="admin-login-hero-copy"><span className="admin-login-eyebrow"><i /> PRIVATE OPERATIONS WORKSPACE</span><h1>Every shipment.<br /><em>In good hands.</em></h1><p>One clear view of package movement, customer accounts, and the decisions behind every update.</p></div>
        <div className="admin-login-illustration" aria-hidden="true">
          <div className="admin-login-orbit admin-login-orbit-one" /><div className="admin-login-orbit admin-login-orbit-two" />
          <div className="admin-login-route"><span>US</span><i /><Package size={19} /><i /><span>JM</span></div>
          <div className="admin-login-mini-card"><span className="admin-login-mini-icon"><Package size={16} /></span><span><strong>Operations protected</strong><small>Activity is recorded for review</small></span><CheckCircle2 size={16} /></div>
        </div>
        <div className="admin-login-panel-foot"><span><ShieldCheck size={15} /> Staff access only</span><span>Secure demo session</span></div>
      </section>

      <section className="admin-login-form-panel">
        <Link className="admin-login-back" href="/"><ArrowLeft size={15} /> Back to Ship Fusion</Link>
        <div className="admin-login-card">
          <span className="admin-login-lock"><LockKeyhole size={19} /></span>
          <div className="admin-login-heading"><span>WELCOME BACK</span><h2>Admin sign in</h2><p>Sign in to your Ship Fusion staff workspace.</p></div>
          <form className="admin-login-fields" onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Work email</label>
            <div className="admin-login-input-wrap"><span>@</span><input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div className="admin-login-password-label"><label htmlFor="admin-password">Password</label><span>Demo access</span></div>
            <div className="admin-login-input-wrap"><LockKeyhole size={15} /><input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            <button className="admin-login-submit" type="submit" disabled={pending}>{pending ? "Checking access…" : <>Enter admin workspace <ArrowRight size={17} /></>}</button>
          </form>
          <div className="admin-demo-credentials"><span className="admin-demo-credentials-icon"><Sparkles size={15} /></span><div><strong>Demo staff account</strong><p>Email: <b>{demoEmail}</b><br />Password: <b>{demoPassword}</b></p></div></div>
          <p className="admin-login-disclaimer"><ShieldCheck size={13} /> Demo workspace only. No live customer records or payments.</p>
        </div>
        <div className="admin-login-bottom-note">Ship Fusion Jamaica <i>·</i> Staff portal</div>
      </section>
    </main>
  );
}
