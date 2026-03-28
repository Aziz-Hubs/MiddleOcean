import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, siteSettingsQuery } from "@/sanity/queries"
import QRCode from "qrcode"
import React from "react"
import { Document, Page, View, Text, Image, Font, StyleSheet, Link } from "@react-pdf/renderer"
import path from "path"
import fs from "fs"

// ── Fonts ────────────────────────────────────────────────────────────
// Use TTF for better compatibility with react-pdf/fontkit in Node.js
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.ttf", fontWeight: 500 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf", fontWeight: 600 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf", fontWeight: 700 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-800-normal.ttf", fontWeight: 800 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-900-normal.ttf", fontWeight: 900 },
  ],
})

Font.register({
  family: "NotoSansArabic",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@latest/arabic-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@latest/arabic-600-normal.ttf", fontWeight: 600 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@latest/arabic-700-normal.ttf", fontWeight: 700 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@latest/arabic-800-normal.ttf", fontWeight: 800 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-arabic@latest/arabic-900-normal.ttf", fontWeight: 900 },
  ],
})

// Hyphenation callback - disable hyphenation
Font.registerHyphenationCallback((word) => [word])

// ── Helpers ──────────────────────────────────────────────────────────
function resolveLocale(field: Record<string, string> | string | undefined, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  return field[locale] || field["en"] || ""
}

// ── Colors ───────────────────────────────────────────────────────────
const COLORS = {
  navy: "#0f172a",
  navyLight: "#1e293b",
  slate: "#475569",
  slateLight: "#64748b",
  slateUltraLight: "#94a3b8",
  border: "#e2e8f0",
  bgAlt: "#f8fafc",
  white: "#ffffff",
  cyan: "#06b6d4",
  cyanDark: "#0891b2",
}

// ── PDF Document Component ───────────────────────────────────────────
interface BrochureProps {
  product: any
  siteSettings: any
  locale: string
  qrCodeDataUrl: string
  logoBase64: string
}

function BrochureDocument({ product, siteSettings, locale, qrCodeDataUrl, logoBase64 }: BrochureProps) {
  const isRtl = locale === "ar"
  const fontFamily = isRtl ? "NotoSansArabic" : "Inter"
  const productTitle = resolveLocale(product.title, locale)
  const productDesc = resolveLocale(product.description, locale)
  const partNumber = `SKU-${product._id.substring(0, 8).toUpperCase()}`
  const brandName = product.brand?.title || "Middle Ocean"

  const filteredSpecs = product.specifications
    ?.filter((spec: any) => {
      const nameEn = resolveLocale(spec.name, "en")?.toLowerCase()
      return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
    })
    .slice(0, 8) || []

  const dateStr = new Date().toLocaleDateString(locale === "ar" ? "ar-JO" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  })

  const s = StyleSheet.create({
    page: {
      fontFamily,
      backgroundColor: COLORS.white,
      padding: "24 28 20 28",
      flexDirection: "column",
    },
    // Header
    header: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 14,
      marginBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: COLORS.navyLight,
    },
    logo: { height: 36, width: 66 },
    headerRight: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      gap: 14,
    },
    headerText: { textAlign: isRtl ? "left" : "right" },
    headerTitle: { fontSize: 8, fontWeight: 700, color: COLORS.navyLight, textTransform: "uppercase", letterSpacing: 0.6 },
    headerDate: { fontSize: 6.5, color: COLORS.slateUltraLight, marginTop: 2 },
    qrBox: { alignItems: "center" },
    qrImg: { width: 52, height: 52 },
    qrLabel: { fontSize: 5, color: COLORS.slateUltraLight, marginTop: 2 },

    // Hero section
    hero: { flexDirection: isRtl ? "row-reverse" : "row", gap: 20, marginBottom: 18 },
    imgContainer: { width: "36%" },
    imgBox: {
      aspectRatio: 1,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.bgAlt,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
    },
    productImg: { width: "100%", height: "100%", objectFit: "contain" },
    productInfo: { flex: 1, justifyContent: "center" },
    brandSku: {
      fontSize: 8,
      fontWeight: 600,
      color: COLORS.slateLight,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 6,
      textAlign: isRtl ? "right" : "left",
    },
    productTitle: {
      fontSize: 20,
      fontWeight: 900,
      color: COLORS.navy,
      lineHeight: 1.2,
      marginBottom: 8,
      textAlign: isRtl ? "right" : "left",
    },
    productDesc: {
      fontSize: 9,
      color: COLORS.slate,
      lineHeight: 1.6,
      textAlign: isRtl ? "right" : "left",
    },

    // Specs section
    sectionHeader: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      fontSize: 10,
      fontWeight: 800,
      color: COLORS.navy,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingBottom: 5,
      marginBottom: 10,
      textAlign: isRtl ? "right" : "left",
    },
    specsGrid: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 6,
      overflow: "hidden",
    },
    specRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      padding: "5 10",
      borderBottomWidth: 0.5,
      borderBottomColor: COLORS.border,
    },
    specLabel: {
      width: "45%",
      fontSize: 7,
      fontWeight: 700,
      color: COLORS.slateLight,
      textAlign: isRtl ? "right" : "left",
    },
    specValue: {
      width: "55%",
      fontSize: 7,
      fontWeight: 500,
      color: COLORS.navy,
      textAlign: isRtl ? "right" : "left",
    },

    // Features row
    featuresRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      gap: 8,
      marginTop: 14,
      marginBottom: 14,
    },
    featureBox: {
      flex: 1,
      padding: "8 10",
      borderRadius: 6,
      backgroundColor: COLORS.bgAlt,
      borderWidth: 0.5,
      borderColor: COLORS.border,
      alignItems: isRtl ? "flex-end" : "flex-start",
    },
    featureIcon: { fontSize: 12, marginBottom: 3 },
    featureLabel: {
      fontSize: 7,
      fontWeight: 700,
      color: COLORS.navy,
      textAlign: isRtl ? "right" : "left",
    },

    // Footer
    footer: {
      marginTop: "auto",
      paddingTop: 12,
      borderTopWidth: 2,
      borderTopColor: COLORS.navyLight,
    },
    footerGrid: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      gap: 16,
    },
    footerCol: {},
    footerLabel: { fontSize: 7.5, fontWeight: 700, color: COLORS.navy, marginBottom: 4, textAlign: isRtl ? "right" : "left" },
    footerText: { fontSize: 6.5, color: COLORS.slate, lineHeight: 1.5, textAlign: isRtl ? "right" : "left" },
    footerRight: { textAlign: isRtl ? "left" : "right" },
    footerWebsite: { fontSize: 7, fontWeight: 700, color: COLORS.navy },
    footerCopyright: { fontSize: 5.5, color: COLORS.slateUltraLight, marginTop: 8, textAlign: "center" },

    // Accent bar
    accentBar: {
      height: 3,
      backgroundColor: COLORS.cyan,
      borderRadius: 2,
      marginBottom: 14,
    },

    noImageText: {
      fontSize: 9,
      color: COLORS.slateLight,
      textAlign: "center",
    },
  })

  const features = [
    { icon: "⚡", label: isRtl ? "كفاءة" : "Efficiency" },
    { icon: "🛡️", label: isRtl ? "موثوقية" : "Reliable" },
    { icon: "🎯", label: isRtl ? "دقة" : "Precision" },
    { icon: "💻", label: isRtl ? "تكامل" : "Integration" },
  ]

  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: s.page },
      // Accent bar
      React.createElement(View, { style: s.accentBar }),

      // Header
      React.createElement(View, { style: s.header },
        React.createElement(Image, { src: logoBase64, style: s.logo }),
        React.createElement(View, { style: s.headerRight },
          React.createElement(View, { style: s.headerText },
            React.createElement(Text, { style: s.headerTitle }, isRtl ? "ورقة المواصفات" : "Specification Sheet"),
            React.createElement(Text, { style: s.headerDate }, dateStr),
          ),
          React.createElement(View, { style: s.qrBox },
            React.createElement(Image, { src: qrCodeDataUrl, style: s.qrImg }),
            React.createElement(Text, { style: s.qrLabel }, isRtl ? "امسح للمزيد" : "Scan for more"),
          ),
        ),
      ),

      // Hero
      React.createElement(View, { style: s.hero },
        React.createElement(View, { style: s.imgContainer },
          React.createElement(View, { style: s.imgBox },
            product.media?.thumbnailUrl
              ? React.createElement(Image, { src: product.media.thumbnailUrl, style: s.productImg })
              : React.createElement(Text, { style: s.noImageText }, "No Image"),
          ),
        ),
        React.createElement(View, { style: s.productInfo },
          React.createElement(Text, { style: s.brandSku }, `${brandName} • ${partNumber}`),
          React.createElement(Text, { style: s.productTitle }, productTitle),
          React.createElement(Text, { style: s.productDesc }, productDesc || (isRtl ? "لا يوجد وصف متاح" : "No description available")),
        ),
      ),

      // Specs
      filteredSpecs.length > 0 && React.createElement(View, {},
        React.createElement(Text, { style: s.sectionHeader }, isRtl ? "المواصفات الفنية" : "Technical Specifications"),
        React.createElement(View, { style: s.specsGrid },
          ...filteredSpecs.map((spec: any, idx: number) =>
            React.createElement(View, { key: idx, style: { ...s.specRow, backgroundColor: idx % 2 === 0 ? COLORS.bgAlt : COLORS.white } },
              React.createElement(Text, { style: s.specLabel }, resolveLocale(spec.name, locale)),
              React.createElement(Text, { style: s.specValue }, resolveLocale(spec.value, locale)),
            )
          ),
        ),
      ),

      // Features
      React.createElement(View, { style: s.featuresRow },
        ...features.map((f, idx) =>
          React.createElement(View, { key: idx, style: s.featureBox },
            React.createElement(Text, { style: s.featureIcon }, f.icon),
            React.createElement(Text, { style: s.featureLabel }, f.label),
          )
        ),
      ),

      // Footer
      React.createElement(View, { style: s.footer },
        React.createElement(View, { style: s.footerGrid },
          React.createElement(View, { style: s.footerCol },
            React.createElement(Text, { style: s.footerLabel }, isRtl ? "اتصل بنا" : "Contact Us"),
            React.createElement(Text, { style: s.footerText }, siteSettings?.phone || ""),
            React.createElement(Text, { style: s.footerText }, siteSettings?.email || ""),
          ),
          React.createElement(View, { style: s.footerCol },
            React.createElement(Text, { style: s.footerLabel }, isRtl ? "الموقع" : "Location"),
            React.createElement(Text, { style: s.footerText }, siteSettings?.address?.[locale as "en" | "ar"] || ""),
          ),
          React.createElement(View, { style: s.footerRight },
            React.createElement(Text, { style: s.footerWebsite }, "www.middleocean.jo"),
          ),
        ),
        React.createElement(Text, { style: s.footerCopyright },
          `© ${new Date().getFullYear()} Middle Ocean Printing. All rights reserved.`,
        ),
      ),
    ),
  )
}

// ── Route Handler ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get("product")
  const locale = searchParams.get("locale") || "en"

  if (!productSlug) {
    return NextResponse.json({ error: "Product slug is required" }, { status: 400 })
  }

  try {
    // Fetch data from Sanity
    console.log(`[BROCHURE-PDF] Fetching data for ${productSlug}...`)
    const [productData, siteSettings] = await Promise.all([
      sanityClient.fetch(productBySlugQuery, { slug: productSlug }),
      sanityClient.fetch(siteSettingsQuery),
    ])

    if (!productData) {
      console.error(`[BROCHURE-PDF] Product not found: ${productSlug}`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Generate QR code
    console.log(`[BROCHURE-PDF] Generating QR code...`)
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.jo"}/${locale}/products/${productData.category?.slug?.current || "all"}/${productSlug}`
    const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
      width: 80,
      margin: 1,
      color: { dark: "#1e293b", light: "#ffffff" },
    })

    // Read logo as base64 data URI
    console.log(`[BROCHURE-PDF] Loading logo...`)
    let logoBase64 = ""
    try {
      const logoPath = path.join(process.cwd(), "public", "brand", "logo_test.png")
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`
      } else {
        console.warn(`[BROCHURE-PDF] Logo not found at ${logoPath}, falling back to remote if possible or skipping`)
      }
    } catch (e: any) {
      console.error(`[BROCHURE-PDF] Error loading logo: ${e.message}`)
    }

    // Render PDF
    console.log(`[BROCHURE-PDF] Rendering PDF...`)
    const doc = BrochureDocument({
      product: productData,
      siteSettings,
      locale,
      qrCodeDataUrl,
      logoBase64,
    })

    console.log(`[BROCHURE-PDF] Calling renderToBuffer...`)
    const pdfBuffer = await renderToBuffer(doc as any)
    console.log(`[BROCHURE-PDF] Successfully generated PDF buffer, size: ${pdfBuffer.length} bytes`)

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="brochure-${productSlug}-${locale}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("[BROCHURE-PDF] ERROR:", error)
    return NextResponse.json(
      { error: "Failed to generate brochure PDF", details: error.message },
      { status: 500 },
    )
  }
}
