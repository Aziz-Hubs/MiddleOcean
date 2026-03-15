# AGENTS.md - Code Mode

This file provides guidance to agents when working with code in this repository.

## Key Non-Obvious Patterns

1. **Component Location**: Components exist in both `components/` and `src/components/` - prefer `components/` for app components
2. **Absolute Imports**: ALWAYS use `@/` imports (e.g., `@/lib/utils`, `@/sanity/client`), never relative paths
3. **Sanity Client Location**: `sanity/client.ts` (project root), NOT in `lib/` or `components/`
4. **RTL Direction**: In layout.tsx, use `locale === "ar" ? "rtl" : "ltr"` for HTML dir attribute
5. **Data Scripts**: Data linter/migration scripts use hardcoded Sanity tokens (e.g., `sanitize.mjs`, `advanced_data_linter.mjs`)

## Custom Utilities

- **`cn()`**: From [`lib/utils.ts`](lib/utils.ts) - uses `twMerge` + `clsx` for conditional Tailwind classes
- **`useScroll()`**: From [`hooks/use-scroll.ts`](hooks/use-scroll.ts) - implements hysteresis for scroll detection

## Component Architecture

- **UI Components**: `components/ui/` - shadcn/ui primitives and custom components
- **App Components**: `components/` - layout-specific components (Header, Footer, Hero, etc.)
- **WebGL Components**: Can be in `components/ui/` or `src/components/ui/` - use Three.js for custom shaders

## Multi-Language Fields

Sanity schema uses `localeString` and `localeText` types with `{ en, ar }` structure:
- Titles: `title: { en: string; ar: string }`
- Descriptions: `description: { en: string; ar: string }`
- Specifications: `specifications: [{ name: { en, ar }; value: { en, ar } }]`
