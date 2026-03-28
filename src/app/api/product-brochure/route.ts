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
    console.log(`[BROCHURE-PDF] Starting PDF generation for ${productSlug} (${locale})`)
    
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
      console.warn("[BROCHURE-PDF] Logo failed to load:", e)
    }

    // Generate HTML
    const html = generateBrochureHTML({
      product: productData,
      siteSettings,
      locale,
      qrCodeDataUrl,
      logoBase64,
    })

    console.log("[BROCHURE-PDF] Launching Puppeteer...")
    
    // Get Chromium executable path
    let executablePath: string
    try {
      executablePath = await chromium.executablePath()
      console.log("[BROCHURE-PDF] Chromium path:", executablePath)
    } catch (pathError) {
      console.error("[BROCHURE-PDF] Failed to get Chromium path:", pathError)
      throw new Error("Chromium binary not found. Please ensure @sparticuz/chromium is properly installed.")
    }
    
    // Launch Puppeteer with Chromium
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
      executablePath,
      headless: true,
    })

    console.log("[BROCHURE-PDF] Browser launched, creating page...")
    
    const page = await browser.newPage()
    
    // Set HTML content with shorter timeout
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 15000,
    })

    console.log("[BROCHURE-PDF] Content loaded, generating PDF...")

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
    browser = null
    
    console.log("[BROCHURE-PDF] PDF generated successfully")

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
      try {
        await browser.close()
      } catch (closeError) {
        console.error("[BROCHURE-PDF] Error closing browser:", closeError)
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : ""
    
    console.error("[BROCHURE-PDF] Full error:", { message: errorMessage, stack: errorStack })
    
    return NextResponse.json({ 
      error: "Failed to generate PDF", 
      details: errorMessage 
    }, { status: 500 })
  }
}

// Re-export resolveLocale for template.ts
export { resolveLocale }
