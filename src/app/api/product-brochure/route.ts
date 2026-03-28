import { NextRequest, NextResponse } from "next/server"
import { pipe, gotenberg, convert, url, please, to, set, delay } from "gotenberg-js-client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get("product")
  const locale = searchParams.get("locale") || "en"
  
  if (!productSlug) {
    return NextResponse.json({ error: "Product slug is required" }, { status: 400 })
  }

  const host = req.headers.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  
  // Point to the dedicated printable brochure page
  const targetUrl = `${protocol}://${host}/brochure/${productSlug}?locale=${locale}`

  const gotenbergUrl = process.env.GOTENBERG_URL || "http://localhost:8080"
  console.log(`[BROCHURE-PDF] Generating for ${productSlug} via ${gotenbergUrl}`)

  try {
    const toPDF = pipe(
      gotenberg(gotenbergUrl),
      convert,
      url,
      to({
        paperWidth: 8.27,
        paperHeight: 11.69,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      }),
      set(delay(3)),
      please
    )

    const pdfStream = await toPDF(targetUrl)

    const chunks: any[] = []
    for await (const chunk of pdfStream as any) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="brochure-${productSlug}-${locale}.pdf"`
      }
    })
  } catch (error: any) {
    console.error("[BROCHURE-PDF] ERROR:", error)
    return NextResponse.json({ 
      error: "Failed to generate brochure PDF via Gotenberg", 
      details: error.message
    }, { status: 500 })
  }
}
