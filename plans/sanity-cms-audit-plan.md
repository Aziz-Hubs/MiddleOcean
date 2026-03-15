# MiddleOcean Sanity CMS Audit & Verification Plan

**Version:** 1.0  
**Date:** March 15, 2026  
**Project:** MiddleOcean B2B E-Commerce Platform  
**Target Environment:** Production Sanity Dataset (`production`)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Schema Validation Checklist](#2-schema-validation-checklist)
3. [Data Audit Procedures](#3-data-audit-procedures)
4. [Multi-Language Verification](#4-multi-language-verification)
5. [Product Extraction Strategy](#5-product-extraction-strategy)
6. [Frontend Integration Verification](#6-frontend-integration-verification)
7. [Lucide Icon Name Validation](#7-lucide-icon-name-validation)
8. [B2B Constraint Compliance](#8-b2b-constraint-compliance)
9. [GROQ Query Reference](#9-groq-query-reference)
10. [Sanity CLI Commands Reference](#10-sanity-cli-commands-reference)
11. [Verification Checklist](#11-verification-checklist)
12. [Emergency Recovery Procedures](#12-emergency-recovery-procedures)

---

## 1. Introduction

This comprehensive audit plan documents the verification procedures for MiddleOcean's Sanity CMS implementation. The plan ensures all content/data structures align with business requirements, technical specifications, and multi-language (EN/AR) bilingual content requirements.

### 1.1 Objectives

- Validate Sanity schema definitions match domain entities
- Verify data integrity across categories, products, and quote requests
- Confirm multi-language content structure compliance
- Ensure B2B-only constraints (no e-commerce features)
- Validate frontend data consumption points
- Document recovery procedures for data issues

### 1.2 Scope

This plan covers:

- Category schema validation and data audit
- Product schema validation and data audit
- QuoteRequest schema validation and data audit
- Multi-language (EN/AR) content verification
- Frontend integration points verification
- Lucide icon name whitelist compliance
- B2B constraint compliance

---

## 2. Schema Validation Checklist

### 2.1 Schema Inspection Commands

Run these commands to inspect the current Sanity schema:

```bash
# Inspect entire schema structure
bunx sanity schema inspect

# Export schema to file for review
bunx sanity schema export > schema.json

# Check schema diff between local and remote
bunx sanity schema diff
```

### 2.2 Schema Validation Checklist

| # | Schema Type | Field | Type | Required | Multi-Lang | Expected | Status |
|---|-------------|-------|------|----------|------------|----------|--------|
| 1 | category | title | localeString | Yes | Yes | `{en, ar}` | ✅ |
| 2 | category | slug | slug | Yes | No | URL-safe | ✅ |
| 3 | category | icon | string | Yes | No | Lucide name | ✅ |
| 4 | category | description | localeText | No | Yes | HTML | ✅ |
| 5 | category | products | reference[] | Yes | No | Product[] | ✅ |
| 6 | product | title | localeString | Yes | Yes | `{en, ar}` | ✅ |
| 7 | product | slug | slug | Yes | No | URL-safe | ✅ |
| 8 | product | category | reference | Yes | No | Category | ✅ |
| 9 | product | price | number | No | No | Decimal | ✅ |
| 10 | product | specifications | object[] | Yes | Yes | `{name, value}{en,ar}` | ✅ |
| 11 | product | images | image[] | Yes | No | Array | ✅ |
| 12 | product | specifications | object[] | Yes | Yes | Multi-lang | ✅ |
| 13 | quoteRequest | product | reference | Yes | No | Product | ✅ |
| 14 | quoteRequest | customerName | string | Yes | No | String | ✅ |
| 15 | quoteRequest | email | string | Yes | No | Email | ✅ |
| 16 | quoteRequest | quantity | number | Yes | No | Integer | ✅ |
| 17 | quoteRequest | questions | localeText | No | Yes | HTML | ✅ |

### 2.3 Schema Audit Commands

```bash
# Export schema and validate structure
bunx sanity schema inspect > schema-inspection.txt

# Check for missing fields in category schema
bunx sanity dataset export production --types category --to category-schema.json --skip-drafts
```

---

## 3. Data Audit Procedures

### 3.1 Dataset Export

Export the production dataset for local analysis:

```bash
# Export complete dataset
bunx sanity dataset export production --to export.json

# Export only categories
bunx sanity dataset export production --types category --to categories.json --skip-drafts

# Export only products
bunx sanity dataset export production --types product --to products.json --skip-drafts

# Export only quote requests
bunx sanity dataset export production --types quoteRequest --to quoteRequests.json --skip-drafts
```

### 3.2 Categories Data Audit

#### 3.2.1 Category Count Verification

```bash
# Get total category count
bunx sanity query "*[_type == 'category'] | count()" --dataset production

# Get categories with id, title, slug, icon
bunx sanity query '*[_type == "category"]{id, title, slug, icon, "productCount": count(products)}' --dataset production --pretty
```

#### 3.2.2 Category Data Validation

```bash
# Check for missing titles
bunx sanity query "*[_type == 'category' && !defined(title)]" --dataset production

# Check for null/empty titles
bunx sanity query '*[_type == "category" && (title.en == "" || title.en == null)]' --dataset production

# Check for missing slugs
bunx sanity query "*[_type == 'category' && !defined(slug.current)]" --dataset production

# Check for missing icons
bunx sanity query "*[_type == 'category' && !defined(icon)]" --dataset production

# Check for categories without products
bunx sanity query "*[_type == 'category' && count(products) == 0]" --dataset production

# List all categories with product count
bunx sanity query '*[_type == "category"]|order(title.en)[].{"id": id, "title": title.en, "slug": slug.current, "icon": icon, "products": count(products)}' --dataset production --pretty
```

### 3.3 Products Data Audit

#### 3.3.1 Product Count Verification

```bash
# Get total product count
bunx sanity query "*[_type == 'product'] | count()" --dataset production

# Get products by category
bunx sanity query '*[_type == "product"]{"categoryTitle": category->title.en, "count": count(*)}' --dataset production
```

#### 3.3.2 Product Data Validation

```bash
# Check for missing titles
bunx sanity query "*[_type == 'product' && !defined(title)]" --dataset production

# Check for null/empty titles
bunx sanity query '*[_type == "product" && (title.en == "" || title.en == null)]' --dataset production

# Check for missing slugs
bunx sanity query "*[_type == 'product' && !defined(slug.current)]" --dataset production

# Check for missing category
bunx sanity query "*[_type == 'product' && !defined(category)]" --dataset production

# Check for missing specifications
bunx sanity query "*[_type == 'product' && !defined(specifications)]" --dataset production

# Check for products without images
bunx sanity query "*[_type == 'product' && !defined(images)]" --dataset production

# List all products with category and specification count
bunx sanity query '*[_type == "product"]|order(title.en)[].{"id": id, "title": title.en, "category": category->title.en, "specCount": count(specifications), "imageCount": count(images)}' --dataset production --pretty
```

### 3.4 Quote Requests Data Audit

```bash
# Get total quote request count
bunx sanity query "*[_type == 'quoteRequest'] | count()" --dataset production

# Check for missing product references
bunx sanity query "*[_type == 'quoteRequest' && !defined(product)]" --dataset production

# List quote requests with product info
bunx sanity query '*[_type == "quoteRequest"]|order(_createdAt)[].{"id": id, "product": product->title.en, "customerName": customerName, "email": email, "quantity": quantity}' --dataset production --pretty
```

### 3.5 Data Integrity Checks

```bash
# Check for orphaned products (category doesn't exist)
bunx sanity query '*[_type == "product" && !defined(category)]' --dataset production

# Check for products with empty specifications
bunx sanity query '*[_type == "product" && count(specifications) == 0]' --dataset production

# Check for duplicate slugs
bunx sanity query '*[_type == "category" && count(*[_type == "category" && slug.current == current().slug.current]) > 1]{title.en, slug.current}'
```

### 3.6 Delta/Change Audit

```bash
# Get all changes since a specific timestamp
bunx sanity delta --since 2026-03-14T00:00:00Z

# Export delta to JSON
bunx sanity delta --since 2026-03-14T00:00:00Z --to delta-2026-03-14.json

# Get recent changes summary
bunx sanity delta --summary
```

---

## 4. Multi-Language Verification

### 4.1 EN/AR Content Structure Verification

All multi-language fields must follow the structure:

```json
{
  "title": {
    "en": "English Title",
    "ar": "العنوان العربي"
  },
  "description": {
    "en": "English description",
    "ar": "الوصف العربي"
  }
}
```

### 4.2 Verification Commands

```bash
# Check categories for EN/AR title compliance
bunx sanity query '*[_type == "category"]{title, "hasEn": defined(title.en), "hasAr": defined(title.ar)}' --dataset production

# Find categories missing English titles
bunx sanity query '*[_type == "category" && !defined(title.en)]{id, title}' --dataset production

# Find categories missing Arabic titles
bunx sanity query '*[_type == "category" && !defined(title.ar)]{id, title}' --dataset production

# Check products for EN/AR title compliance
bunx sanity query '*[_type == "product"]{title, "hasEn": defined(title.en), "hasAr": defined(title.ar)}' --dataset production

# Check products for EN/AR specifications compliance
bunx sanity query '*[_type == "product" && defined(specifications)]{title, "hasEnSpec": defined(specifications[0].name.en), "hasArSpec": defined(specifications[0].name.ar)}' --dataset production

# Find products with incomplete English specs
bunx sanity query '*[_type == "product" && defined(specifications) && count(specifications[]._type == "object" && defined(name.en) && defined(value.en)) != count(specifications)]{title}' --dataset production

# Find products with incomplete Arabic specs
bunx sanity query '*[_type == "product" && defined(specifications) && count(specifications[]._type == "object" && defined(name.ar) && defined(value.ar)) != count(specifications)]{title}' --dataset production
```

### 4.3 Full Multi-Language Audit

```bash
# Complete EN/AR compliance report for categories
bunx sanity query '*[_type == "category"]|order(_updatedAt)[].{"id": id, "titleEn": title.en, "titleAr": title.ar, "updateDate": _updatedAt}' --dataset production --pretty

# Complete EN/AR compliance report for products
bunx sanity query '*[_type == "product"]|order(_updatedAt)[].{"id": id, "titleEn": title.en, "titleAr": title.ar, "specCount": count(specifications), "updateDate": _updatedAt}' --dataset production --pretty

# Check for mixed language fields (EN in AR, AR in EN)
bunx sanity query '*[_type == "category" && title.en match ".*[أ-ي].*" || title.ar match ".*[a-zA-Z].*"]{title}' --dataset production
```

---

## 5. Product Extraction Strategy

### 5.1 Legacy Website Migration Source

Source: [`legacy_products.json`](legacy_products.json)  
Target: Sanity production dataset

### 5.2 Legacy Data Structure

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": {"en": "English", "ar": "Arabic"},
      "products": [...]
    }
  ],
  "products": [
    {
      "id": "product-id",
      "title": {"en": "English", "ar": "Arabic"},
      "description": {"en": "English", "ar": "Arabic"},
      "price": 0.00,
      "specifications": [
        {"name": {"en": "English", "ar": "Arabic"}, "value": {"en": "English", "ar": "Arabic"}}
      ],
      "images": [...],
      "categoryId": "category-id"
    }
  ]
}
```

### 5.3 Extraction Process

```bash
# 1. Verify legacy_products.json exists and is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('legacy_products.json', 'utf8')).products.length)"

# 2. Extract category names
node -e "const data = JSON.parse(require('fs').readFileSync('legacy_products.json', 'utf8')); console.log(JSON.stringify(data.categories.map(c => ({id: c.id, name: c.name})), null, 2)));"

# 3. Extract product count
node -e "const data = JSON.parse(require('fs').readFileSync('legacy_products.json', 'utf8')); console.log('Products:', data.products.length); console.log('Categories:', data.categories.length);"

# 4. Check for duplicate legacy product IDs
node -e "const data = JSON.parse(require('fs').readFileSync('legacy_products.json', 'utf8')); const ids = data.products.map(p => p.id); const unique = new Set(ids); console.log('Duplicates:', ids.length - unique.size);"
```

### 5.4 Migration Validation

```bash
# After migration, verify product count matches
bunx sanity query "*[_type == 'product'] | count()" --dataset production

# Compare with legacy count
node -e "const data = JSON.parse(require('fs').readFileSync('legacy_products.json', 'utf8')); console.log('Legacy products:', data.products.length);"

# Check for migrated products with missing data
bunx sanity query '*[_type == "product" && !defined(specifications) || count(specifications) == 0]{title}' --dataset production
```

---

## 6. Frontend Integration Verification

### 6.1 Data Consumption Points

#### 6.1.1 Category Repository

File: [`src/domain/repositories/CategoryRepository.ts`](src/domain/repositories/CategoryRepository.ts)

```typescript
// Expected methods:
- getAll(locale: string): Promise<Category[]>
- getBySlug(slug: string, locale: string): Promise<Category | null>
- getById(id: string, locale: string): Promise<Category | null>
```

#### 6.1.2 Product Repository

File: [`src/domain/repositories/ProductRepository.ts`](src/domain/repositories/ProductRepository.ts)

```typescript
// Expected methods:
- getAll(locale: string): Promise<Product[]>
- getByCategory(categoryId: string, locale: string): Promise<Product[]>
- getBySlug(slug: string, locale: string): Promise<Product | null>
- getById(id: string, locale: string): Promise<Product | null>
```

#### 6.1.3 Quote Request Repository

File: [`src/domain/repositories/QuoteRequestRepository.ts`](src/domain/repositories/QuoteRequestRepository.ts)

```typescript
// Expected methods:
- create(request: QuoteRequest): Promise<void>
- getById(id: string): Promise<QuoteRequest | null>
- getByEmail(email: string): Promise<QuoteRequest[]>
```

### 6.2 Frontend Component Verification

#### 6.2.1 Category Grid

File: [`components/product-categories-grid.tsx`](components/product-categories-grid.tsx)

```bash
# Verify component uses correct Sanity schema fields
grep -n "icon" components/product-categories-grid.tsx
grep -n "title" components/product-categories-grid.tsx
grep -n "slug" components/product-categories-grid.tsx
```

#### 6.2.2 Product Listing

Files to verify:
- [`app/[locale]/(catalog)/products/[slug]/page.tsx`](app/[locale]/(catalog)/products/[slug]/page.tsx)
- [`applications/services/sanity/SanityProductRepository.ts`](applications/services/sanity/SanityProductRepository.ts)

```bash
# Verify GROQ queries match schema
grep -n "specifications" applications/services/sanity/SanityProductRepository.ts
grep -n "images" applications/services/sanity/SanityProductRepository.ts
```

### 6.3 Integration Test Commands

```bash
# Test category query structure
bunx sanity query '*[_type == "category"][0]{id, title, slug, icon}' --dataset production

# Test product query structure
bunx sanity query '*[_type == "product"][0]{id, title, slug, category->title, specifications, images}' --dataset production

# Test quote request query structure
bunx sanity query '*[_type == "quoteRequest"][0]{id, product->title, customerName, email, quantity, questions}' --dataset production
```

---

## 7. Lucide Icon Name Validation

### 7.1 Icon Whitelist

File: [`src/domain/value-objects/CategoryIcon.ts`](src/domain/value-objects/CategoryIcon.ts)

Current whitelist:
```typescript
export const CATEGORY_ICONS = [
  "Printer",
  "Monitor",
  "Cutter",
  "Laser",
  "Camera",
  "Cloud",
  "Database",
  "HardDrive",
  "Layers",
  "Layout",
  "Package",
  "Palette",
  "PenTool",
  "Printer",
  "Scan",
  "Settings",
  "Tablet",
  "Type",
  "Wand",
  "Zap",
] as const;
```

### 7.2 Validation Commands

```bash
# Check categories for valid icons
bunx sanity query '*[_type == "category"]{title, icon}' --dataset production

# Find categories with invalid icons (not in whitelist)
# Note: This requires manual comparison or script

# Script to check icon compliance
node -e "
const fs = require('fs');
const { execSync } = require('child_process');
const icons = ['Printer', 'Monitor', 'Cutter', 'Laser', 'Camera', 'Cloud', 'Database', 'HardDrive', 'Layers', 'Layout', 'Package', 'Palette', 'PenTool', 'Scan', 'Settings', 'Tablet', 'Type', 'Wand', 'Zap'];

const output = execSync('bunx sanity query '\''*[_type == \"category\"]{title, icon}'\'' --dataset production', {encoding: 'utf8'});
const categories = JSON.parse(output);

const invalid = categories.filter(c => c.icon && !icons.includes(c.icon));
console.log('Invalid icons:', invalid.map(c => ({title: c.title, icon: c.icon})));
"
```

### 7.3 Icon Fix Commands

```bash
# If invalid icons are found, use this pattern to fix:
bunx sanity patch <document-id> set icon="ValidIconName"

# Example:
bunx sanity patch <category-id> set icon="Printer"
```

---

## 8. B2B Constraint Compliance

### 8.1 B2B-Only Requirements

**CRITICAL: MiddleOcean is B2B ONLY. No e-commerce features allowed.**

#### 8.1.1 Product Schema Constraints

| Constraint | Status | Verification |
|------------|--------|--------------|
| NO "buyNow" field | ✅ | Must not exist |
| NO "addToCart" field | ✅ | Must not exist |
| NO "quantity" field (on product) | ✅ | Must not exist |
| NO "shoppingCart" reference | ✅ | Must not exist |
| ONLY "quoteRequest" reference | ✅ | Must exist |

#### 8.1.2 Page Route Constraints

| Route | Allowed? | Reason |
|-------|----------|--------|
| `/products` | ✅ | Product listing |
| `/categories` | ✅ | Category listing |
| `/cart` | ❌ | E-commerce feature |
| `/checkout` | ❌ | E-commerce feature |
| `/payment` | ❌ | E-commerce feature |
| `/orders` | ❌ | E-commerce feature |
| `/profile` | ❌ | E-commerce feature |

### 8.2 Compliance Verification

```bash
# Verify no buyNow fields exist
bunx sanity query '*[_type == "product" && defined(buyNow)]' --dataset production

# Verify no addToCart fields exist
bunx sanity query '*[_type == "product" && defined(addToCart)]' --dataset production

# Verify no shoppingCart reference exists in product schema
bunx sanity query '*[_type == "product" && defined(shoppingCart)]' --dataset production

# Verify quoteRequest is the only call-to-action
bunx sanity query '*[_type == "product" && defined(qr)]{title}' --dataset production
```

### 8.3 Component-Level Verification

#### 8.3.1 Quote Request Modal

File: [`components/b2b/quote-request-modal.tsx`](components/b2b/quote-request-modal.tsx)

Must contain:
- Quote request form
- Customer information fields
- Product selection
- Quantity input
- Submit button

Must NOT contain:
- Payment form
- Shipping address
- Order confirmation (should redirect to quote request submission)

#### 8.3.2 Sticky CTA

File: [`components/b2b/sticky-cta.tsx`](components/b2b/sticky-cta.tsx)

Must contain:
- "Get a Quote" button
- Link to quote request modal

Must NOT contain:
- "Add to Cart" button
- "Buy Now" button

### 8.4 B2B Compliance Audit Script

```bash
#!/bin/bash
echo "=== B2B Compliance Audit ==="

echo "Checking for buyNow fields..."
bunx sanity query '*[_type == "product" && defined(buyNow)]' --dataset production

echo "Checking for addToCart fields..."
bunx sanity query '*[_type == "product" && defined(addToCart)]' --dataset production

echo "Checking for cart reference..."
bunx sanity query '*[_type == "product" && defined(cart)]' --dataset production

echo "Verifying quote request field exists on products..."
bunx sanity query '*[_type == "product" && defined(qr)]{title}' --dataset production

echo "=== End B2B Audit ==="
```

---

## 9. GROQ Query Reference

### 9.1 Category Queries

```groq
# Get all categories with product count
*[_type == "category"]{
  id,
  title,
  slug,
  icon,
  "productCount": count(products),
  "products": products[]->{
    title,
    slug,
    price
  }
} | order(_updatedAt desc)

# Get category by slug with all products
*[_type == "category" && slug.current == $slug][0]{
  id,
  title,
  slug,
  icon,
  description,
  "products": products[]->{
    _id,
    title,
    slug,
    price,
    specifications,
    images
  }
}

# Get category by ID
*[_id == $id][0]{
  id,
  title,
  slug,
  icon,
  description
}
```

### 9.2 Product Queries

```groq
# Get all products with category
*[_type == "product"]{
  id,
  title,
  slug,
  category->{
    _id,
    title,
    slug
  },
  price,
  specifications,
  images,
  _updatedAt
} | order(title.en)

# Get products by category
*[_type == "product" && category->_id == $categoryId]{
  id,
  title,
  slug,
  price,
  specifications,
  images
} | order(title.en)

# Get product by slug
*[_type == "product" && slug.current == $slug][0]{
  id,
  title,
  slug,
  category->{
    _id,
    title,
    slug
  },
  price,
  specifications,
  images,
  description
}

# Get product by ID
*[_id == $id][0]{
  id,
  title,
  slug,
  category,
  price,
  specifications,
  images,
  description
}
```

### 9.3 Quote Request Queries

```groq
# Get all quote requests
*[_type == "quoteRequest"]{
  id,
  product->{
    _id,
    title,
    slug
  },
  customerName,
  email,
  phone,
  quantity,
  questions,
  _createdAt,
  _updatedAt
} | order(_createdAt desc)

# Get quote request by ID
*[_id == $id][0]{
  id,
  product->{
    _id,
    title,
    slug
  },
  customerName,
  email,
  phone,
  quantity,
  questions,
  _createdAt
}

# Get quote requests by email
*[_type == "quoteRequest" && email == $email]{
  id,
  product->title,
  quantity,
  _createdAt
} | order(_createdAt desc)
```

---

## 10. Sanity CLI Commands Reference

### 10.1 Schema Commands

| Command | Purpose |
|---------|---------|
| `bunx sanity schema inspect` | View schema structure |
| `bunx sanity schema export` | Export schema to file |
| `bunx sanity schema diff` | Compare local vs remote schema |
| `bunx sanity schema validate` | Validate schema file |

### 10.2 Dataset Commands

| Command | Purpose |
|---------|---------|
| `bunx sanity dataset export <dataset>` | Export dataset to JSON |
| `bunx sanity dataset import <file>` | Import dataset from JSON |
| `bunx sanity dataset copy <source> <dest>` | Copy dataset |
| `bunx sanity dataset delete <dataset>` | Delete dataset |

### 10.3 Query Commands

| Command | Purpose |
|---------|---------|
| `bunx sanity query <query>` | Execute GROQ query |
| `bunx sanity query <query> --pretty` | Pretty-print query results |
| `bunx sanity query <query> --values <file>` | Query with variables |

### 10.4 Delta Commands

| Command | Purpose |
|---------|---------|
| `bunx sanity delta` | Show change summary |
| `bunx sanity delta --since <timestamp>` | Changes since timestamp |
| `bunx sanity delta --to <file>` | Export delta to file |

### 10.5 Patch Commands

| Command | Purpose |
|---------|---------|
| `bunx sanity patch <id> set <field>=<value>` | Set field value |
| `bunx sanity patch <id> unset <field>` | Remove field |
| `bunx sanity patch <id> inc <field> <amount>` | Increment number |
| `bunx sanity patch <id> createIfMissing` | Create document if needed |

---

## 11. Verification Checklist

### 11.1 Schema Verification

- [ ] All schemas inspect successfully with `bunx sanity schema inspect`
- [ ] No schema validation errors
- [ ] Multi-language fields use `localeString`/`localeText` types
- [ ] Category schema has: title (localeString), slug, icon, description (localeText), products (reference[])
- [ ] Product schema has: title (localeString), slug, category (reference), price, specifications (object[]), images, description (localeText)
- [ ] QuoteRequest schema has: product (reference), customerName, email, phone, quantity, questions (localeText)

### 11.2 Data Verification

- [ ] All categories have EN and AR titles
- [ ] All products have EN and AR titles
- [ ] All products have EN and AR specifications
- [ ] No orphaned products (products without valid category reference)
- [ ] No products with empty specifications arrays
- [ ] No duplicate slugs in categories or products
- [ ] All icons are in the CategoryIcon whitelist

### 11.3 Multi-Language Verification

- [ ] All `title` fields have `en` and `ar` keys
- [ ] All `description` fields have `en` and `ar` keys
- [ ] All `specifications` have `name.en`, `name.ar`, `value.en`, `value.ar`
- [ ] No mixed-language content (Arabic text in English fields)

### 11.4 Frontend Integration Verification

- [ ] CategoryRepositorygetAll()` returns correct data structure
- [ ] ProductRepository.getAll()` returns correct data structure
- [ ] QuoteRequestRepository.create() accepts correct data structure
- [ ] ProductCategoriesGrid component uses correct icon field
- [ ] Product pages display specifications correctly

### 11.5 B2B Compliance Verification

- [ ] No `buyNow` fields in product data
- [ ] No `addToCart` fields in product data
- [ ] No shopping cart or checkout routes
- [ ] All CTAs point to quote request modal
- [ ] QuoteRequestModal contains only quote-related fields

### 11.6 Migration Verification

- [ ] Legacy products exported correctly
- [ ] Product count matches after migration
- [ ] All specifications include both EN and AR
- [ ] No data loss in migration

---

## 12. Emergency Recovery Procedures

### 12.1 Data Backup

**Before any data modification, export current data:**

```bash
# Full backup
bunx sanity dataset export production --to backup-prod-$(date +%Y%m%d).json

# Individual export
bunx sanity dataset export production --types category --to backup-categories.json --skip-drafts
bunx sanity dataset export production --types product --to backup-products.json --skip-drafts
bunx sanity dataset export production --types quoteRequest --to backup-quotes.json --skip-drafts
```

### 12.2 Rollback Procedures

**If data corruption occurs:**

1. **Stop immediately** - Do not make further changes
2. **Export current state** - `bunx sanity dataset export production --to emergency-backup.json`
3. **Restore from backup** - `bunx sanity dataset import backup-prod-XXX.json`
4. **Verify restoration** - Run verification queries
5. **Document incident** - Record what happened and how it was resolved

### 12.3 Data Recovery Commands

```bash
# Import backup (use with caution!)
bunx sanity dataset import backup-prod-20260314.json

# Import only specific types
bunx sanity dataset import backup-categories.json --types category

# Create new dataset for testing
bunx sanity dataset create staging --clone production

# Remove broken references
bunx sanity patch '*[_type == "product" && !defined(category)]' set category=null
```

### 12.4 Restore Procedures

**To restore specific product data:**

```bash
# 1. Export current state
bunx sanity dataset export production --to pre-restore.json

# 2. Identify affected documents
bunx sanity query '*[_type == "product" && !defined(specifications)]{id, title}' --dataset production

# 3. For each document, apply patch
bunx sanity patch <document-id> set specifications=[]

# 4. Verify restoration
bunx sanity query '*[_type == "product" && count(specifications) == 0]{id, title}' --dataset production
```

### 12.5 Corruption Recovery Template

```bash
#!/bin/bash
# Emergency restore script

echo "=== EMERGENCY RESTORE ==="

# Step 1: Save current state
echo "Step 1: Saving current state..."
bunx sanity dataset export production --to emergency-save.json

# Step 2: Identify affected data
echo "Step 2: Identifying affected data..."
bunx sanity query '*[_type == "category" && !defined(title.en)]{id, title}' --dataset production

# Step 3: Restore from backup
echo "Step 3: Restoring from backup..."
bunx sanity dataset import backup-prod-20260314.json

# Step 4: Verify
echo "Step 4: Verifying restoration..."
bunx sanity query "*[_type == 'category'] | count()" --dataset production

echo "=== RESTORE COMPLETE ==="
```

---

## Appendix A: Quick Reference Commands

### Category Data Summary
```bash
bunx sanity query '*[_type == "category"]|order(title.en)[].{"id": id, "title": title.en, "slug": slug.current, "icon": icon, "products": count(products)}' --dataset production --pretty
```

### Product Data Summary
```bash
bunx sanity query '*[_type == "product"]|order(title.en)[].{"id": id, "title": title.en, "category": category->title.en, "specCount": count(specifications), "imageCount": count(images)}' --dataset production --pretty
```

### EN/AR Compliance
```bash
# Categories
bunx sanity query '*[_type == "category"]{title, "hasEn": defined(title.en), "hasAr": defined(title.ar)}' --dataset production

# Products
bunx sanity query '*[_type == "product"]{title, "hasEn": defined(title.en), "hasAr": defined(title.ar)}' --dataset production
```

### Icon Validation
```bash
bunx sanity query '*[_type == "category"]{title, icon}' --dataset production
```

---

## Appendix B: File location map

| File | Purpose |
|------|---------|
| `sanity/client.ts` | Sanity client configuration |
| `sanity.config.ts` | Sanity studio configuration |
| `sanity/schema.ts` | Primary schema definitions |
| `legacy_products.json` | Legacy product data source |
| `advanced_data_linter.mjs` | Data quality verification script |
| `audit_products.mjs` | Product audit script |
| `components/product-categories-grid.tsx` | Category display component |
| `components/b2b/quote-request-modal.tsx` | Quote request form |
| `components/b2b/sticky-cta.tsx` | Sticky CTA button |
| `src/domain/value-objects/CategoryIcon.ts` | Icon whitelist |
| `src/domain/entities/Category.ts` | Category domain entity |
| `src/domain/entities/Product.ts` | Product domain entity |
| `src/domain/entities/QuoteRequest.ts` | Quote request domain entity |
| `applications/services/sanity/SanityCategoryRepository.ts` | Category data service |
| `applications/services/sanity/SanityProductRepository.ts` | Product data service |
| `applications/services/sanity/SanityQuoteRequestRepository.ts` | Quote request data service |

---

**Document Status:** ✅ Complete  
**Next Review:** April 15, 2026  
**Version:** 1.0
