# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build & Development Commands

- Use `bun` exclusively (not npm, yarn, or pnpm)
- Dev: `bun dev`, Build: `bun build`, Start: `bun start`
- Lint: `bun lint`, Format: `bun format`, Typecheck: `bun typecheck`
- No test framework configured

## Critical Gotchas

1. **TurboPack Conflict**: Do NOT enable `--turbopack` - breaks `next-intl` route interpolation
2. **Route Parameters are Promises**: `params` is async - use `const { locale } = await params`
3. **Sanity CDN**: Dev uses `useCdn: true`; production should use `useCdn: false`
4. **RTL Support**: Arabic (`/ar`) is RTL; English (`/en`) is default
5. **No E-commerce**: B2B catalog/lead-gen only - no carts or payments

## Architecture

- **Framework**: Next.js 15/16 App Router + TypeScript
- **CMS**: Sanity (studio at `/studio`)
- **i18n**: next-intl v4 with `/[locale]` routing
- **Styling**: Tailwind CSS v4 + Shadcn UI (oklch colors)
- **Data**: `@sanity/client` directly (not `next-sanity`)

## Project Structure

```
src/
├── app/[locale]/           # Locale-routed pages
├── components/             # React components
│   └── ui/                 # Shadcn primitives
├── hooks/                  # Custom hooks
├── i18n/                   # next-intl config
└── lib/                    # Utilities
sanity/
├── client.ts               # Sanity client
├── queries.ts              # GROQ queries
├── types.ts                # TypeScript interfaces
└── schemaTypes/            # Sanity schemas
```

## Code Style

### ImportsOrder

```typescript
"use client"  // 1. Directive (if needed)

import { cn } from "@/lib/utils"  // 2. @/* paths
import { useTranslations } from "next-intl"  // 3. External packages
import { Metadata } from "next"
```

### Formatting

- Semi: false, Single quotes: false (use double)
- Tab width: 2, Print width: 80, Trailing commas: ES5
- Use `cn()` for conditional Tailwind classes

### TypeScript Conventions

- `interface` for objects, `type` for unions/primitives
- Async server components: `const { param } = await params`
- Client components: `"use client"` at top

### Naming

- Components: PascalCase (`Header.tsx`)
- Utilities: camelCase (`useScroll.ts`)
- Queries: camelCase with suffix (`categoryQuery`)
- Types: PascalCase (`SanityCategory`)

## Component Patterns

### Server Components (Default)

```typescript
import { sanityClient } from "@/sanity/client"
import { categoryBySlugQuery } from "@/sanity/queries"

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await sanityClient.fetch(categoryBySlugQuery, { slug })
  if (!category) notFound()
  return <div>{category.title.en}</div>
}
```

### Client Components

```typescript
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  return (
    <input className={cn("rounded-md border", className)} value={query} onChange={(e) => setQuery(e.target.value)} />
  )
}
```

## Sanity Data Layer

### Client

```typescript
import { createClient } from "@sanity/client"

export const sanityClient = createClient({
  projectId: "hn27pyms",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-03-14",
})
```

### LocaleFields

- `localeString`: `{ en: string; ar: string }`
- `localeText`: `{ en: string; ar: string }` (longer text)

### GROQ Query Pattern

```typescript
export const categoryQuery = `*[_type == "category"]{
  _id,
  title,  // localeString with .en and .ar
  slug,
  "image": image.asset->url
}`
```

## i18n (next-intl v4)

```typescript
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({ locales: ['en', 'ar'], defaultLocale: 'en' })
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

- Server: `const t = await getTranslations("Navigation")`
- Client: `const t = useTranslations("Navigation")`

## Styling

- CSS variables in `globals.css` (oklch color space)
- Tailwind classes preferred; `cn()` for conditionals
- Mobile-first with `md:` and `lg:` breakpoints
- Dark mode: `ThemeProvider` with `class="dark"` on `<html>`

## Metadata & SEO

```typescript
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "العنوان" : "Title",
    alternates: { languages: { en: '/en', ar: '/ar' } }
  }
}
```
