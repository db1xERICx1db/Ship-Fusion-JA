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
- any unknown path — branded "page not found" screen (`app/not-found.tsx`)

## Demo data and future backend

All sample customer and shipment records are centralized in `lib/demo-data.ts`, with typed shipment statuses and package fields. The portal intentionally labels its records as fictional demo data. Replace that module with account-scoped server data and add authentication/session checks at the dashboard layout or data-access boundary when connecting a backend. The quote form and payment controls currently provide frontend-only demo feedback; they do not send email, store requests, or process payments.

The hero image is a generated local asset at `public/images/hero-port.webp`. The brand’s contact details and public social links are defined in the shared site components.

## Deploying to Vercel

The app deploys as a standard Next.js project. `vercel.json` pins the build settings for every deployment so the project can never be built as a static site:

- `framework: "nextjs"` — overrides the project's Framework Preset
- `installCommand: "npm install"` and `buildCommand: "npm run build"` — install dependencies and run `next build`
- `outputDirectory: null` — uses the Next.js default output (`.vercel/output`)

### Fixing a `404: NOT_FOUND` on every URL

If the homepage and every other route return Vercel's `404 NOT_FOUND` page while files under `public/` (for example `/images/hero-port.webp`) still load, Vercel is serving the `public/` folder as the site root instead of running Next.js. That is what happens when the Framework Preset is **Other**: Vercel then uses `public` as the output directory, so the static image resolves but no route exists.

Confirm these values in the Vercel dashboard under **Settings → Build and Deployment**:

- **Framework Preset**: `Next.js`
- **Root Directory**: repository root (leave empty)
- **Build Command**, **Output Directory**, **Install Command**: Override **off** (`vercel.json` supplies them)
- **Node.js Version**: `22.x`

Then redeploy from **Deployments → ⋯ → Redeploy** with “Use existing build cache” disabled. Note that Vercel Deployment Protection can also put a deployment behind a Vercel login; the public production URL is <https://ship-fusion-ja.vercel.app>.
