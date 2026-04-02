import { NextRequest, NextResponse } from "next/server"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, siteSettingsQuery } from "@/sanity/queries"
import QRCode from "qrcode"
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium-min"
import path from "path"
import fs from "fs"
import { generateBrochureHTML, resolveLocale } from "./template"
import { optimizeSanityUrl, optimizeLocalImage, PDF_DIMENSIONS } from "./image-utils"

// Chromium pack URL matching @sparticuz/chromium-min@143.0.4
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar"

type BrochureImage = {
  imageUrl: string
  title?: Record<string, string>
  description?: Record<string, string>
}

function mergeBrochureImages(
  productImages: BrochureImage[] | undefined,
  categoryImages: BrochureImage[] | undefined
): BrochureImage[] {
  const product = productImages || []
  const category = categoryImages || []

  // If product has no images, use all category images (up to 6)
  if (product.length === 0) {
    return category.slice(0, 6)
  }

  // If product has all 6 images, use product images only
  if (product.length >= 6) {
    return product.slice(0, 6)
  }

  // Replace in position: product images override category at same indices
  const result: BrochureImage[] = (category.length >= 6 ? category.slice(0, 6) : [...category, ...Array(6 - category.length).fill(null)])
  
  for (let i = 0; i < product.length && i < 6; i++) {
    if (product[i]?.imageUrl) {
      result[i] = product[i]
    }
  }

  // Filter out any null placeholders
  return result.filter((img): img is BrochureImage => img !== null && !!img.imageUrl)
}

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

    // Merge brochure images: product images override category at same positions
    const mergedBrochureImages = mergeBrochureImages(
      productData.brochureImages,
      productData.category?.brochureImages
    )

    // QR Code
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.vercel.app"}/${locale}/products/${productData.category?.slug?.current || "all"}/${productSlug}`
    const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
      width: 80, margin: 1, color: { dark: "#1e293b", light: "#ffffff" },
    })

    // Logo - optimized as JPEG
    let logoBase64 = ""
    try {
      const logoPath = path.join(process.cwd(), "public", "brand", "Brochure_LOGO", "MiddleOcean_LOGO.png")
      if (fs.existsSync(logoPath)) {
        logoBase64 = await optimizeLocalImage(logoPath, PDF_DIMENSIONS.logo.width, PDF_DIMENSIONS.logo.height)
        console.log("[BROCHURE-PDF] Logo optimized successfully")
      }
    } catch (e) {
      console.warn("[BROCHURE-PDF] Logo optimization failed:", e)
    }

    // Background image - optimized as JPEG
    let backgroundBase64 = ""
    try {
      const bgPath = path.join(process.cwd(), "public", "misc", "Brochure_Image_background.png")
      if (fs.existsSync(bgPath)) {
        backgroundBase64 = await optimizeLocalImage(bgPath, PDF_DIMENSIONS.background.width, PDF_DIMENSIONS.background.height)
        console.log("[BROCHURE-PDF] Background optimized successfully")
      }
    } catch (e) {
      console.warn("[BROCHURE-PDF] Background optimization failed:", e)
    }

    // Optimize product image URLs via Sanity CDN (FREE)
    let optimizedProduct = { ...productData }
    
    if (optimizedProduct.media?.thumbnailUrl) {
      optimizedProduct = {
        ...optimizedProduct,
        media: {
          ...optimizedProduct.media,
          thumbnailUrl: optimizeSanityUrl(optimizedProduct.media.thumbnailUrl, PDF_DIMENSIONS.thumbnail.width)
        }
      }
    }

    // Optimize merged brochure images
    if (mergedBrochureImages.length) {
      optimizedProduct = {
        ...optimizedProduct,
        brochureImages: mergedBrochureImages.map((img) => ({
          ...img,
          imageUrl: optimizeSanityUrl(img.imageUrl, PDF_DIMENSIONS.catalog.width)
        }))
      }
    } else {
      optimizedProduct = {
        ...optimizedProduct,
        brochureImages: []
      }
    }

    // Generate HTML
    const html = generateBrochureHTML({
      product: optimizedProduct,
      siteSettings,
      locale,
      qrCodeDataUrl,
      logoBase64,
      backgroundImageBase64: backgroundBase64,
    })

    // Use @sparticuz/chromium's built-in executablePath()
    console.log("[BROCHURE-PDF] Setting up Chromium via @sparticuz/chromium-min...")
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL)
    console.log("[BROCHURE-PDF] Chromium ready at:", executablePath)

    // Launch Puppeteer with Chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: "shell" as const,
    })

    console.log("[BROCHURE-PDF] Browser launched, creating page...")
    
    const page = await browser.newPage()
    
    // Set HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 15000,
    })

    console.log("[BROCHURE-PDF] Content loaded, generating PDF...")

    // Generate PDF buffer (images are already optimized)
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
    
    console.log("[BROCHURE-PDF] PDF generated successfully, size:", (pdfBuffer.length /1024 ).toFixed(1), "KB")

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