# Ship Fusion Jamaica

A responsive Next.js website for a Jamaican freight-forwarding company, with a marketing site, a sample customer shipping portal, and a separate staff admin console.

## Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`. Use `npm run build` for a production build, `npm start` to serve it, and `npm run lint` for ESLint checks.

## Routes

- `/` — marketing homepage and service overview
- `/services`, `/how-it-works`, `/shipping`, `/quote`, `/contact` — customer information pages
- `/login` — demo customer redirect to `/dashboard`
- `/dashboard` — sample customer overview and active shipment tracking
- `/dashboard/packages` — searchable and filterable customer package list
- `/dashboard/packages/[id]` — shipment status, tracking timeline, fees, and payment status
- `/dashboard/payments` — sample invoices and billing history
- `/dashboard/profile` — sample account profile
- `/admin/login` — separate staff demo sign-in
- `/admin` — operations dashboard and package metrics
- `/admin/packages` — package search, filters, status changes, and package editing
- `/admin/customers` — customer directory and account summaries
- `/admin/customers/[id]` — customer profile, packages, payments, ledger, and account activity
- `/admin/activity` — administrative audit log
- any unknown path — branded "page not found" screen (`app/not-found.tsx`)

## Admin demo account

The demo sign-in is shown on `/admin/login`:

```text
Email:    admin@shipfusionja.com
Password: FusionAdmin26!
```

The admin routes check a signed, HTTP-only, same-site session cookie on the server. For a deployed **demo**, configure `ADMIN_SESSION_SECRET` to a unique random value. The demo API also accepts `ADMIN_DEMO_EMAIL` and `ADMIN_DEMO_PASSWORD` overrides; if you change those, update the demo-visible credentials in `components/admin/admin-login-form.tsx` to match.

> **Production security boundary:** this is a frontend/demo implementation, not production authentication or a durable audit system. The demo credentials and fallback signing key are intentionally available for local demonstration. Before connecting real customer or financial data, replace `lib/admin-auth.ts` and `/api/admin/session` with your identity provider (for example, Supabase Auth), enforce role/permission checks on every server action and data query, and enable database row-level security. Never rely on a client-side role or browser storage to authorize production access.

## Admin demo architecture and data

The customer portal and staff console use separate layouts and routes. Admin demo records are typed in `lib/admin-data.ts` as distinct collections:

- `customers`
- `packages`
- `packageStatusHistory`
- `balanceTransactions`
- `payments`
- `adminUsers`
- `adminAuditLogs`

`components/admin/admin-data-provider.tsx` is the demo data-access adapter. It seeds fictional records and persists admin changes in browser `localStorage` so a status or balance adjustment remains visible when you navigate around the demo. Replace this adapter with server-side database queries/mutations without needing to redesign the admin UI.

A customer balance is calculated as the sum of signed balance transactions. Charges/fees increase the amount due; payments, credits, and refunds reduce it. Editing a package total prompts for confirmation and writes a corresponding ledger adjustment. Status history is stored separately from each package’s current status. Important changes also create audit records with admin, timestamp, previous/new values, and notes. Customer-visible package notes and private internal notes are separate fields.

All admin and customer examples are fictional. Browser storage is not tamper-proof and is not a production accounting ledger; audit entries must be written and protected by the backend in a real release.

## Existing customer demo data and future backend

Sample customer-portal records are centralized in `lib/demo-data.ts`, with typed shipment statuses and package fields. The portal intentionally labels its records as fictional demo data. Replace that module with account-scoped server data and add authentication/session checks at the dashboard layout or data-access boundary when connecting a backend. The quote form and payment controls currently provide frontend-only demo feedback; they do not send email, store requests, or process payments.

The hero image is a generated local asset at `public/images/hero-port.webp`. The brand’s contact details and public social links are defined in the shared site components.

## Deploying to Vercel

The app deploys as a standard Next.js project. `vercel.json` pins the build settings for every deployment so the project can never be built as a static site:

- `framework: "nextjs"` — overrides the project's Framework Preset
- `installCommand: "npm install"` and `buildCommand: "npm run build"` — install dependencies and run `next build`
- `outputDirectory: null` — uses the Next.js default output (`.vercel/output`)

### Fixing a `404: NOT_FOUND` on every URL

If the homepage and every other route return Vercel's `404 NOT_FOUND` page while files under `public/` (for example `/images/hero-port.webp`) still load, Vercel is serving the `public/` folder as the site root instead of running Next.js. That is what happens when the Framework Preset is **Other**: Vercel then uses `public` as the output directory, so no app route exists.

Confirm these values in the Vercel dashboard under **Settings → Build and Deployment**:

- **Framework Preset**: `Next.js`
- **Root Directory**: repository root (leave empty)
- **Build Command**, **Output Directory**, **Install Command**: Override **off** (`vercel.json` supplies them)
- **Node.js Version**: `22.x`

Then redeploy from **Deployments → ⋯ → Redeploy** with “Use existing build cache” disabled. Note that Vercel Deployment Protection can also put a deployment behind a Vercel login; the public production URL is <https://ship-fusion-ja.vercel.app>.
