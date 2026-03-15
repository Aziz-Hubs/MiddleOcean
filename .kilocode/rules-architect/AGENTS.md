# AGENTS.md - Architect Mode

This file provides architectural guidance for planning system design in this repository.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 (App Router)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │  (marketing)    │  │   (catalog)     │  │   (studio)    │ │
│  │   Route Group   │  │   Route Group   │  │  Sanity Studio│ │
│  └─────────────────┘  └─────────────────┘  └───────────────┘ │
│         │                      │                       │      │
│  Landing, About,     Products,          Embedded CMS       │
│  Contact, etc.       Categories,                               │
│                      Product Detail                            │
└─────────────────────────────────────────────────────────────┘
                    ↓                                    ↓
           ┌─────────────────────┐            ┌────────────────┐
           │     Sanity CMS      │            │   Next-Intl    │
           │  (hn27pyms)         │            │   (i18n v4)    │
           │  - Products         │            │  - EN / AR     │
           │  - Categories       │            │  - RTL Support │
           │  - Brands           │            └────────────────┘
           └─────────────────────┘
```

## Key Architectural Decisions

### 1. Next.js App Router Structure

**Route Groups Use Cases:**
- `(marketing)`: Static pages (home, about, contact) - SEO-focused
- `(catalog)`: Product catalog - CMS-driven, dynamic content

**Locale Prefix Pattern:**
- All public routes use `app/[locale]/` for i18n
- Localized routing via `next-intl` middleware
- Arabic (`/ar`) RTL direction handled in root layout

### 2. Component Architecture

**Component Location Rules:**
- `components/` - App-specific layout components (Header, Footer, Hero, etc.)
- `components/ui/` - Reusable UI primitives and shadcn components
- `src/components/ui/` - Some duplicate UI components (legacy)

**Component Types:**
- **Server Components**: Data fetching, static content
- **Client Components**: Interactive elements (cart, forms, modals)
- **Mark client components** with `"use client"` directive

### 3. Data Flow Architecture

```
User Request
    ↓
Next.js Locale Middleware
    ↓
app/[locale]/layout.tsx (Server Component)
    ↓
Sanity Client (useCdn: false for fresh data)
    ↓
Products/Categories data via GROQ queries
    ↓
Client Components render with framer-motion animations
```

### 4. State Management Strategy

**State Scope:**
- **Server State**: Sanity data (fetched on server)
- **Client State**: UI state (scroll position, modals, theme)
- **No Global State Library**: Minimal React state + context

**Custom Hooks:**
- `useScroll()` - Scroll detection with hysteresis
- Theme state via `next-themes` provider

### 5. Styling Architecture

**Layered Approach:**
1. **Tailwind CSS** - Utility classes, responsive design
2. **Shadcn UI** - Pre-built accessible components
3. **Custom CSS Variables** - Theme colors, spacing
4. **Three.js/Shader** - WebGL animations (hero background)

**Theme Configuration:**
- Dark/light mode via `ThemeProvider`
- Corporate navy blue/cyan color palette
- RTL support for Arabic locale

### 6. SEO & Performance Strategy

**Optimizations:**
- Server-side rendering for critical content
- Image optimization via `next/image`
- Route-level code splitting
- Lazy loading for below-fold content

**Meta Tags:**
- Locale-aware title/meta description
- Open Graph tags for social sharing
- Canonical URLs per locale

### 7. Team Collaboration Architecture

**Data Quality Gateways:**
- Data migration scripts for bulk updates
- Hardcoded Sanity tokens for direct API access
- Quality audits via custom scripts

**Version Control:**
- Git-based workflow
- PR reviews for component additions
- Commit conventions for documentation

### 8. Non-Obvious Architectural Constraints

1. **Embedded Studio**: Sanity Studio runs at `/studio` without separate deployment
2. **Unified Product Schema**: No type-specific schemas (no printerProduct vs screenProduct)
3. **Open Specifications**: Product specifications use generic key-value pairs
4. **Icon as String**: Category icons stored as component name strings
5. **No E-Commerce**: Pure lead generation - no cart/payment flow

### 9. Scaling Considerations

**Current Limitations:**
- Single dataset (production)
- No CDN caching for dynamic content
- Direct Sanity queries on server

**Future Scaling Options:**
- Revalidate static pages for static generation
- Implement ISR for product pages
- Add international Sanity datasets for per-region content
