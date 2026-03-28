import { notFound } from "next/navigation"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, siteSettingsQuery } from "@/sanity/queries"
import QRCode from "qrcode"

interface PageProps {
  params: Promise<{
    product: string
  }>
  searchParams: Promise<{
    locale?: string
  }>
}

function resolveLocale(field: Record<string, string> | string | undefined, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  return field[locale] || field["en"] || ""
}

export default async function BrochurePage({ params, searchParams }: PageProps) {
  const { product: productSlug } = await params
  const { locale = "en" } = await searchParams
  const isRtl = locale === "ar"

  const productData = await sanityClient.fetch(productBySlugQuery, { slug: productSlug })
  if (!productData) notFound()

  const siteSettings = await sanityClient.fetch(siteSettingsQuery)

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${productData.category?.slug?.current || 'all'}/${productSlug}`
  const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
    width: 80,
    margin: 1,
    color: { dark: "#1e293b", light: "#ffffff" }
  })

  const productTitle = resolveLocale(productData.title, locale)
  const productDesc = resolveLocale(productData.description, locale)
  const partNumber = `SKU-${productData._id.substring(0, 8).toUpperCase()}`
  
  const filteredSpecs = productData.specifications
    ?.filter((spec: any) => {
      const nameEn = resolveLocale(spec.name, "en")?.toLowerCase()
      return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
    })
    .slice(0, 8) || []
  
  const hasMoreSpecs = (productData.specifications?.length || 0) > 8
  
  const features = [
    { icon: "⚡", label: isRtl ? "كفاءة" : "Efficiency" },
    { icon: "🛡️", label: isRtl ? "موثوقية" : "Reliable" },
    { icon: "🎯", label: isRtl ? "دقة" : "Precision" },
    { icon: "💻", label: isRtl ? "تكامل" : "Integration" },
  ]

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Product Brochure - {productTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @page { size: A4; margin: 0; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: ${isRtl ? "'Noto Sans Arabic', 'Inter', sans-serif" : "'Inter', sans-serif"}; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .brochure-page { width: 210mm; height: 297mm; padding: 8mm; background: white; position: relative; overflow: hidden; display: flex; flex-direction: column; }
          .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 2px solid #1e293b; }
          .logo { height: 48px; width: auto; }
          .header-right { display: flex; align-items: center; gap: 16px; }
          .header-text { text-align: ${isRtl ? "left" : "right"}; }
          .header-title { font-size: 10pt; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
          .header-date { font-size: 8pt; color: #94a3b8; margin: 2px 0 0 0; }
          .qr-code { display: flex; flex-direction: column; align-items: center; }
          .qr-code img { width: 64px; height: 64px; }
          .qr-label { font-size: 6pt; color: #94a3b8; margin-top: 2px; }
          .hero { display: flex; gap: 24px; margin-bottom: 24px; }
          .product-image-container { width: 38%; flex-shrink: 0; }
          .product-image-box { aspect-ratio: 1/1; border-radius: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          .product-image { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
          .product-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
          .brand-sku { font-size: 10pt; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; }
          .product-title { font-size: 22pt; font-weight: 900; color: #0f172a; line-height: 1.2; margin: 0 0 12px 0; }
          .product-desc { font-size: 11pt; color: #475569; line-height: 1.6; margin: 0; }
          .section { margin-bottom: 24px; }
          .section-title { display: flex; align-items: center; gap: 8px; font-size: 12pt; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
          .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #e2e8f0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
          .spec-row { display: flex; background: white; padding: 6px 12px; font-size: 8.5pt; }
          .spec-label { font-weight: 700; color: #64748b; width: 45%; flex-shrink: 0; }
          .spec-value { color: #0f172a; font-weight: 500; }
          .footer { margin-top: auto; padding-top: 24px; border-top: 2px solid #1e293b; }
          .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
        `}} />
      </head>
      <body>
        <div className="brochure-page">
          <div className="header">
            <img src="/brand/logo.svg" alt="Middle Ocean" className="logo" />
            <div className="header-right">
              <div className="header-text">
                <p className="header-title">{isRtl ? "ورقة المواصفات" : "Specification Sheet"}</p>
                <p className="header-date">{new Date().toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="qr-code">
                <img src={qrCodeDataUrl} alt="QR" />
                <span className="qr-label">{isRtl ? "امسح للمزيد" : "Scan for more"}</span>
              </div>
            </div>
          </div>
          
          <div className="hero">
            <div className="product-image-container">
              <div className="product-image-box">
                {productData.media?.thumbnailUrl ? (
                  <img src={productData.media.thumbnailUrl} alt={productTitle} className="product-image" />
                ) : (
                  <span className="no-image">No Image</span>
                )}
              </div>
            </div>
            <div className="product-info">
              <p className="brand-sku">{productData.brand?.title || "Middle Ocean"} • {partNumber}</p>
              <h1 className="product-title">{productTitle}</h1>
              <p className="product-desc">{productDesc || (isRtl ? "لا يوجد وصف متاح" : "No description available")}</p>
            </div>
          </div>
          
          <div className="section">
            <div className="section-title">{isRtl ? "المواصفات الفنية" : "Technical Specifications"}</div>
            <div className="specs-grid">
              {filteredSpecs.map((spec: any, idx: number) => (
                <div key={idx} className="spec-row" style={{ backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                  <span className="spec-label">{resolveLocale(spec.name, locale)}</span>
                  <span className="spec-value">{resolveLocale(spec.value, locale)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="footer">
            <div className="footer-grid">
              <div>
                <h3 style={{ fontSize: '9pt', fontWeight: 700, marginBottom: '8px' }}>{isRtl ? "اتصل بنا" : "Contact Us"}</h3>
                <p style={{ fontSize: '8pt', color: '#475569' }}>{siteSettings?.phone}</p>
                <p style={{ fontSize: '8pt', color: '#475569' }}>{siteSettings?.email}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '9pt', fontWeight: 700, marginBottom: '8px' }}>{isRtl ? "الموقع" : "Location"}</h3>
                <p style={{ fontSize: '8pt', color: '#475569' }}>{siteSettings?.address?.[locale as "en" | "ar"]}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '8pt', fontWeight: 700 }}>www.middleocean.jo</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
