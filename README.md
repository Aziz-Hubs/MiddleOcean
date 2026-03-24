<div align="center">
  <img src="public/brand/logo.svg" alt="Middle Ocean Logo" width="200" />
  <h1>Middle Ocean</h1>
  <p><strong>Premium B2B Catalog & Lead Generation Platform</strong></p>
  
  [![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![Powered by Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
  [![Sanity CMS](https://img.shields.io/badge/Sanity-CMS-red?style=for-the-badge&logo=sanity)](https://www.sanity.io)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
</div>

---

## 🌊 Overview

Middle Ocean is a state-of-the-art B2B digital catalog designed for the printing and advertising materials industry. Built with a focus on high-end aesthetics and seamless user experience, it serves as a powerful lead generation tool rather than a standard e-commerce site.

### 🎯 Key Objectives
- **Lead Generation**: Seamless "Get a Quote" flow for bulk B2B inquiries.
- **Global Reach**: Full internationalization with robust **Arabic (RTL)** and **English (LTR)** support.
- **Dynamic Content**: Fully managed via an embedded **Sanity Studio** instance.
- **Premium UX**: Immersive animations using **Framer Motion** and high-performance WebGL visuals with **Three.js**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Runtime**: [Bun](https://bun.sh) (Exclusive package manager)
- **CMS**: [Sanity.io](https://www.sanity.io)
- **i18n**: [next-intl](https://next-intl.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Visuals**: [Three.js](https://threejs.org/) & [MapLibre](https://maplibre.org/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh) installed on your system.

### Installation
```bash
git clone https://github.com/Aziz-Hubs/MiddleOcean.git
cd MiddleOcean
bun install
```

### Development
Start the development server:
```bash
bun dev
```

### Production Build
```bash
bun build
bun start
```

---

## 🏗️ Architecture & Rules

### 🛡️ Critical Guidelines
- **No E-Commerce**: Do not implement shopping carts or direct payment processing. All interactions should lead to a quote request.
- **Sanity First**: All product data, categories, and site settings must be fetched from Sanity CMS.
- **RTL Integrity**: Always verify layouts in the Arabic (`/ar`) locale to ensure correct directionality.
- **Client Components**: Always include the `"use client"` directive when using React hooks or interactive features.

### 📁 Project Structure
- `app/[locale]/`: Localized routes and layouts.
- `src/components/`: Reusable UI components (Atomic design).
- `src/lib/`: Database clients, utility functions, and shared logic.
- `public/`: Static assets, brand logos, and media.
- `studio/`: Sanity CMS configuration and schemas.

---

## 🌐 Localization

The application uses `next-intl` for seamless language switching.
- **English**: `/en` (Default)
- **Arabic**: `/ar` (Fully RTL supported)

Translations are managed in `messages/[locale].json`.

---

## 📋 Commands

- `bun lint`: Run ESLint checks.
- `bun format`: Format code using Prettier.
- `bun typecheck`: Run TypeScript compilation check.

---

<div align="center">
  <p>Built with ❤️ by the Middle Ocean Team</p>
</div>
