# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build & Development Commands

- Use `bun` exclusively (not npm, yarn, or pnpm)
- Dev server: `bun dev` (uses Next.js 15 App Router)
- Build: `bun build`, Start: `bun start`
- Lint: `bun lint`, Format: `bun format`, Typecheck: `bun typecheck`

## Critical Gotchas

1. **TurboPack Conflict**: Do NOT enable `--turbopack` in dev script - it breaks `next-intl` dynamic route interpolation in Next.js 15
2. **RTL Support**: Arabic (`/ar`) is fully supported with RTL direction; English (`/en`) is default
3. **Route Parameters**: In `app/[locale]/layout.tsx` and nested pages, `params` is a Promise - must use `const { locale } = await params`
4. **Sanity Client**: Always use `useCdn: false` for fresh data in client initialization

## Architecture

- **CMS**: Sanity (embedded studio at `/studio`)
- **i18n**: next-intl v4 with locale prefix (`/[locale]`)
- **Styling**: Tailwind CSS + Shadcn UI (corporate navy blue/cyan theme)
- **Components**: Import from `@/components/ui` or `@/components`

## B2B Catalog Rules

- **NO E-COMMERCE**: No shopping carts, payment processing, or "Buy Now" buttons
- Focus is exclusively on lead generation: "Get a Quote"
- All products are read-only catalog items
- Categories: Acrylic & Foam Sheets, Advertising Materials, Digital Printing Materials, Machines, Printers, Printers Supplies, Screens

## Data Layer

- Use `@sanity/client` directly (not `next-sanity`) for data fetching
- All multi-language fields use `localeString`/`localeText` objects (en/ar keys)
- Category icons use Lucide icon names (e.g., "Printer", "Monitor")
- Product schema uses open-ended `specifications` array for key-value pairs

## Code Style

- Import order: `@/*` absolute paths first, then third-party
- Use `cn()` utility for conditional Tailwind classes
- Client components require `"use client"` at top
- Framer Motion for animations, Three.js for WebGL
