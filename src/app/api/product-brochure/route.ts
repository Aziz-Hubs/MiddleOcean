import { NextRequest, NextResponse } from "next/server"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, siteSettingsQuery } from "@/sanity/queries"
import QRCode from "qrcode"
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import path from "path"
import fs from "fs"
import { generateBrochureHTML, resolveLocale } from "./template"

// ── Route Handler ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get("product")
  const locale = searchParams.get("locale") || "en"

  if (!productSlug) {
    return NextResponse.json({ error: "Product slug is required" }, { status: 400 })
  }

  let browser = null

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

    // Generate HTML
    const html = generateBrochureHTML({
      product: productData,
      siteSettings,
      locale,
      qrCodeDataUrl,
      logoBase64,
    })

    // Launch Puppeteer with Chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()
    
    // Set HTML content
    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    })

    // Wait for fonts to load
    await page.waitForFunction(() => {
      return document.fonts.ready
    })

    // Additional wait to ensure all resources are loaded
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    })

    await browser.close()

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="brochure-${productSlug}-${locale}.pdf"`,
      },
    })
  } catch (error: Error | unknown) {
    console.error("[BROCHURE-PDF] ERROR:", error)
    
    // Ensure browser is closed even on error
    if (browser) {
      await browser.close()
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed", details: errorMessage }, { status: 500 })
  }
}

// Re-export resolveLocale for template.ts
export { resolveLocale }
