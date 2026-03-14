# Middle Ocean Printing: Technical Architecture

## Overview

Middle Ocean Printing is a modern, high-performance web architecture focused on B2B lead generation. It acts as a digital catalog for printing materials, acrylic sheets, and heavy-duty printing machinery. The primary conversion metric is "Request a Quote."

## Technology Stack

### Core

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Styling & UI

- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (using custom preset `a27zTW6` for deep navy and cyan brand colors)
- **Icons**: [Lucide React](https://lucide.dev/)

### CMS & Data

- **CMS**: [Sanity](https://www.sanity.io/) (Embedded Studio at `/studio`)
- **Data Fetching**: `@sanity/client` and `next-sanity`

## Site Architecture & Routing Strategy

The Next.js App Router utilizes **Route Groups** to semantically organize the codebase without affecting the URL structure.

- `(marketing)`: Static lead-generation pages (Home, About, Contact, Brands).
- `(catalog)`: Dynamic product catalog routes driven by Sanity CMS.

### Current Directory Tree

```text
MiddleOcean/
├── app/
│   ├── (catalog)/
│   │   └── products/
│   │       ├── [category]/
│   │       │   ├── [slug]/
│   │       │   │   └── page.tsx      # Single Product Details
│   │       │   └── page.tsx          # Category Product Listing
│   │       └── page.tsx              # All Products Hub
│   ├── (marketing)/
│   │   ├── about/
│   │   │   └── page.tsx              # About Us
│   │   ├── brands/
│   │   │   └── page.tsx              # Brand Showcase (e.g. OceanJett)
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact / Request a Quote Form
│   │   └── page.tsx                  # Landing Page
│   ├── globals.css                   # Global Tailwind and Shadcn CSS variables
│   ├── layout.tsx                    # Root Layout Configuration
│   └── studio/
│       └── [[...index]]/
│           └── page.tsx              # Embedded Sanity CMS
├── components/
│   ├── theme-provider.tsx            # Next Themes provider for dark/light mode
│   └── ui/                           # Shadcn UI primitives (Button, Command, etc.)
├── docs/                             # Architecture and Project Documentation
├── sanity/
│   └── schemaTypes/
│       └── index.ts                  # Sanity schema definitions (Product, Category, Brand)
├── sanity.config.ts                  # Sanity configuration
└── bun.lock                          # Bun lockfile
```

## Data Models (Sanity Schemas)

The content architecture is defined around three main schemas to support the B2B catalog:

1. **Product**: Core material or machine record (e.g., "Digital Printing Material"). Relates to a Category and a Brand.
2. **Category**: Logical taxonomy groupings (e.g., "Acrylic & Foam Sheets", "Advertising Materials").
3. **Brand**: Tags for products distinguishing between proprietary brands (like OceanJett) and third-party partner implementations.
