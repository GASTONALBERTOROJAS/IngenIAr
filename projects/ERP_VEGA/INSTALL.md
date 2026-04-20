# VEGA ERP - Installation Guide

## Prerequisites

### Software Required

1. **Node.js 18+**
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL 16**
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql@16`
   - Linux: `sudo apt install postgresql-16`

3. **pnpm** (recommended)
   - Install: `npm install -g pnpm`
   - Verify: `pnpm --version`

## Step-by-Step Installation

### 1. Database Setup

#### Install and Start PostgreSQL

**Windows:**
1. Download PostgreSQL installer from postgresql.org
2. Run installer, note your password for postgres user
3. PostgreSQL service should start automatically
4. Open pgAdmin or psql to verify

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql-16
sudo systemctl start postgresql
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql console:
CREATE DATABASE vega_dev;

# Exit psql
\q
```

### 2. Project Setup

```bash
# Navigate to projects folder
cd C:\Users\Gaston Alberto\Desktop\WORKSPACE\ai_developer\projects

# Create project (or copy existing files)
npx create-next-app@latest vega-erp --typescript --tailwind --app
cd vega-erp

# Install dependencies
pnpm install
```

### 3. Environment Configuration

Create `.env.local` in project root:

```env
# Database - LOCAL PostgreSQL
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vega_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Supabase Storage (optional for development)
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend Email (optional for development)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="vega@nordex-online.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Initialize Prisma

```bash
# Generate Prisma Client
pnpm db:generate

# Create database tables
pnpm db:migrate

# (Optional) Open Prisma Studio to view data
pnpm db:studio
```

### 5. Seed Database

```bash
pnpm db:seed
```

This creates:
- Admin user: `admin@nordex-online.com` / `Admin1234!`
- Sample suppliers (ArcelorMittal, Vulcan International)
- Sample tower model (V150-4.2)
- Sample contracts

### 6. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

Login with:
- Email: `admin@nordex-online.com`
- Password: `Admin1234!`

## Production Deployment

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Note: Database password, Project URL, API keys

### 2. Update Environment Variables

Create `.env.production`:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="same-secret-as-development"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="vega@nordex-online.com"
```

### 3. Deploy to Vercel

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 4. Run Production Migrations

```bash
pnpm db:migrate --env production
```

Or via Supabase dashboard SQL editor:

```sql
-- Run migrations manually using Prisma SQL output
```

## Troubleshooting

### Database Connection Issues

```
Error: P1001: The specified database server not found
```

Solution:
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure password has no special characters (or use URL encoding)

### Port Already in Use

```
Error: Port 3000 already in use
```

Solution:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID PROCESS_ID /F
```

### Prisma Client Not Found

```bash
# Regenerate Prisma client
pnpm db:generate
```

## Common Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:generate     # Generate Prisma client
pnpm db:push         # Push schema (create tables)
pnpm db:migrate      # Run migrations
pnpm db:studio       # Open Prisma Studio
pnpm db:seed         # Seed database
pnpm db:reset        # Reset database (WARNING: deletes data)

# Utility
pnpm lint            # Run ESLint
```

## Project Structure Overview

```
vega-erp/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected routes
│   │   ├── dashboard/
│   │   ├── suppliers/
│   │   ├── contracts/
│   │   └── projects/
│   └── api/               # API endpoints
│       └── auth/
├── components/
│   ├── ui/                # Button, Input, Card, etc.
│   └── layout/            # Sidebar, Header
├── lib/                   # Utilities
├── prisma/
│   ├── schema.prisma       # Database model
│   └── seed.ts            # Sample data
└── messages/              # Translations (ES/EN)
```