# Middle Ocean: Antigravity Context & Shared Memory

This document serves as the global shared memory for all autonomous agents (like Antigravity) working on the Middle Ocean repository. It outlines the core architecture, data schemas, and strict developmental guardrails to prevent code collisions or regressions.

## 1. Project Overview & Business Domain

- **Company**: Middle Ocean (based in Jordan)
- **Domain**: B2B Digital Printing Materials, Machinery, Screens, and Premium Advertising Displays for the MENA region.
- **Application Type**: Read-only B2B Catalog.
- **Critical Restraint**: **NO E-COMMERCE FEATURES**. Do not add shopping carts, payment processing, or "Buy Now" buttons. The focus is exclusively on lead generation ("Get a Quote").

## 2. Core Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router).
- **Language**: TypeScript (`bun` is the package manager).
- **Styling**: Tailwind CSS + Shadcn UI (Customized Corporate Navy Blue/Cyan theme).
- **i18n**: `next-intl` (Version 4). Supports English (`/en`) and Arabic (`/ar`, RTL).
- **CMS**: Sanity (Embedded directly into Next.js via `next-sanity`).

## 3. Localization & Routing Infrastructure (Crucial Gotchas)

- **Middleware**: `middleware.ts` at the project root intercepts all requests to inject the locale prefix. It explicitly excludes `/studio` from i18n routing.
- **Next 15 Parameters**: Inside `app/[locale]/layout.tsx` and nested pages, route parameters (like `locale`) are **Promise-based**. They must be destructured asynchronously (e.g., `const { locale } = await params`).
- **Translations API**: Server components use `await getTranslations("Namespace")`. Valid namespaces reside natively in `/messages/en.json` and `/messages/ar.json`.
- **Compiler Warning**: The `--turbopack` flag inside `package.json` dev script was intentionally removed because it actively conflicts with `next-intl` dynamic route interpolation in Next 15. **Do not re-enable Turbopack.**

## 4. Sanity CMS: "Key-Value" KISS Architecture

Sanity Studio is accessible natively at `http://localhost:3000/studio`. Local schema updates automatically appear in the embedded studio without requiring `sanity deploy`.

**Schema Rules:**

- Avoid hyper-fragmenting product types (e.g., no `printerProduct` vs `screenProduct`).
- We use a **Unified Product Schema**.
- To handle deeply variable product specifications across different categories, the `product` schema uses an open-ended `specifications` array. Each item is a generic key-value pair.
- **i18n Objects**: The schema natively supports multi-language data via custom `localeString` and `localeText` object schemas.
- **Category Icons**: The `category` schema uses a string field named `icon` for **Lucide Icon** names (e.g., "Printer", "Monitor") instead of standard image uploads.

## 5. Agent Workflow Guardrails

1. **Tooling**: Always use `bun` instead of `npm`, `yarn`, or `pnpm`.
2. **Absolute vs Relative Paths**: Ensure Next-Intl dynamic imports explicitly use absolute pathing (e.g., `@/messages/en.json`) to prevent bundling resolution errors.
3. **Database Quality**: Sanity strings must undergo programmatic verification to detect/trim invisible Unicode HTML artifacts (like `\u00A0`), particularly within legacy migrated data.
