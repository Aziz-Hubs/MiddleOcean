import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, siteSettingsQuery } from "@/sanity/queries"
import QRCode from "qrcode"
import React from "react"
import { Document, Page, View, Text, Image, Font, StyleSheet, Svg, Path, Circle, Rect } from "@react-pdf/renderer"
import path from "path"
import fs from "fs"

// ── Fonts ────────────────────────────────────────────────────────────
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

Font.registerHyphenationCallback((word) => [word])

// ── Helpers ──────────────────────────────────────────────────────────
function resolveLocale(field: Record<string, string> | string | undefined, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  return field[locale] || field["en"] || ""
}

// ── Colors ───────────────────────────────────────────────────────────
const C = {
  navy: "#0f172a",
  navyLight: "#1e293b",
  slate: "#475569",
  slateLight: "#64748b",
  slateUltraLight: "#94a3b8",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  bgAlt: "#f8fafc",
  white: "#ffffff",
  cyan: "#06b6d4",
  cyanDark: "#0891b2",
  blue: "#3b82f6",
  emerald: "#10b981",
  yellow: "#f59e0b",
  facebook: "#1877F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
}

// ── SVG Icons (Lucide-style, 24x24 viewBox) ───────────────
function ZapIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 16, height: 16 },
    React.createElement(Path, {
      d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
      fill: "none", stroke: C.blue, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"
    })
  )
}

function ShieldIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 16, height: 16 },
    React.createElement(Path, {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
      fill: "none", stroke: C.blue, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"
    })
  )
}

function TargetIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 16, height: 16 },
    React.createElement(Circle, { cx: "12", cy: "12", r: "10", fill: "none", stroke: C.cyan, strokeWidth: 2 }),
    React.createElement(Circle, { cx: "12", cy: "12", r: "3", fill: "none", stroke: C.cyan, strokeWidth: 2 })
  )
}

function CpuIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 16, height: 16 },
    React.createElement(Rect, { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2", fill: "none", stroke: C.cyanDark, strokeWidth: 2 }),
    React.createElement(Rect, { x: "9", y: "9", width: "6", height: "6", fill: "none", stroke: C.cyanDark, strokeWidth: 2 }),
    React.createElement(Path, { d: "M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3", fill: "none", stroke: C.cyanDark, strokeWidth: 2, strokeLinecap: "round" })
  )
}

function PhoneIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 10, height: 10 },
    React.createElement(Path, {
      d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
      fill: "none", stroke: C.cyanDark, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"
    })
  )
}

function MailIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 10, height: 10 },
    React.createElement(Rect, { x: "2", y: "4", width: "20", height: "16", rx: "2", fill: "none", stroke: C.cyanDark, strokeWidth: 2 }),
    React.createElement(Path, { d: "M22 7l-10 7L2 7", fill: "none", stroke: C.cyanDark, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
  )
}

function GlobeIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 10, height: 10 },
    React.createElement(Circle, { cx: "12", cy: "12", r: "10", fill: "none", stroke: C.cyanDark, strokeWidth: 2 }),
    React.createElement(Path, { d: "M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z", fill: "none", stroke: C.cyanDark, strokeWidth: 2 })
  )
}

function MapPinIcon() {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 10, height: 10 },
    React.createElement(Path, { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", fill: "none", stroke: C.cyanDark, strokeWidth: 2 }),
    React.createElement(Circle, { cx: "12", cy: "10", r: "3", fill: "none", stroke: C.cyanDark, strokeWidth: 2 })
  )
}

function FacebookIcon(props: any) {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 12, height: 12, ...props },
    React.createElement(Path, { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", fill: "none", stroke: C.blue, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
  )
}

function InstagramIcon(props: any) {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 12, height: 12, ...props },
    React.createElement(Rect, { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5", fill: "none", stroke: C.instagram, strokeWidth: 2 }),
    React.createElement(Path, { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z", fill: "none", stroke: C.instagram, strokeWidth: 2 }),
    React.createElement(Path, { d: "M17.5 6.5h.01", fill: "none", stroke: C.instagram, strokeWidth: 2 })
  )
}

function LinkedinIcon(props: any) {
  return React.createElement(Svg, { viewBox: "0 0 24 24", width: 12, height: 12, ...props },
    React.createElement(Path, { d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z", fill: "none", stroke: C.linkedin, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }),
    React.createElement(Circle, { cx: "4", cy: "4", r: "2", fill: "none", stroke: C.linkedin, strokeWidth: 2 })
  )
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
  const brandName = product.brand?.title === "Generic" || !product.brand?.title ? "Generic" : product.brand.title

  const filteredSpecs = product.specifications
    ?.filter((spec: any) => {
      const nameEn = resolveLocale(spec.name, "en")?.toLowerCase()
      return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
    })
    .slice(0, 10) || []

  // Split date into: Month Day, Year
  const currentMonth = new Date().toLocaleString(locale === "ar" ? "ar-JO" : "en-US", { month: "long" })
  const currentDay = new Date().getDate()
  const currentYear = new Date().getFullYear()
  const dateStr = isRtl ? `${currentDay} ${currentMonth} ${currentYear}` : `${currentMonth} ${currentDay}, ${currentYear}`

  const features = [
    { Icon: ZapIcon, label: isRtl ? "كفاءة عالية" : "High Efficiency", desc: isRtl ? "يقلل من وقت التوقف وتكاليف الصيانة" : "Reduces downtime and maintenance costs" },
    { Icon: ShieldIcon, label: isRtl ? "موثوقية" : "Reliability", desc: isRtl ? "مصمم للبيئات الصناعية الصعبة" : "Built for demanding industrial environments" },
    { Icon: TargetIcon, label: isRtl ? "دقة متناهية" : "Precision", desc: isRtl ? "نتائج دقيقة في كل مرة" : "Perfectly calibrated for exact results" },
    { Icon: CpuIcon, label: isRtl ? "تكامل سلس" : "Seamless Integration", desc: isRtl ? "متوافق مع أنظمتكم الحالية بسهولة" : "Compatible with your existing workflows" },
  ]

  const certBadges = [
    { label: "ISO 9001", borderColor: C.blue },
    { label: "CE Certified", borderColor: C.emerald },
  ]

  const s = StyleSheet.create({
    page: {
      fontFamily,
      backgroundColor: C.white,
      padding: "20 32 14 32",
      flexDirection: "column",
    },
    // Header
    header: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    logo: { height: 36, width: 66 },
    headerRight: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      gap: 16,
    },
    headerText: { 
      textAlign: isRtl ? "right" : "right",
      alignItems: isRtl ? "flex-end" : "flex-end",
    },
    headerTitle: { fontSize: 10, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: 0.8 },
    headerDate: { fontSize: 7, color: C.slateUltraLight, marginTop: 2 },
    qrBox: { alignItems: "center" },
    qrImg: { width: 42, height: 42 },
    qrLabel: { fontSize: 5, color: C.slateUltraLight, marginTop: 1 },

    // Hero section
    hero: { flexDirection: isRtl ? "row-reverse" : "row", gap: 24, marginBottom: 18 },
    imgContainer: { width: "30%" },
    imgBox: {
      aspectRatio: 1,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: C.borderLight,
      backgroundColor: C.bgAlt,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    productImg: { width: "100%", height: "100%", objectFit: "contain" },
    productInfo: { flex: 1, justifyContent: "center" },
    brandSku: {
      fontSize: 8,
      fontWeight: 600,
      color: C.slateLight,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
      textAlign: isRtl ? "right" : "left",
    },
    productTitle: {
      fontSize: 22,
      fontWeight: 800,
      color: C.navy,
      lineHeight: 1.1,
      marginBottom: 8,
      textAlign: isRtl ? "right" : "left",
    },
    productDesc: {
      fontSize: 8.5,
      color: C.slate,
      lineHeight: 1.6,
      marginBottom: 12,
      textAlign: isRtl ? "right" : "left",
    },

    // Cert badges
    badgesRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      gap: 6,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 5,
      borderWidth: 1.5,
    },
    badgeText: {
      fontSize: 7,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // Section header
    sectionHeaderRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
      marginTop: 2,
    },
    sectionBar: {
      width: 3.5,
      height: 16,
      backgroundColor: C.cyan,
      borderRadius: 2,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 800,
      color: C.navy,
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    // Specs
    specsTable: {
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 6,
    },
    specRow: {
      flexDirection: isRtl ? "row-reverse" : "row",
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    specCell: {
      flexDirection: isRtl ? "row-reverse" : "row",
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignItems: "center",
      minHeight: 22,
    },
    specCellBorder: {
      borderRightWidth: isRtl ? 0 : 0.5,
      borderLeftWidth: isRtl ? 0.5 : 0,
      borderColor: C.border,
    },
    specLabel: {
      fontSize: 6.5,
      fontWeight: 700,
      color: C.slateLight,
      textTransform: "uppercase",
      width: "50%", // More room for Arabic
      textAlign: isRtl ? "right" : "left",
    },
    specValue: {
      fontSize: 7,
      fontWeight: 500,
      color: C.navy,
      width: "50%",
      textAlign: isRtl ? "right" : "left",
    },

    // Business Value
    featuresGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 8,
    },
    featureCard: {
      width: "48.8%",
      flexDirection: isRtl ? "row-reverse" : "row",
      gap: 10,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: C.border,
      backgroundColor: C.white,
    },
    featureIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 7,
      backgroundColor: C.bgAlt,
      borderWidth: 1,
      borderColor: C.borderLight,
      alignItems: "center",
      justifyContent: "center",
    },
    featureContent: { flex: 1 },
    featureLabel: {
      fontSize: 8.5,
      fontWeight: 700,
      color: C.navy,
      marginBottom: 2,
      textAlign: isRtl ? "right" : "left",
    },
    featureDesc: {
      fontSize: 6.5,
      color: C.slateLight,
      lineHeight: 1.5,
      textAlign: isRtl ? "right" : "left",
    },

    // Footer
    footer: {
      marginTop: "auto",
      borderTopWidth: 2,
      borderTopColor: C.navyLight,
      paddingTop: 14,
    },
    footerGrid: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
    },
    footerCol: { width: "32%" },
    footerLabel: {
      fontSize: 8.5,
      fontWeight: 800,
      color: C.navy,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
      textAlign: isRtl ? "right" : "left",
    },
    footerItem: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: 6,
      marginBottom: 5,
    },
    footerText: { fontSize: 7, color: C.slate, textAlign: isRtl ? "right" : "left" },
    
    // Social Card
    socialCard: {
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 5,
      paddingVertical: 4.5,
      paddingHorizontal: 10,
      borderRadius: 6,
      backgroundColor: C.bgAlt,
      borderWidth: 1,
      borderColor: C.borderLight,
    },
    socialText: { fontSize: 7.5, color: C.slate, fontWeight: 600 },

    copyrightBar: {
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 14,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: C.borderLight,
    },
    copyrightText: { fontSize: 5.5, color: C.slateUltraLight },

    noImageText: { fontSize: 9, color: C.slateLight, textAlign: "center" },
  })

  // Build spec rows
  const specPairs: any[][] = []
  for (let i = 0; i < filteredSpecs.length; i += 2) {
    specPairs.push(filteredSpecs.slice(i, i + 2))
  }

  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: s.page },

      // ── HEADER ──
      React.createElement(View, { style: s.header },
        logoBase64
          ? React.createElement(Image, { src: logoBase64, style: s.logo })
          : React.createElement(Text, { style: { fontSize: 16, fontWeight: 800, color: C.navy } }, "Middle Ocean"),
        React.createElement(View, { style: s.headerRight },
          React.createElement(View, { style: s.headerText },
            React.createElement(Text, { style: { ...s.headerTitle, lineHeight: isRtl ? 1.4 : 1 } }, 
              isRtl ? "\u200Fورقة المواصفات" : "SPECIFICATION SHEET"
            ),
            React.createElement(Text, { style: s.headerDate }, dateStr),
          ),
          React.createElement(View, { style: s.qrBox },
            React.createElement(Image, { src: qrCodeDataUrl, style: s.qrImg }),
            React.createElement(Text, { style: s.qrLabel }, isRtl ? "امسح للمزيد" : "Scan for more"),
          ),
        ),
      ),

      // ── HERO ──
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
          React.createElement(Text, { style: { ...s.productTitle, lineHeight: isRtl ? 1.4 : 1.1 } }, 
            isRtl ? `\u200F${productTitle}` : productTitle
          ),
          React.createElement(Text, { style: { ...s.productDesc, lineHeight: isRtl ? 1.5 : 1.6 } },
            isRtl 
              ? `\u200F${productDesc || "منتج عالي الجودة بمواصفات عالمية وتصميم متميز يلبي احتياجاتكم"}`
              : (productDesc || "High-quality product with international specifications and premium design"),
          ),
          // Cert badges
          React.createElement(View, { style: s.badgesRow },
            ...certBadges.map((b, i) =>
              React.createElement(View, {
                key: i,
                style: { ...s.badge, borderColor: b.borderColor }
              },
                React.createElement(Text, {
                  style: { ...s.badgeText, color: b.borderColor }
                }, b.label),
              )
            ),
          ),
        ),
      ),

      // ── TECHNICAL SPECIFICATIONS ──
      filteredSpecs.length > 0 && React.createElement(View, { style: { marginBottom: 20 } },
        React.createElement(View, { style: s.sectionHeaderRow },
          React.createElement(View, { style: s.sectionBar }),
          React.createElement(Text, { style: { ...s.sectionTitle, lineHeight: isRtl ? 1.4 : 1 } },
            isRtl ? "\u200Fالمواصفات الفنية" : "TECHNICAL SPECIFICATIONS"
          ),
        ),
        React.createElement(View, { style: s.specsTable },
          ...specPairs.map((pair, rowIdx) =>
            React.createElement(View, {
              key: rowIdx,
              style: {
                ...s.specRow,
                backgroundColor: rowIdx % 2 === 0 ? C.bgAlt : C.white,
                borderBottomWidth: rowIdx === specPairs.length - 1 ? 0 : 1
              }
            },
              // First spec
              React.createElement(View, { style: { ...s.specCell, ...s.specCellBorder } },
                React.createElement(Text, { style: { ...s.specLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
                  isRtl ? `\u200F${resolveLocale(pair[0].name, locale)}` : resolveLocale(pair[0].name, locale)
                ),
                React.createElement(Text, { style: { ...s.specValue, lineHeight: isRtl ? 1.4 : 1 } }, 
                  isRtl ? `\u200F${resolveLocale(pair[0].value, locale)}` : resolveLocale(pair[0].value, locale)
                ),
              ),
              // Second spec
              pair[1]
                ? React.createElement(View, { style: s.specCell },
                    React.createElement(Text, { style: { ...s.specLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
                      isRtl ? `\u200F${resolveLocale(pair[1].name, locale)}` : resolveLocale(pair[1].name, locale)
                    ),
                    React.createElement(Text, { style: { ...s.specValue, lineHeight: isRtl ? 1.4 : 1 } }, 
                      isRtl ? `\u200F${resolveLocale(pair[1].value, locale)}` : resolveLocale(pair[1].value, locale)
                    ),
                  )
                : React.createElement(View, { style: s.specCell }),
            )
          ),
        ),
      ),

      // ── BUSINESS VALUE ──
      React.createElement(View, { style: { marginBottom: 12 } },
        React.createElement(View, { style: s.sectionHeaderRow },
          React.createElement(View, { style: s.sectionBar }),
          React.createElement(Text, { style: { ...s.sectionTitle, lineHeight: isRtl ? 1.4 : 1 } },
            isRtl ? "\u200Fالقيمة المضافة" : "ADDED VALUE"
          ),
        ),
        React.createElement(View, { style: s.featuresGrid },
          ...features.map((f, idx) =>
            React.createElement(View, { key: idx, style: s.featureCard },
              React.createElement(View, { style: s.featureIconWrap },
                React.createElement(f.Icon),
              ),
              React.createElement(View, { style: s.featureContent },
                React.createElement(Text, { style: { ...s.featureLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
                  isRtl ? `\u200F${f.label}` : f.label
                ),
                React.createElement(Text, { style: { ...s.featureDesc, lineHeight: isRtl ? 1.4 : 1 } }, 
                  isRtl ? `\u200F${f.desc}` : f.desc
                ),
              ),
            )
          ),
        ),
      ),

      // ── FOOTER ──
      React.createElement(View, { style: s.footer },
        React.createElement(View, { style: s.footerGrid },
          // Contact Us
          React.createElement(View, { style: { ...s.footerCol, width: "35%" } },
            React.createElement(Text, { style: { ...s.footerLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
              isRtl ? "\u200Fاتصل بنا" : "CONTACT US"
            ),
            React.createElement(View, { style: s.footerItem },
              React.createElement(PhoneIcon),
              React.createElement(Text, { style: s.footerText }, siteSettings?.phone || "+962 7 8100 0988"),
            ),
            React.createElement(View, { style: s.footerItem },
              React.createElement(MailIcon),
              React.createElement(Text, { style: s.footerText }, siteSettings?.email || "info@middleocean.jo"),
            ),
            React.createElement(View, { style: s.footerItem },
              React.createElement(GlobeIcon),
              React.createElement(Text, { style: s.footerText }, "www.middleocean.jo"),
            ),
          ),
          // Location
          React.createElement(View, { style: { ...s.footerCol, width: "35%" } },
            React.createElement(Text, { style: { ...s.footerLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
              isRtl ? "\u200Fالموقع" : "LOCATION"
            ),
            React.createElement(View, { style: s.footerItem },
              React.createElement(MapPinIcon),
              React.createElement(Text, { style: { ...s.footerText, lineHeight: 1.4 } },
                isRtl 
                  ? "\u200Fشارع عصام العجلوني، مجمع شركو، الطابق الأول، عمان - الأردن"
                  : (siteSettings?.address?.[locale as "en" | "ar"] || "60 Issam Ajlouni Str, Sherko Complex, Floor 1, Amman - Jordan"),
              ),
            ),
          ),
          // Follow Us
          React.createElement(View, { style: { ...s.footerCol, width: "25%" } },
            React.createElement(Text, { style: { ...s.footerLabel, lineHeight: isRtl ? 1.4 : 1 } }, 
              isRtl ? "\u200Fتابعنا" : "FOLLOW US"
            ),
            React.createElement(View, { style: s.socialCard },
              React.createElement(FacebookIcon),
              React.createElement(Text, { style: s.socialText }, "middleocean"),
            ),
            React.createElement(View, { style: s.socialCard },
              React.createElement(InstagramIcon),
              React.createElement(Text, { style: s.socialText }, "middleocean"),
            ),
            React.createElement(View, { style: s.socialCard },
              React.createElement(LinkedinIcon),
              React.createElement(Text, { style: s.socialText }, "middleocean"),
            ),
          ),
        ),

        // Copyright
        React.createElement(View, { style: s.copyrightBar },
          React.createElement(Text, { style: s.copyrightText },
            isRtl ? "© ٢٠٢٦ ميدل أوشن للطباعة. جميع الحقوق محفوظة" : `© ${new Date().getFullYear()} Middle Ocean Printing. All Rights Reserved`,
          ),
          React.createElement(Text, { style: s.copyrightText },
            isRtl ? "المواصفات قابلة للتغيير" : "Specifications subject to change",
          ),
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
    const [productData, siteSettings] = await Promise.all([
      sanityClient.fetch(productBySlugQuery, { slug: productSlug }),
      sanityClient.fetch(siteSettingsQuery),
    ])

    if (!productData) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // QR
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.jo"}/${locale}/products/${productData.category?.slug?.current || "all"}/${productSlug}`
    const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
      width: 80, margin: 1, color: { dark: "#1e293b", light: "#ffffff" },
    })

    // Logo
    let logoBase64 = ""
    try {
      const logoPath = path.join(process.cwd(), "public", "brand", "logo_test.png")
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`
      }
    } catch (e) {
      console.warn("Logo failed load", e)
    }

    const doc = BrochureDocument({ product: productData, siteSettings, locale, qrCodeDataUrl, logoBase64 })
    const pdfBuffer = await renderToBuffer(doc as any)

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="brochure-${productSlug}-${locale}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("[BROCHURE-PDF] ERROR:", error)
    return NextResponse.json({ error: "Failed", details: error.message }, { status: 500 })
  }
}
