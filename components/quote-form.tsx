"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Send } from "lucide-react";

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="quote-form-wrap">
      {submitted ? (
        <div className="quote-success" role="status">
          <div className="quote-success-icon"><Check size={27} /></div>
          <span className="quote-success-label">DEMO REQUEST READY</span>
          <h2>Thanks for telling us what you’re shipping.</h2>
          <p>This demo form is not connected yet, so your details haven’t been sent or saved. Connect a backend or email service to receive live quote requests.</p>
          <button className="button button-dark" onClick={() => setSubmitted(false)}>Try the form again <ArrowRight size={16} /></button>
        </div>
      ) : (
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="form-kicker">TELL US WHAT YOU’RE SHIPPING</span><h2>Let’s get your quote started.</h2><p>Share a few details and our team will be in touch with the best way to move your package.</p></div>
          <div className="form-grid">
            <label>Full name <input autoComplete="name" name="name" placeholder="e.g. Jordan Campbell" required /></label>
            <label>Email address <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Phone / WhatsApp <input autoComplete="tel" name="phone" type="tel" placeholder="+1 (876) 000-0000" required /></label>
            <label>Shipping origin <select name="origin" defaultValue="Miami, Florida"><option>Miami, Florida</option><option>Fort Lauderdale, Florida</option><option>Orlando, Florida</option><option>Other U.S. location</option></select></label>
            <label>Destination in Jamaica <input name="destination" placeholder="Town or parish" required /></label>
            <label>Shipping method <select name="method" defaultValue="Not sure yet"><option>Not sure yet</option><option>Air freight</option><option>Sea freight</option><option>Barrel shipping</option><option>Container shipping</option></select></label>
            <label>Package type <select name="packageType" defaultValue="Box / parcel"><option>Box / parcel</option><option>Barrel</option><option>Oversized item</option><option>Commercial shipment</option><option>Other</option></select></label>
            <label>Approximate weight <input name="weight" placeholder="e.g. 15 lb" /></label>
            <label>Package dimensions <input name="dimensions" placeholder="Length × width × height" /></label>
            <label>Number of packages <input name="quantity" type="number" min="1" defaultValue="1" /></label>
            <label className="form-full">Describe the items <input name="description" placeholder="A short description of your shipment" required /></label>
            <label>Preferred shipping date <input name="date" type="date" /></label>
            <label className="form-full">Additional information <textarea name="notes" rows={4} placeholder="Anything else we should know?" /></label>
          </div>
          <div className="form-submit-row"><p>Demo only — this form does not store or send your details.</p><button className="button button-dark" type="submit">Request quote <Send size={16} /></button></div>
        </form>
      )}
    </div>
  );
}
