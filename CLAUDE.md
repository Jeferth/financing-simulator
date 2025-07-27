# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 financing simulator application for real estate financing calculations. The main tool is a simulation form that calculates monthly payments using compound interest with a fixed rate of 12% per year (1% per month). The application uses TypeScript, Tailwind CSS v4, and SQLite with Drizzle ORM, plus a complete UI component library based on shadcn/ui components built with Reka UI.

### Financing Calculation
- **Interest Rate**: Fixed 12% per year (1% per month)
- **Amortization System**: Compound interest
- **Formula**: PMT = [PV × i × (1 + i)^n] / [(1 + i)^n – 1]
  - PV = financed amount
  - i = monthly interest rate (1%)
  - n = number of installments

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

# Database operations
pnpm run db:generate    # Generate database migrations
pnpm run db:migrate     # Run database migrations
pnpm run db:seed        # Seed database with initial data
pnpm run db:studio      # Open Drizzle Studio on port 3003
```

## Architecture

### Database Layer
- **ORM**: Drizzle ORM with SQLite
- **Schema**: `server/database/schema.ts` - Contains `users` and `simulations` tables
- **Database Utils**: `server/utils/drizzle.ts` - Database connection and utilities
- **Configuration**: `drizzle.config.ts` - Drizzle Kit configuration
- **Database File**: `.data/db.sqlite` (local development)

### Frontend Architecture
- **Framework**: Nuxt 3 with TypeScript
- **Styling**: Tailwind CSS v4 with Vite plugin
- **UI Components**: shadcn/ui components in `components/ui/` using Reka UI primitives
- **Utilities**: `lib/utils.ts` contains `cn()` utility for class merging
- **Validation**: Vee-validate with Zod schema validation

### Component Structure
- All UI components are located in `components/ui/` with barrel exports via `index.ts`
- Components follow shadcn/ui patterns with TypeScript and composition API
- Form components include validation utilities in `components/ui/form/`

### Configuration
- **Nuxt Config**: `nuxt.config.ts` - Configured with shadcn-nuxt module
- **Route Rules**: Index page is prerendered
- **Component Directory**: UI components auto-imported from `./components/ui`

## Key Technologies
- Nuxt 3 + Vue 3 + TypeScript
- Tailwind CSS v4 with Vite integration
- Drizzle ORM + SQLite
- shadcn-nuxt + Reka UI components
- Vee-validate + Zod for form validation
- pnpm workspace configuration