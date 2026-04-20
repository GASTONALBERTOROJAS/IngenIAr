# VEGA ERP - Technical Specification

## Overview

VEGA (Nordex Steel Towers ERP) is an internal Enterprise Resource Planning system for the Steel Towers area at Nordex SE. It centralizes and tracks all costs related to wind turbine tower manufacturing and supply.

## Business Flow

1. **Logistics** - Loads transport costs for towers to site
2. **Purchasing** - Negotiates steel plates and flanges contracts with suppliers
3. **Internals** - Assigns suppliers by material and tower model
4. **Conversion** - Sends RFQs to tower makers and receives manufacturing quotes
5. **Sourcing Board** - Consolidates all costs per project
6. **Direction** - Reviews and approves (total, conditional) or rejects
7. **Finance** - Consumes data for reports and cost tracking

## Technology Stack (100% Free)

| Layer | Technology | Cost |
|-------|------------|------|
| Framework | Next.js 14 + TypeScript | Free |
| Styles | Tailwind CSS | Free |
| ORM | Prisma | Free |
| Database (dev) | PostgreSQL 16 local | Free |
| Database (prod) | Supabase | ~25€/month |
| Auth | NextAuth.js v5 | Free |
| File Storage | Supabase Storage | Free tier |
| Email | Resend.com | 3000/month free |
| Hosting | Vercel | Free tier |
| Version Control | GitHub | Free |

## User Roles

| Role | Permissions |
|------|-------------|
| admin | Full access. User management, global config |
| purchasing_steel | Steel contracts. Assignment to projects. SPOT purchases |
| purchasing_flanges | Flanges contracts. Assignment to projects. SPOT purchases |
| internals | Internals matrix. Assignment by project and tower model |
| logistics | Logistics costs per project. Direct shipments to site |
| conversion | RFQs to tower makers. Quotes. Sourcing Board |
| direction | Sourcing Board approval. Project unlock. Audit trail |
| finance | Read-only. All costs. Report generation |

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| primary | #135091 | Primary buttons, nav active, accents |
| primary-dark | #0D3A6B | Headers, sidebar, text on dark backgrounds |
| primary-light | #1A6BC4 | Hover states, secondary links |
| primary-tint | #E8F0FB | Info card backgrounds |
| background | #F5F7FA | General app background |
| surface | #FFFFFF | Cards, modals, panels, forms |
| text-primary | #2C2C2C | Main text |
| text-muted | #64748B | Labels, placeholders, secondary |
| border | #E0E4EB | Borders for cards, inputs, tables |
| success | #1A7A44 | Approved, operational |
| warning | #C45A00 | Pending, conditional |
| danger | #B91C1C | Error, rejected |

### Typography

- **Font**: Inter
- **H1**: 28px, semibold, #135091
- **H2**: 20px, medium, #2C2C2C
- **H3**: 15px, medium, #2C2C2C
- **Body**: 14px, normal, relaxed line-height
- **Small**: 12px, normal, #64748B
- **Micro**: 11px, normal, #64748B

## Implementation Phases

### Phase 1: Base Project & Authentication (1-2 weeks)
- Create Next.js project with TypeScript and Tailwind
- Install all dependencies
- Configure local PostgreSQL database (vega_dev)
- Set up Prisma with complete schema and run migrations
- Configure NextAuth.js v5 with credentials (email + password with bcrypt)
- Create API Route POST /api/auth/register for user creation
- Create middleware.ts for route protection by role
- Implement base layout with sidebar, header with username and logout
- Set up next-intl with ES/EN translations
- Create seed.ts for initial admin user: admin@nordex-online.com / Admin1234!

### Phase 2: Masters (1-2 weeks)
- Full CRUD for suppliers: list with filters, create/edit form, active/inactive toggle
- Full CRUD for tower models with all fields
- CRUD for internals catalog: materials and applicability by models
- CRUD for internals matrix: table interface with supplier, material, model, incoterm, price, sharewallet
- User management page: create users, assign role and area, activate/deactivate
- Validations with react-hook-form + zod on all forms

### Phase 3: Steel & Flanges Contracts (1-2 weeks)
- Contract CRUD: create with ton bag, base price, validity dates, supplier
- Conditions per contract CRUD: type, description, price impact (fixed or percentage)
- Contract bag status view: progress bar total/consumed/available
- Visual alert when consumed_tons/total_tons >= 80%
- Automatic status change to exhausted at 100%
- Filter contracts by category (steel/flanges), supplier and status

### Phase 4: Projects & Tower Groups (1-2 weeks)
- Project creation form: code, name, country, exchange rate
- Tower groups management within project: add model, quantity, tons override
- Manufacturing schedule calendar interface per group: weeks and quantities
- Project list with filters by status, country and tower model
- Project detail view with all its tower groups
- Implement is_locked logic: lock writing on costs when project is approved

### Phase 5: Steel, Flanges & Internals Costs (2-3 weeks)
- Steel module: select active contract → auto-load base price → select conditions → calculate total. Support three line types: contract, others_model, spot
- When assigning steel: subtract tons_assigned from contract.consumed_tons. On delete: return
- Flanges module: same scheme. Text justification required always
- Internals module: when selecting tower model, auto-load corresponding internals matrix
- Incoterms logic: compare supplier.country with project.project_country. DAP same country → logistics_cost = 0 and field locked. DDP → 0 locked. EXW → field free
- Manual override of logistics_cost with mandatory justification field
- Sharewallet: show % used/available. Warning at 80%. Lock at 100%

### Phase 6: Logistics & Direct Shipments (1 week)
- Logistics costs form with 15 fields from template
- Automatic calculation of total_per_tower and project_total
- In Sourcing Board view: show single line with total_per_tower. On click: expand with complete breakdown
- Direct shipments module to site: anchor cage, bolts, MV cable, damper. included_in_sourcing_board = false

### Phase 7: RFQ & Tower Maker Management (2 weeks)
- Multiple selection of tower makers from catalog (category tower_maker)
- RFQ Excel generation with preloaded DM using xlsx or exceljs library
- Automatic email sending to each selected tower maker with Resend: attach Excel, indicate project, number of towers and 5-day deadline
- RFQ tracking per project: table with tower maker, status, send date, deadline
- Response loading page: upload tower maker Excel → preview parsed data → confirm import to database
- Quote comparison: table with all quoted tower makers and their prices
- Winner tower maker selection per tower group → creates ProjectTowerGroupMaker

### Phase 8: Complete Sourcing Board (2 weeks)
- Consolidated Sourcing Board view: costs grouped by area and by tower group
- Collapsed logistics section by default with toggle to view breakdown
- Comments section with @user detection that generates automatic tasks
- Approval flow: rejected (version +1, back to RFQ) | conditionally_approved | approved
- On approved: is_locked = true. Save snapshot_json with all costs at that moment
- Sourcing Board export: "Export Excel" button and "Export PDF" button
- Task tray in main menu per user with filters by status and project
- Validation: project conditionally_approved with pending/in_progress tasks cannot go to approved

### Phase 9: Change Control & Audit Trail (1 week)
- Change request form on locked projects: area, field, proposed value, justification
- Email notification to users with direction role when a request arrives
- Approval workflow: direction approves or rejects from ERP
- If approved: temporarily unlock only that field and area. Re-lock after modification
- Automatic write to AuditLog on each approved change
- Change history view per project accessible to direction and finance

### Phase 10: Finance, Reporting & Deployment (2 weeks)
- Unified costs view per project for finance role: read-only, no edit buttons
- Main dashboard with KPIs: projects by status, active contracts, available tons
- Reports: total cost per project, contract consumption by period, costs by supplier
- Report export to Excel with exceljs and to PDF with pdfkit or puppeteer
- Complete WCAG AA accessibility review on all components
- Create Vercel account and connect GitHub repository
- Create project in Supabase and migrate schema: npx prisma migrate deploy
- Configure environment variables in Vercel
- First production deployment. Verify everything works with real data

## Business Rules

### Contracts (Steel & Flanges)
- A supplier can have multiple active contracts in parallel
- When assigning tons to a project: Contract.consumed_tons += tons_assigned (automatic)
- When unassigning: Contract.consumed_tons -= tons_assigned (always recalculated)
- If consumed_tons >= total_tons → status = exhausted. Cannot assign more
- If consumed_tons / total_tons >= 0.8 → visual alert in contracts view
- SPOT purchase: contract_id = null. Does not consume bag. Requires written justification
- SPOT purchase allows attaching file (offer or supplier email)

### Internals - Incoterms Logic
- EXW: buyer assumes all logistics cost from origin. Free editable field
- DAP same country (supplier.country === project.project_country): logistics_cost = 0 and field automatically locked
- DAP different country: tower maker introduces final cost from arrival to site destination
- DDP: logistics_cost = 0 always. Field locked. Shows 0 explicitly in SB
- Manual override: purchasing team can overwrite any value with mandatory justification. Recorded in AuditLog

### Sharewallet of Internals
- Each InternalsMatrix line has sharewallet_pct: % of volume assigned to that supplier
- When assigning an internal to a project: sharewallet_used increases proportionally
- Visual warning when sharewallet_used >= 80% of sharewallet_pct
- Automatic lock when sharewallet_used >= sharewallet_pct. Supplier not shown as available
- Only show suppliers with active contracts and available quota

### Project Locking & Change Control
- After total approval in Sourcing Board: Project.is_locked = true
- With is_locked = true: no area can edit project costs directly
- To modify: area sends ChangeRequest with field, proposed value and justification
- Direction receives email notification and approves or rejects from ERP
- If approved: unlock only that specific field and area for modification
- Each approved change generates immutable record in AuditLog (old value + new)
- AuditLog never deletes. Is the historical source of truth for the project

### Sourcing Board & Approval
- Each project can have multiple Sourcing Board versions (version field)
- outcome = rejected: new RFQ round. Creates SourcingBoard with version += 1
- outcome = conditionally_approved: launch orders but there are conditions. Creates tasks with @mentions
- A project conditionally_approved cannot go to approved with pending or in_progress tasks
- outcome = approved: is_locked = true. snapshot_json saves all costs at that moment
- Logistics in SB: single line with total_per_tower. Expandable to see full breakdown
- Direct shipments (anchor_cage, bolts, mv_cable, damper): NOT shown in SB. Yes in finance

### Authentication & Users
- Authentication with NextAuth.js v5 using own credentials (email + password)
- Passwords stored hashed with bcrypt (never plaintext)
- Admin creates users from user management panel. No public self-registration
- Each user has a role (global permissions) and area (modules they can see and edit)
- Next.js middleware protects each route verifying role and area of active session
- Language selector (ES/EN) visible in header. Saved in user profile (DB)

## Database Schema

Complete Prisma schema with all models:
- Supplier (categories: steel, flanges, internals, tower_maker, logistics)
- TowerModel
- User
- InternalsCatalog
- InternalsMatrix
- Contract
- ContractCondition
- Project
- ProjectTowerGroup
- ProjectTowerGroupMaker
- ProjectSteelCost
- ProjectFlangesCost
- ProjectInternalsCost
- ProjectLogisticsCost
- ProjectDirectCost
- RfqRequest
- SourcingBoard
- Task
- ChangeRequest
- AuditLog

## Project Structure

```
vega-erp/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── suppliers/page.tsx
│   │   ├── contracts/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── sourcing-board/page.tsx
│   │   ├── rfq/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── reports/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── suppliers/route.ts
│       ├── contracts/route.ts
│       ├── projects/route.ts
│       ├── rfq/route.ts
│       └── reports/route.ts
├── components/
│   ├── ui/
│   ├── layout/
│   └── modules/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── resend.ts
│   └── supabase.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── messages/
│   ├── es.json
│   └── en.json
├── middleware.ts
├── .env.local
├── .env.production
└── package.json
```

## Installation Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest vega-erp --typescript --tailwind --app

# 2. Enter folder
cd vega-erp

# 3. Install main dependencies
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs @types/bcryptjs
npm install resend
npm install @supabase/supabase-js
npm install next-intl
npm install lucide-react
npm install @tanstack/react-table
npm install react-hook-form @hookform/resolvers zod

# 4. Initialize Prisma
npx prisma init

# 5. Create local database
createdb vega_dev

# 6. Run migrations (after schema.prisma is defined)
npx prisma migrate dev --name init

# 7. Open Prisma Studio
npx prisma studio

# 8. Start development server
npm run dev
```

## Environment Variables

### .env.local (local development)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/vega_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="vega@nordex-online.com"
```

### .env.production (Vercel/production)
```
DATABASE_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"
NEXTAUTH_URL="https://vega.vercel.app"
NEXTAUTH_SECRET="same-secret-as-local"
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="vega@nordex-online.com"
```

## Total Duration

14-19 weeks (3.5 to 5 months)