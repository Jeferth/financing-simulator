# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 financing simulator application for real estate financing calculations. The main tool is a simulation form that calculates monthly payments using compound interest with a fixed rate of 12% per year (1% per month). The application includes:

- **Auto-saving simulations** to PostgreSQL database
- **Admin panel** with authentication for viewing all proposals
- **Digital signature** functionality with PDF generation
- **Currency input masks** with real-time formatting
- **Complete proposal workflow** from simulation to signed contract

### Financing Calculation
- **Interest Rate**: Fixed 12% per year (1% per month)
- **Amortization System**: Compound interest
- **Formula**: PMT = [PV × i × (1 + i)^n] / [(1 + i)^n – 1]
  - PV = financed amount
  - i = monthly interest rate (1%)
  - n = number of installments

### Application Flow
1. **Home page** (`/`) - Simulation form with currency masks
2. **Results page** (`/resultado`) - Shows calculation results + auto-saves to DB
3. **Admin login** (`/login`) - Basic authentication (admin/admin123)
4. **Admin dashboard** (`/admin`) - View all proposals with filters and stats

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Database operations (PostgreSQL)
pnpm run db:generate    # Generate database migrations
pnpm run db:migrate     # Run database migrations
pnpm run db:seed        # Seed database with initial data
pnpm run db:studio      # Open Drizzle Studio on port 3003
```

## Environment Setup

1. **Copy environment file**: `cp .env.example .env`
2. **Configure PostgreSQL**: Set `DATABASE_URL` in `.env`
3. **Run migrations**: `pnpm run db:migrate`
4. **Start development**: `pnpm run dev`

## Architecture

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: `server/database/schema.ts` - Contains `users` and `simulations` tables
- **Database Utils**: `server/utils/drizzle.ts` - Database connection and utilities
- **Configuration**: `drizzle.config.ts` - Drizzle Kit configuration
- **Database URL**: Set via `DATABASE_URL` environment variable (default: `postgresql://localhost:5432/financing_simulator`)

### Frontend Architecture
- **Framework**: Nuxt 3 with TypeScript
- **Styling**: Tailwind CSS v4 with Vite plugin
- **UI Components**: shadcn/ui components in `components/ui/` using Reka UI primitives
- **Forms**: Vee-validate with Zod schema validation
- **Masks**: `lib/masks.ts` for currency input formatting
- **PDF Generation**: Client-side PDF creation with pdf-lib
- **Signatures**: Digital signature capture with signature_pad

### Authentication & Security
- **Admin Auth**: Simple cookie-based authentication
- **Middleware**: `middleware/admin.ts` protects admin routes
- **Credentials**: Hardcoded admin/admin123 for demo purposes
- **Session**: 24-hour token expiration

### Key Features
- **Currency Masks**: Real-time formatting on monetary inputs
- **Auto-save**: Simulations automatically saved to database
- **Digital Signatures**: Capture signatures and embed in PDFs
- **Admin Dashboard**: View all proposals with filtering and stats
- **PDF Export**: Generate signed proposals with complete financing details

### Component Structure
- **UI Components**: `components/ui/` with shadcn/ui patterns
- **Form Controls**: Integrated with vee-validate for validation
- **Signature Pad**: `components/ui/signature-pad/` for digital signing
- **Currency Input**: Visual-only masks maintaining numeric validation

### API Structure
- **`/api/simulations`** - Save simulation data
- **`/api/admin/login`** - Admin authentication
- **`/api/admin/logout`** - Admin logout
- **`/api/admin/simulations`** - List all simulations for admin
- **`/api/pdf`** - PDF generation (backup server-side option)

## Key Technologies
- Nuxt 3 + Vue 3 + TypeScript
- Tailwind CSS v4 with Vite integration
- Drizzle ORM + PostgreSQL
- shadcn-nuxt + Reka UI components
- Vee-validate + Zod for form validation
- pdf-lib for client-side PDF generation
- signature_pad for digital signatures
- postgres driver for database connection