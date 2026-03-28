import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const RATE_LIMIT_MAX = 5 // Max 5 requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }
  
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

function sanitizeInput(input: string): string {
  // Remove potentially dangerous HTML/script tags
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
}

function validateFormData(data: {
  fullName: string
  phone: string
  email?: string
  quantity: number
  productNameAr: string
  productSlug: string
  categoryAr: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validate full name
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name is required and must be at least 2 characters")
  }
  if (data.fullName && data.fullName.trim().length > 100) {
    errors.push("Full name must not exceed 100 characters")
  }
  
  // Validate phone
  if (!data.phone || data.phone.trim().length < 8) {
    errors.push("Phone number is required and must be at least 8 characters")
  }
  const phoneRegex = /^[+]?[\d\s\-\(\)]{8,20}$/
  if (data.phone && !phoneRegex.test(data.phone.trim())) {
    errors.push("Invalid phone number format")
  }
  
  // Validate email (optional)
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.push("Invalid email format")
    }
    if (data.email.trim().length > 254) {
      errors.push("Email must not exceed 254 characters")
    }
  }
  
  // Validate quantity
  if (!data.quantity || isNaN(data.quantity) || data.quantity < 1) {
    errors.push("Quantity must be at least 1")
  }
  if (data.quantity > 999999) {
    errors.push("Quantity must not exceed 999,999")
  }
  
  // Validate product info
  if (!data.productNameAr || !data.productSlug) {
    errors.push("Product information is required")
  }
  
  return { valid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }
    
    const {
      fullName,
      phone,
      email,
      quantity,
      productId,
      productNameAr,
      productSlug,
      categoryAr,
    } = body
    
    // Validate all required fields
    const validation = validateFormData({
      fullName,
      phone,
      email,
      quantity,
      productNameAr,
      productSlug,
      categoryAr,
    })
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      )
    }
    
    // Sanitize inputs
    const sanitizedFullName = sanitizeInput(fullName)
    const sanitizedPhone = sanitizeInput(phone)
    const sanitizedEmail = email ? sanitizeInput(email) : undefined
    const sanitizedProductName = sanitizeInput(productNameAr)
    const sanitizedCategory = sanitizeInput(categoryAr)
    
    // Build email content - Always in Arabic
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.jo"
    const logoUrl = `${siteUrl}/brand/logo.svg`
    const productUrl = `${siteUrl}/ar/products/${sanitizedCategory}/${productSlug}`
    
    // Format date in Arabic
    const dateStr = new Date().toLocaleString("ar-JO", {
      timeZone: "Asia/Amman",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    
    // Professional Arabic email template with proper RTL and no emojis
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>طلب عرض سعر جديد - ${sanitizedProductName}</title>
  <style>
    /* Reset styles for email clients */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Base styles */
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
      direction: rtl;
      text-align: right;
    }
    
    /* Container */
    .email-wrapper { 
      width: 100%; 
      max-width: 680px; 
      margin: 0 auto; 
      background-color: #f4f4f4; 
    }
    
    .email-container { 
      width: 100%; 
      max-width: 640px; 
      margin: 20px auto; 
      background-color: #ffffff; 
      border-radius: 16px; 
      overflow: hidden; 
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      direction: rtl;
    }
    
    /* Header */
    .email-header { 
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
      padding: 40px 30px; 
      text-align: center; 
    }
    
    .logo-container { 
      margin-bottom: 20px; 
      text-align: center;
    }
    
    .logo-img { 
      width: 160px; 
      height: auto; 
      display: block; 
      margin: 0 auto; 
    }
    
    .company-name { 
      font-size: 32px; 
      font-weight: 800; 
      margin: 0 0 8px 0; 
      letter-spacing: 0;
      text-align: center;
    }
    
    .company-name .middle {
      color: #ffffff;
      font-weight: 800;
    }
    
    .company-name .ocean {
      background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
    }
    
    .company-tagline { 
      color: rgba(255,255,255,0.9); 
      font-size: 14px; 
      font-weight: 500; 
      margin: 0; 
      line-height: 1.5;
      text-align: center;
    }
    
    /* Title Section */
    .title-section { 
      background-color: #f8fafc; 
      padding: 30px; 
      text-align: center; 
      border-bottom: 3px solid #3b82f6;
      direction: rtl;
    }
    
    .main-title { 
      color: #1e3a8a; 
      font-size: 24px; 
      font-weight: 800; 
      margin: 0 0 8px 0;
      text-align: center;
    }
    
    .date-text { 
      color: #64748b; 
      font-size: 14px; 
      margin: 0;
      text-align: center;
    }
    
    /* Content */
    .email-content { 
      padding: 40px 30px; 
      direction: rtl;
      text-align: right;
    }
    
    .section { 
      margin-bottom: 32px; 
      text-align: right;
    }
    
    .section:last-child { 
      margin-bottom: 0; 
    }
    
    .section-header { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      margin-bottom: 16px; 
      padding-bottom: 12px; 
      border-bottom: 2px solid #e2e8f0;
      text-align: right;
      direction: rtl;
    }
    
    .section-icon { 
      width: 32px; 
      height: 32px; 
      background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); 
      border-radius: 8px; 
      display: inline-flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .section-title { 
      color: #1e3a8a; 
      font-size: 18px; 
      font-weight: 700; 
      margin: 0;
      text-align: right;
    }
    
    /* Info Cards */
    .info-card { 
      background-color: #f8fafc; 
      border-radius: 12px; 
      padding: 20px; 
      margin-bottom: 12px;
      direction: rtl;
      text-align: right;
    }
    
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 14px 0; 
      border-bottom: 1px solid #e2e8f0;
      direction: rtl;
      text-align: right;
    }
    
    .info-row:last-child { 
      border-bottom: none; 
      padding-bottom: 0;
    }
    
    .info-row:first-child { 
      padding-top: 0;
    }
    
    .info-label { 
      color: #64748b; 
      font-size: 14px; 
      font-weight: 600;
      text-align: right;
      flex: 1;
    }
    
    .info-value { 
      color: #1e293b; 
      font-size: 15px; 
      font-weight: 700; 
      text-align: left;
      flex: 1;
      direction: ltr;
    }
    
    /* Product Box */
    .product-box { 
      background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); 
      border: 2px solid #3b82f6; 
      border-radius: 16px; 
      padding: 28px; 
      margin: 24px 0;
      direction: rtl;
      text-align: right;
    }
    
    .product-header { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      margin-bottom: 20px;
      direction: rtl;
    }
    
    .product-icon { 
      width: 40px; 
      height: 40px; 
      background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); 
      border-radius: 10px; 
      display: inline-flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-size: 20px;
      flex-shrink: 0;
    }
    
    .product-label { 
      color: #64748b; 
      font-size: 13px; 
      font-weight: 600; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      text-align: right;
    }
    
    .product-name { 
      color: #1e3a8a; 
      font-size: 22px; 
      font-weight: 800; 
      margin: 4px 0 0 0; 
      line-height: 1.3;
      text-align: right;
    }
    
    .product-link { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      color: #3b82f6; 
      text-decoration: none; 
      font-size: 14px; 
      font-weight: 600; 
      margin-top: 12px; 
      padding: 8px 16px; 
      background: rgba(59, 130, 246, 0.1); 
      border-radius: 8px; 
      transition: all 0.2s;
      direction: rtl;
    }
    
    .quantity-section { 
      margin-top: 20px; 
      padding-top: 20px; 
      border-top: 1px dashed #93c5fd;
      direction: rtl;
      text-align: right;
    }
    
    .quantity-label { 
      color: #64748b; 
      font-size: 14px; 
      margin-bottom: 8px;
      text-align: right;
    }
    
    .quantity-badge { 
      display: inline-block; 
      background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); 
      color: white; 
      padding: 12px 28px; 
      border-radius: 50px; 
      font-weight: 800; 
      font-size: 24px; 
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    /* Urgency Banner */
    .urgency-banner { 
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
      border-right: 4px solid #f59e0b; 
      border-radius: 12px; 
      padding: 20px; 
      margin: 24px 0;
      direction: rtl;
      text-align: right;
    }
    
    .urgency-title { 
      color: #92400e; 
      font-size: 16px; 
      font-weight: 700; 
      margin: 0 0 8px 0;
      text-align: right;
    }
    
    .urgency-text { 
      color: #78350f; 
      font-size: 14px; 
      margin: 0; 
      line-height: 1.6;
      text-align: right;
    }
    
    /* Footer */
    .email-footer { 
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); 
      padding: 30px; 
      text-align: center; 
    }
    
    .footer-logo { 
      width: 100px; 
      height: auto; 
      margin-bottom: 16px; 
      opacity: 0.9;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    .footer-text { 
      color: rgba(255,255,255,0.8); 
      font-size: 13px; 
      margin: 0 0 8px 0;
      text-align: center;
    }
    
    .footer-link { 
      color: #ffffff; 
      text-decoration: none; 
      font-weight: 600;
    }
    
    .footer-tagline { 
      color: rgba(255,255,255,0.6); 
      font-size: 12px; 
      margin: 12px 0 0 0; 
      font-style: italic;
      text-align: center;
    }
    
    /* Icon placeholders without emojis */
    .icon-customer::before { content: "C"; }
    .icon-product::before { content: "P"; }
    .icon-tech::before { content: "T"; }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-container { 
        margin: 10px; 
        border-radius: 12px; 
      }
      .email-header { 
        padding: 30px 20px; 
      }
      .company-name { 
        font-size: 28px; 
      }
      .email-content { 
        padding: 24px 20px; 
      }
      .product-box { 
        padding: 20px; 
      }
      .info-row { 
        flex-direction: column; 
        align-items: flex-start; 
        gap: 4px;
      }
      .info-value { 
        text-align: right; 
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header with Logo -->
      <div class="email-header">
        <div class="logo-container">
          <img src="${logoUrl}" alt="Middle Ocean Logo" class="logo-img" width="160" style="display: block; margin: 0 auto;">
        </div>
        <h1 class="company-name">
          <span class="middle">ميدل</span>
          <span class="ocean">أوشن</span>
        </h1>
        <p class="company-tagline">حلول الطباعة والإعلان المتكاملة لأعمالك</p>
      </div>
      
      <!-- Title Section -->
      <div class="title-section">
        <h2 class="main-title">طلب عرض سعر جديد</h2>
        <p class="date-text">تم الاستلام: ${dateStr}</p>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <!-- Urgency Banner -->
        <div class="urgency-banner">
          <p class="urgency-title">عرض محدود الوقت</p>
          <p class="urgency-text">هذا العميل مهتم بمنتجاتكم وينتظر عرض سعر مخصص. يُنصح بالرد خلال 24 ساعة لضمان أفضل تجربة عميل.</p>
        </div>
        
        <!-- Customer Information -->
        <div class="section">
          <div class="section-header">
            <span class="section-icon">C</span>
            <h3 class="section-title">معلومات العميل</h3>
          </div>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">الاسم الكامل</span>
              <span class="info-value">${sanitizedFullName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">رقم الهاتف</span>
              <span class="info-value">${sanitizedPhone}</span>
            </div>
            ${sanitizedEmail ? `
            <div class="info-row">
              <span class="info-label">البريد الإلكتروني</span>
              <span class="info-value">${sanitizedEmail}</span>
            </div>
            ` : ""}
            <div class="info-row">
              <span class="info-label">عنوان IP</span>
              <span class="info-value" style="font-family: monospace; font-size: 12px; color: #94a3b8;">${ip}</span>
            </div>
          </div>
        </div>
        
        <!-- Product Details -->
        <div class="section">
          <div class="section-header">
            <span class="section-icon">P</span>
            <h3 class="section-title">تفاصيل المنتج المطلوب</h3>
          </div>
          <div class="product-box">
            <div class="product-header">
              <span class="product-icon">P</span>
              <div>
                <p class="product-label">اسم المنتج</p>
                <h4 class="product-name">${sanitizedProductName}</h4>
              </div>
            </div>
            <a href="${productUrl}" class="product-link" target="_blank" rel="noopener noreferrer">
              عرض صفحة المنتج
            </a>
            <div class="quantity-section">
              <p class="quantity-label">الكمية المطلوبة</p>
              <span class="quantity-badge">${quantity} وحدة</span>
            </div>
          </div>
        </div>
        
        <!-- Technical Details -->
        <div class="section">
          <div class="section-header">
            <span class="section-icon">T</span>
            <h3 class="section-title">معلومات تقنية</h3>
          </div>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">معرف المنتج</span>
              <span class="info-value" style="font-family: monospace; font-size: 12px;">${productId || "غير متوفر"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">الفئة</span>
              <span class="info-value">${sanitizedCategory}</span>
            </div>
            <div class="info-row">
              <span class="info-label">لغة الموقع عند الطلب</span>
              <span class="info-value">العربية</span>
            </div>
          </div>
        </div>
        
        <!-- Action Required -->
        <div class="urgency-banner" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-right-color: #3b82f6;">
          <p class="urgency-title" style="color: #1e40af;">إجراء مطلوب</p>
          <p class="urgency-text" style="color: #1e3a8a;">يرجى إعداد عرض سعر مخصص وإرساله للعميل عبر الهاتف أو البريد الإلكتروني في أقرب وقت ممكن.</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <img src="${logoUrl}" alt="Middle Ocean" class="footer-logo" width="100" style="display: block; margin: 0 auto 16px auto;">
        <p class="footer-text">
          تم إرسال هذا الطلب تلقائياً من خلال موقع 
          <a href="${siteUrl}" class="footer-link" target="_blank">ميدل أوشن</a>
        </p>
        <p class="footer-text">© ${new Date().getFullYear()} Middle Ocean. جميع الحقوق محفوظة.</p>
        <p class="footer-tagline">"حلول الطباعة والإعلان المتكاملة لأعمالك"</p>
      </div>
    </div>
  </div>
</body>
</html>
    `
    
    // Send email using Resend - Always in Arabic
    const { error } = await resend.emails.send({
      from: "Middle Ocean Quotes <onboarding@resend.dev>",
      to: ["contactabdulazizhasan@gmail.com"],
      subject: `طلب عرض سعر عاجل: ${sanitizedProductName} (${quantity} وحدة)`,
      html: emailHtml,
      replyTo: sanitizedEmail || undefined,
      text: `
طلب عرض سعر جديد من ميدل أوشن

معلومات العميل:
- الاسم: ${sanitizedFullName}
- الهاتف: ${sanitizedPhone}
${sanitizedEmail ? `- البريد: ${sanitizedEmail}` : ''}

المنتج المطلوب:
- ${sanitizedProductName}
- الكمية: ${quantity} وحدة
- الرابط: ${productUrl}

تم الاستلام: ${dateStr}
      `.trim(),
    })
    
    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully" },
      { status: 200 }
    )
    
  } catch {
    console.error("Quote request error")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
