# VEGA ERP

Enterprise Resource Planning system for Nordex Steel Towers.

## Overview

VEGA centralizes and tracks all costs related to wind turbine tower manufacturing and supply:
- Steel plates and flanges contracts
- Internal components matrix
- Logistics costs
- Tower maker conversion (RFQ)
- Sourcing Board consolidation
- Project approval workflow
- Change control and audit trail

## Tech Stack (100% Free)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 16 (local) / Supabase (production) |
| Auth | NextAuth.js v5 |
| Styles | Tailwind CSS |
| i18n | next-intl (ES/EN) |
| Storage | Supabase Storage |
| Email | Resend.com |
| Hosting | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 16
- pnpm (recommended) or npm

### Installation

```bash
# 1. Clone or create the project
git clone <repository-url> vega-erp
cd vega-erp

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your database credentials

# 4. Create local database
createdb vega_dev

# 5. Generate Prisma client
pnpm db:generate

# 6. Run migrations
pnpm db:migrate

# 7. Seed the database (creates admin user)
pnpm db:seed

# 8. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

- Email: `admin@nordex-online.com`
- Password: `Admin1234!`

## Project Structure

```
vega-erp/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── suppliers/
│   │   ├── contracts/
│   │   ├── projects/
│   │   ├── sourcing-board/
│   │   ├── rfq/
│   │   ├── tasks/
│   │   ├── reports/
│   │   └── users/
│   └── api/              # API Routes
│       └── auth/
├── components/
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── resend.ts         # Email client
│   └── supabase.ts       # Storage client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seed
├── messages/              # i18n translations
│   ├── es.json
│   └── en.json
└── SPEC.md               # Full specification
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Reset database |

## User Roles

| Role | Description |
|------|-------------|
| admin | Full access |
| purchasing_steel | Steel contracts management |
| purchasing_flanges | Flanges contracts management |
| internals | Internals matrix management |
| logistics | Logistics costs |
| conversion | RFQ and tower makers |
| direction | Project approval |
| finance | Read-only reports |

## Implementation Phases

1. **Base Project & Auth** - Next.js setup, NextAuth, database
2. **Masters** - Suppliers, tower models, users CRUD
3. **Contracts** - Steel and flanges contract management
4. **Projects** - Project creation with tower groups
5. **Costs** - Steel, flanges, internals costs per project
6. **Logistics** - Logistics cost template, direct shipments
7. **RFQ** - Tower maker RFQ workflow
8. **Sourcing Board** - Consolidation and approval
9. **Change Control** - Change requests and audit log
10. **Finance & Deploy** - Reports and production deployment

Total: 14-19 weeks (3.5 to 5 months)

## Documentation

- [SPEC.md](./SPEC.md) - Full technical specification
- [INSTALL.md](./INSTALL.md) - Detailed installation guide