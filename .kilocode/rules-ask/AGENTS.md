# AGENTS.md - Ask Mode

This file provides documentation context for AI assistants answering questions in this repository.

## Quick Reference: Non-Obvious Discoveries

### 1. Directory Structure Confusion

- **Components**: `components/` contains app components (Header, Footer, etc.)
- **UI Components**: `components/ui/` contains shadcn/ui primitives
- **Duplicate Components**: Some components exist in both `components/ui/` and `src/components/ui/` - prefer the former

### 2. i18n Infrastructure

- **Locale Prefix**: URLs use `/[locale]` format (`/en`, `/ar`)
- **RTL Support**: Arabic is fully supported with RTL direction via `dir` attribute
- **Params Promise**: In Next.js 15 App Router, route params are async - `const { locale } = await params`

### 3. Sanity CMS Architecture

- **Embedded Studio**: Available at `/studio` endpoint, no separate deploy needed
- **Unified Schema**: Single `product` schema with open-ended `specifications` array (no type-specific schemas)
- **Custom Field Types**: `localeString` and `localeText` for multi-language support
- **Icon System**: Category icons stored as Lucide React component names (strings), not images

### 4. Data Migration Scripts

The repository contains several Node scripts for data management:
- `migrate.mjs` - Legacy product migration from JSON
- `sanitize.mjs` - Clean Unicode artifacts from Sanity data
- `advanced_data_linter.mjs` - Title case formatting and translation fixes
- `patch_categories.mjs` - Add missing category icons/descriptions

These scripts have hardcoded Sanity tokens for direct API access.

### 5. Custom Hook Patterns

- **`useScroll()`**: From `hooks/use-scroll.ts` - implements hysteresis (different thresholds for scroll up vs down) to prevent flickering

### 6. Product Categories

The core categories are:
- Acrylic & Foam Sheets
- Advertising Materials
- Digital Printing Materials
- Machines
- Printers
- Printers Supplies
- Screens

### 7. Brand Identity

- **Main Brand**: Middle Ocean Printing (MiddleOcean.jo)
- **Proprietary Brand**: OceanJett (for materials)
- **Business Model**: B2B lead generation only - NO e-commerce features

### 8. Project Context

- **Location**: Jordan (MENA region focus)
- **Tagline**: "Your Trusted Partner for Digital Printing Materials Solutions."
- **Scale**: Trusted by 2,000+ major brands
