# Ship Fusion Jamaica

A responsive Next.js website for a Jamaican freight-forwarding company, with a marketing site and a sample customer shipping portal.

## Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`. Use `npm run build` for a production build, `npm start` to serve it, and `npm run lint` for ESLint checks.

## Routes

- `/` — marketing homepage and service overview
- `/services`, `/how-it-works`, `/shipping`, `/quote`, `/contact` — customer information pages
- `/login` — demo redirect to `/dashboard`
- `/dashboard` — sample customer overview and active shipment tracking
- `/dashboard/packages` — searchable and filterable package list
- `/dashboard/packages/[id]` — detailed shipment status, tracking timeline, fees, and payment status
- `/dashboard/payments` — sample invoices and billing history
- `/dashboard/profile` — sample account profile

## Demo data and future backend

All sample customer and shipment records are centralized in `lib/demo-data.ts`, with typed shipment statuses and package fields. The portal intentionally labels its records as fictional demo data. Replace that module with account-scoped server data and add authentication/session checks at the dashboard layout or data-access boundary when connecting a backend. The quote form and payment controls currently provide frontend-only demo feedback; they do not send email, store requests, or process payments.

The hero image is a generated local asset at `public/images/hero-port.webp`. The brand’s contact details and public social links are defined in the shared site components.
