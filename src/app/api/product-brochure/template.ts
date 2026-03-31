// Helper to resolve locale field - handles Sanity localeString objects
function resolveLocale(field: Record<string, string> | string | undefined | null, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  // Handle Sanity localeString structure: { _type: 'localeString', en: '...', ar: '...' }
  if (field[locale]) return field[locale]
  if (field['en']) return field['en']
  if (field['ar']) return field['ar']
  return String(field) || ""
}

interface Product {
  title: Record<string, string> | string
  description: Record<string, string> | string
  _id: string
  brand?: { title: string }
  media?: { thumbnailUrl: string }
  category?: { slug?: { current: string } }
  specifications?: Array<{
    name: Record<string, string> | string
    value: Record<string, string> | string
  }>
  brochureImages?: Array<{
    imageUrl: string
    title?: Record<string, string>
    description?: Record<string, string>
  }>
  warrantyMonths?: number
}

interface SiteSettings {
  phone?: string
  email?: string
  address?: Record<string, string>
}

interface TemplateData {
  product: Product
  siteSettings: SiteSettings
  locale: string
  qrCodeDataUrl: string
  logoBase64: string
  backgroundImageBase64?: string
  interFontBase64?: string
  arabicFontBase64?: string
}

export function generateBrochureHTML(data: TemplateData): string {
  const { product, siteSettings, locale, qrCodeDataUrl, logoBase64, backgroundImageBase64, interFontBase64, arabicFontBase64 } = data
  const isRtl = locale === "ar"
  
  // Debug logging
  console.log("[PDF Template] Product data:", JSON.stringify({
    title: product.title,
    description: product.description,
    hasSpecs: !!product.specifications,
    specsCount: product.specifications?.length
  }, null, 2))
  
  // Resolve product data with fallbacks
  let productTitle = resolveLocale(product.title, locale)
  if (!productTitle && typeof product.title === 'object') {
    // Try direct property access
    const titleObj = product.title as Record<string, string>
    productTitle = titleObj?.en || titleObj?.ar || ""
  }
  
  let productDesc = resolveLocale(product.description, locale)
  if (!productDesc && typeof product.description === 'object') {
    const descObj = product.description as Record<string, string>
    productDesc = descObj?.en || descObj?.ar || ""
  }
  
  // Apply BiDi for Arabic text
  productTitle = productTitle || (isRtl ? "منتج" : "Product")
  productDesc = productDesc || (isRtl ? "منتج عالي الجودة" : "High-quality product")
  
  const partNumber = `SKU-${product._id?.substring(0, 8).toUpperCase() || "UNKNOWN"}`
  const brandName = product.brand?.title === "Generic" || !product.brand?.title ? "Generic" : product.brand.title

  // Filter and prepare specifications
  let filteredSpecs: Array<{ name: Record<string, string> | string; value: Record<string, string> | string }> = []
  if (product.specifications && Array.isArray(product.specifications)) {
    filteredSpecs = product.specifications
      .filter((spec) => {
        if (!spec || typeof spec !== 'object') return false
        const specObj = spec as { name?: Record<string, string> | string }
        const nameEn = resolveLocale(specObj.name, "en")?.toLowerCase()
        return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
      })
      .slice(0, 10)
  }

  // Current date
  const currentDate = new Date()
  const dateStr = isRtl 
    ? `${currentDate.getDate()} ${currentDate.toLocaleString("ar-JO", { month: "long" })} ${currentDate.getFullYear()}`
    : `${currentDate.toLocaleString("en-US", { month: "long" })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

  // Features - hardcoded for now to avoid undefined issues
  const features = [
    { 
      icon: "zap", 
      label: isRtl ? "كفاءة عالية" : "High Efficiency", 
      desc: isRtl ? "يقلل من وقت التوقف وتكاليف الصيانة" : "Reduces downtime and maintenance costs"
    },
    { 
      icon: "shield", 
      label: isRtl ? "موثوقية" : "Reliability", 
      desc: isRtl ? "مصمم للبيئات الصناعية الصعبة" : "Built for demanding industrial environments"
    },
    { 
      icon: "target", 
      label: isRtl ? "دقة متناهية" : "Precision", 
      desc: isRtl ? "نتائج دقيقة في كل مرة" : "Perfectly calibrated for exact results"
    },
    { 
      icon: "cpu", 
      label: isRtl ? "تكامل سلس" : "Seamless Integration", 
      desc: isRtl ? "متوافق مع أنظمتكم الحالية بسهولة" : "Compatible with your existing workflows"
    },
  ]

  // Certificate badges
  const certBadges = [
    { label: "ISO 9001", color: "#3b82f6" },
    { label: "CE Certified", color: "#10b981" },
  ]

  // Process catalog images (3+ images required to show section)
  const catalogImages = (product.brochureImages || [])
    .slice(0, 6)
    .filter(img => img.imageUrl)
    .map(img => ({
      imageUrl: img.imageUrl,
      title: resolveLocale(img.title, locale) || "",
      description: resolveLocale(img.description, locale) || "",
    }))

  const showCatalogSection = catalogImages.length >= 3

  // Spec rows (2 per row)
  const specRows: Array<Array<{ name: string; value: string }>> = []
  for (let i = 0; i < filteredSpecs.length; i += 2) {
    const row: Array<{ name: string; value: string }> = []
    const spec1 = filteredSpecs[i]
    const spec2 = filteredSpecs[i + 1]
    
    if (spec1) {
      const name = resolveLocale(spec1.name, locale) || resolveLocale(spec1.name, "en") || ""
      const value = resolveLocale(spec1.value, locale) || resolveLocale(spec1.value, "en") || ""
      row.push({
        name: name,
        value: value
      })
    }
    
    if (spec2) {
      const name = resolveLocale(spec2.name, locale) || resolveLocale(spec2.name, "en") || ""
      const value = resolveLocale(spec2.value, locale) || resolveLocale(spec2.value, "en") || ""
      row.push({
        name: name,
        value: value
      })
    }
    
    if (row.length > 0) specRows.push(row)
  }

  const dir = isRtl ? "rtl" : "ltr"
  const textAlign = isRtl ? "right" : "left"
  const flexDirection = isRtl ? "row-reverse" : "row"
  const fontFamily = isRtl 
    ? "'Noto Sans Arabic', 'Inter', system-ui, sans-serif" 
    : "'Inter', system-ui, sans-serif"

  // Build embedded font CSS for serverless environment
  // Fallback to Google Fonts CDN if fonts not embedded
  const embeddedFontsCSS = interFontBase64 && arabicFontBase64
    ? `
    @font-face {
      font-family: 'Inter';
      src: url(data:font/truetype;charset=utf-8;base64,${interFontBase64}) format('truetype');
      font-weight: 400 900;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Noto Sans Arabic';
      src: url(data:font/truetype;charset=utf-8;base64,${arabicFontBase64}) format('truetype');
      font-weight: 400 900;
      font-style: normal;
      font-display: swap;
    }
  `
    : ""

  const googleFontsLink = !interFontBase64 || !arabicFontBase64
    ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@400;600;700;800;900&display=swap" rel="stylesheet">`
    : ""

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productTitle}</title>${googleFontsLink}
  <style>
    ${embeddedFontsCSS}
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${fontFamily};
      font-size: 10px;
      line-height: 1.5;
      color: #0f172a;
      background-color: white;
      background-image: ${backgroundImageBase64 ? `url('${backgroundImageBase64}')` : 'none'};
      background-size: 100%100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 210mm;
      min-height: 297mm;
      padding: 20px 32px 14px 32px;
      direction: ${dir};
    }
    
    /* Colors */
    .text-navy { color: #0f172a; }
    .text-navy-light { color: #1e293b; }
    .text-slate { color: #475569; }
    .text-slate-light { color: #64748b; }
    .text-slate-ultra { color: #94a3b8; }
    .text-cyan { color: #06b6d4; }
    .text-cyan-dark { color: #0891b2; }
    .text-blue { color: #3b82f6; }
    .text-emerald { color: #10b981; }
    
    .bg-alt { background-color: #f8fafc; }
    .border-light { border-color: #f1f5f9; }
    .border-default { border-color: #e2e8f0; }
    
    /* Layout utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }
    
    /* Catalog Features Grid */
    .catalog-section {
      margin-top: 14px;
      margin-bottom: 14px;
      padding: 14px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    
    .catalog-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .catalog-image-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f8fafc;
      margin-bottom: 8px;
    }
    
    .catalog-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .catalog-title {
      font-size: 8px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
      text-align: center;
    }
    
    .catalog-desc {
      font-size: 6px;
      color: #64748b;
      line-height: 1.3;
      text-align: center;
    }
    
    /* Header */
    .header {
      display: flex;
      flex-direction: ${flexDirection};
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 16px;
      border-bottom: 2px solid #1e293b;
    }
    
    .header-right {
      display: flex;
      flex-direction: ${flexDirection};
      align-items: center;
      gap: 16px;
    }
    
    .header-text {
      text-align: ${textAlign};
    }
    
    .header-title {
      font-size: 10px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      line-height: 1.4;
    }
    
    .header-date {
      font-size: 7px;
      color: #94a3b8;
      margin-top: 2px;
    }
    
    .logo {
      height: 42px;
      width: auto;
    }
    
    .qr-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .qr-img {
      width: 42px;
      height: 42px;
    }
    
    .qr-label {
      font-size: 5px;
      color: #94a3b8;
      margin-top: 1px;
    }
    
    /* Hero Section */
    .hero {
      display: flex;
      flex-direction: row;
      gap: 24px;
      margin-bottom: 18px;
    }
    
    .img-container {
      width: 30%;
      flex-shrink: 0;
    }
    
    .img-box {
      aspect-ratio: 1;
      border-radius: 10px;
      border: 1.5px solid #f1f5f9;
      background-color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      overflow: hidden;
    }
    
    .img-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .brand-sku {
      font-size: 8px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
      text-align: ${textAlign};
    }
    
    .product-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 8px;
      text-align: ${textAlign};
    }
    
    .product-desc {
      font-size: 8.5px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 12px;
      text-align: ${textAlign};
    }
    
    /* Badges */
    .badges-row {
      display: flex;
      flex-direction: row;
      gap: 6px;
      justify-content: flex-start;
      width: 100%;
    }
    
    .badge {
      padding: 4px 10px;
      border-radius: 5px;
      border: 1.5px solid;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Section Headers */
    .section-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      margin-top: 2px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: center;
    }
    
    /* Specs Table */
    .specs-table {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    
    .spec-row {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .spec-row:nth-child(odd) {
      background-color: #f8fafc;
    }
    
    .spec-row:nth-child(even) {
      background-color: #ffffff;
    }
    
    .spec-row:last-child {
      border-bottom: none;
    }
    
    .spec-cell {
      display: flex;
      flex-direction: row;
      flex: 1;
      padding: 6px 10px;
      align-items: center;
      min-height: 22px;
    }
    
    .spec-cell:first-child {
      border-right: ${isRtl ? "none" : "1px solid #e2e8f0"};
      border-left: ${isRtl ? "1px solid #e2e8f0" : "none"};
    }
    
    .spec-label {
      font-size: 6.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      width: 45%;
      text-align: ${textAlign};
      flex-shrink: 0;
      border-right: ${isRtl ? "none" : "1px solid #e2e8f0"};
      border-left: ${isRtl ? "1px solid #e2e8f0" : "none"};
      padding-right: ${isRtl ? "0" : "8px"};
      padding-left: ${isRtl ? "8px" : "0"};
      margin-right: ${isRtl ? "0" : "8px"};
      margin-left: ${isRtl ? "8px" : "0"};
    }
    
    .spec-value {
      font-size: 7px;
      font-weight: 500;
      color: #0f172a;
      width: 45%;
      text-align: ${textAlign};
    }
    
    /* Warranty Section */
    .warranty-section {
      margin-bottom: 14px;
      padding: 10px 14px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 8px;
      border: 1px solid #bbf7d0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .warranty-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .warranty-icon svg {
      width: 18px;
      height: 18px;
      stroke: white;
    }
    
    .warranty-content {
      flex: 1;
    }
    
    .warranty-title {
      font-size: 8px;
      font-weight: 700;
      color: #166534;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .warranty-text {
      font-size: 7px;
      color: #15803d;
      line-height: 1.4;
    }
    
    /* Features Grid */
    .features-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .feature-card {
      width: calc(50% - 5px);
      display: flex;
      flex-direction: ${flexDirection};
      gap: 10px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background-color: white;
      align-items: flex-start;
    }
    
    .feature-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .feature-icon svg {
      width: 16px;
      height: 16px;
    }
    
    .feature-content {
      flex: 1;
    }
    
    .feature-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
      text-align: ${textAlign};
    }
    
    .feature-desc {
      font-size: 6.5px;
      color: #64748b;
      line-height: 1.5;
      text-align: ${textAlign};
    }
    
    /* Footer */
    .footer {
      margin-top: auto;
      border-top: 2px solid #1e293b;
      padding-top: 14px;
    }
    
    .footer-grid {
      display: flex;
      flex-direction: ${flexDirection};
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 14px;
    }
    
    .footer-col {
      flex: 1;
    }
    
    .footer-col {
      flex: 1;
      padding: 0 16px;
    }
    
    .footer-col:not(:last-child) {
      border-right: 1px solid #e2e8f0;
    }
    
    .footer-col-contact { flex: 0 0 35%; }
    .footer-col-location { flex: 0 0 35%; }
    .footer-col-social { flex: 0 0 25%; }
    
    .footer-label {
      font-size: 8.5px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      text-align: ${textAlign};
    }
    
    /* Footer items */
    .footer-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 5px;
    }
    
    .footer-item > svg, .footer-item > .icon-wrapper {
      flex-shrink: 0;
    }
    
    .footer-text {
      font-size: 7px;
      color: #64748b;
      text-align: ${textAlign};
      line-height: 1.4;
    }
    
    .social-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      padding: 4.5px 10px;
      border-radius: 6px;
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
    }
    
    .social-text {
      font-size: 7.5px;
      color: #64748b;
      font-weight: 600;
    }
    
    .copyright-bar {
      display: flex;
      flex-direction: ${flexDirection};
      justify-content: space-between;
      padding-top: 0;
    }
    
    .copyright-text {
      font-size: 5.5px;
      color: #94a3b8;
    }
    
    /* Icon SVGs */
    .icon {
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    /* Print optimizations */
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
    
    /* Ensure content fits on one page */
    .page-container {
      display: flex;
      flex-direction: column;
      min-height: calc(297mm - 34px);
    }
    
    .content-area {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      ${logoBase64 
        ? `<img src="${logoBase64}" alt="Logo" class="logo">` 
        : `<div style="font-size: 16px; font-weight: 800; color: #0f172a;">Middle Ocean</div>`
      }
      <div class="header-right">
        <div class="header-text">
          <div class="header-title">${isRtl ? "ورقة المواصفات" : "SPECIFICATION SHEET"}</div>
          <div class="header-date">${dateStr}</div>
        </div>
        <div class="qr-box">
          <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-img">
          <div class="qr-label">${isRtl ? "امسح للمزيد" : "Scan for more"}</div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <div class="content-area">
      <!-- Hero Section -->
      <section class="hero">
        <div class="img-container">
          <div class="img-box">
            ${product.media?.thumbnailUrl 
              ? `<img src="${product.media.thumbnailUrl}" alt="${productTitle}">`
              : `<div style="font-size: 9px; color: #64748b; text-align: center;">No Image</div>`
            }
          </div>
        </div>
        <div class="product-info">
          <div class="brand-sku">${brandName} • ${partNumber}</div>
          <h1 class="product-title">${productTitle}</h1>
          <p class="product-desc">${productDesc}</p>
          <div class="badges-row">
            ${certBadges.map(badge => `
              <div class="badge" style="border-color: ${badge.color}; color: ${badge.color};">${badge.label}</div>
            `).join('')}
          </div>
        </div>
      </section>
      
      ${showCatalogSection ? `
      <!-- Key Features -->
      <section class="catalog-section">
        <div class="catalog-grid">
          ${catalogImages.map(img => `
            <div class="catalog-item">
              <div class="catalog-image-circle">
                <img src="${img.imageUrl}" alt="${img.title}" class="catalog-image">
              </div>
              <div class="catalog-title">${img.title}</div>
              <div class="catalog-desc">${img.description}</div>
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}
      
      ${specRows.length > 0 ? `
      <!-- Technical Specifications -->
      <section style="margin-bottom: 16px;">
        <div class="section-header">
          <div class="section-title">${isRtl ? "المواصفات الفنية" : "TECHNICAL SPECIFICATIONS"}</div>
        </div>
        <div class="specs-table">
          ${specRows.map((row, idx) => `
            <div class="spec-row">
              <div class="spec-cell">
                <div class="spec-label">${row[0]?.name || ""}</div>
                <div class="spec-value">${row[0]?.value || ""}</div>
              </div>
              ${row[1] ? `
              <div class="spec-cell">
                <div class="spec-label">${row[1].name}</div>
                <div class="spec-value">${row[1].value}</div>
              </div>
              ` : "<div class=\"spec-cell\"></div>"}
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}
      
      ${product.warrantyMonths ? `
      <!-- Warranty -->
      <section class="warranty-section">
        <div class="warranty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div class="warranty-content">
          <div class="warranty-title">${isRtl ? "الضمان" : "WARRANTY"}</div>
          <div class="warranty-text">${isRtl 
            ? `يتم تغطية هذا المنتج بضمان لمدة ${product.warrantyMonths} شهر من تاريخ الشراء.`
            : `This product is covered by a ${product.warrantyMonths}-month warranty from the date of purchase.`
          }</div>
        </div>
      </section>
      ` : ""}
    </div>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-grid">
        <!-- Contact Us -->
        <div class="footer-col footer-col-contact">
          <div class="footer-label">${isRtl ? "اتصل بنا" : "CONTACT US"}</div>
          ${isRtl ? `
          <div class="footer-item">
            ${getIconSvg('phone', '#0891b2')}
            <div class="footer-text"><span dir="ltr">${siteSettings?.phone || "+962 7 8100 0988"}</span></div>
          </div>
          <div class="footer-item">
            ${getIconSvg('mail', '#0891b2')}
            <div class="footer-text">${siteSettings?.email || "info@middleocean.jo"}</div>
          </div>
          <div class="footer-item">
            ${getIconSvg('globe', '#0891b2')}
            <div class="footer-text">www.middleocean.jo</div>
          </div>
          ` : `
          <div class="footer-item">
            ${getIconSvg('phone', '#0891b2')}
            <div class="footer-text"><span dir="ltr">${siteSettings?.phone || "+962 7 8100 0988"}</span></div>
          </div>
          <div class="footer-item">
            ${getIconSvg('mail', '#0891b2')}
            <div class="footer-text">${siteSettings?.email || "info@middleocean.jo"}</div>
          </div>
          <div class="footer-item">
            ${getIconSvg('globe', '#0891b2')}
            <div class="footer-text">www.middleocean.jo</div>
          </div>
          `}
        </div>
        
        <!-- Location -->
        <div class="footer-col footer-col-location">
          <div class="footer-label">${isRtl ? "الموقع" : "LOCATION"}</div>
          <div class="footer-item">
            ${getIconSvg('mapPin', '#0891b2')}
            <div class="footer-text">
              ${isRtl 
                ? (siteSettings?.address?.ar || "شارع عصام العجلوني، مجمع شركو، الطابق الأول، عمان - الأردن")
                : (siteSettings?.address?.en || "60 Issam Ajlouni Str, Sherko Complex, Floor 1, Amman - Jordan")
              }
            </div>
          </div>
        </div>
        
        <!-- Social -->
        <div class="footer-col footer-col-social">
          <div class="footer-label">${isRtl ? "تابعنا" : "FOLLOW US"}</div>
          ${isRtl ? `
          <div class="social-card">
            ${getIconSvg('facebook', '#1877F2')}
            <div class="social-text">middleocean</div>
          </div>
          <div class="social-card">
            ${getIconSvg('instagram', '#E4405F')}
            <div class="social-text">middleocean</div>
          </div>
          <div class="social-card">
            ${getIconSvg('linkedin', '#0A66C2')}
            <div class="social-text">middleocean</div>
          </div>
          ` : `
          <div class="social-card">
            ${getIconSvg('facebook', '#1877F2')}
            <div class="social-text">middleocean</div>
          </div>
          <div class="social-card">
            ${getIconSvg('instagram', '#E4405F')}
            <div class="social-text">middleocean</div>
          </div>
          <div class="social-card">
            ${getIconSvg('linkedin', '#0A66C2')}
            <div class="social-text">middleocean</div>
</div>
          `}
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="copyright-bar">
        <div class="copyright-text">
          ${isRtl ? "© ٢٠٢٦ ميدل أوشن للطباعة. جميع الحقوق محفوظة" : `© ${new Date().getFullYear()} Middle Ocean Printing. All Rights Reserved`}
        </div>
        <div class="copyright-text">
          ${isRtl ? "المواصفات قابلة للتغيير" : "Specifications subject to change"}
        </div>
      </div>
    </footer>
  </div>
</body>
</html>`
}

function getIconSvg(name: string, color?: string): string {
  const icons: Record<string, string> = {
    zap: `<svg viewBox="0 0 24 24" width="16" height="16" class="icon" style="stroke: #3b82f6;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" width="16" height="16" class="icon" style="stroke: #3b82f6;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    target: `<svg viewBox="0 0 24 24" width="16" height="16" class="icon" style="stroke: #06b6d4;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
    cpu: `<svg viewBox="0 0 24 24" width="16" height="16" class="icon" style="stroke: #0891b2;"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" width="10" height="10" class="icon" style="stroke: ${color || '#0891b2'};"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" width="10" height="10" class="icon" style="stroke: ${color || '#0891b2'};"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="10" height="10" class="icon" style="stroke: ${color || '#0891b2'};"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" width="10" height="10" class="icon" style="stroke: ${color || '#0891b2'};"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" width="12" height="12" class="icon" style="stroke: ${color || '#1877F2'};"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="12" height="12" class="icon" style="stroke: ${color || '#E4405F'};"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><path d="M17.5 6.5h.01"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="12" height="12" class="icon" style="stroke: ${color || '#0A66C2'};"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  }
  return icons[name] || ''
}

// Export helper for route.ts
export { resolveLocale }
