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
    
    // Simple corporate email template
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب عرض سعر جديد</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
  <div style="background: white; padding: 30px; border: 1px solid #ddd;">
    
    <!-- Header -->
    <div style="text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px;">
      <img src="${logoUrl}" alt="Middle Ocean" style="max-width: 120px; margin-bottom: 10px;">
      <h1 style="color: #1e3a8a; font-size: 24px; margin: 10px 0; text-align: center;">ميدل أوشن</h1>
      <p style="color: #666; margin: 0; text-align: center;">حلول الطباعة والإعلان المتكاملة لأعمالك</p>
    </div>
    
    <!-- Title -->
    <h2 style="color: #1e3a8a; border-bottom: 1px solid #ddd; padding-bottom: 10px;">طلب عرض سعر جديد</h2>
    <p style="color: #666;"><strong>تاريخ الاستلام:</strong> ${dateStr}</p>
    
    <!-- Customer Info -->
    <h3 style="color: #1e3a8a; margin-top: 30px;">معلومات العميل</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-weight: bold; width: 40%;">الاسم الكامل</td>
        <td style="padding: 10px;">${sanitizedFullName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-weight: bold;">رقم الهاتف</td>
        <td style="padding: 10px; direction: ltr; text-align: right;">${sanitizedPhone}</td>
      </tr>
      ${sanitizedEmail ? `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-weight: bold;">البريد الإلكتروني</td>
        <td style="padding: 10px; direction: ltr; text-align: right;">${sanitizedEmail}</td>
      </tr>
      ` : ""}
      <tr>
        <td style="padding: 10px; font-weight: bold;">عنوان IP</td>
        <td style="padding: 10px; direction: ltr; text-align: right; font-family: monospace; font-size: 12px; color: #999;">${ip}</td>
      </tr>
    </table>
    
    <!-- Product Info -->
    <h3 style="color: #1e3a8a; margin-top: 30px;">تفاصيل المنتج</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: #f9f9f9; border: 1px solid #ddd;">
      <tr style="background: #1e3a8a; color: white;">
        <td style="padding: 12px; font-weight: bold;">اسم المنتج</td>
        <td style="padding: 12px;">${sanitizedProductName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">الكمية المطلوبة</td>
        <td style="padding: 10px; font-size: 18px; color: #1e3a8a; font-weight: bold;">${quantity} وحدة</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">الفئة</td>
        <td style="padding: 10px;">${sanitizedCategory}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">معرف المنتج</td>
        <td style="padding: 10px; font-family: monospace; font-size: 12px;">${productId || "غير متوفر"}</td>
      </tr>
    </table>
    
    <p style="margin: 20px 0;">
      <a href="${productUrl}" style="color: #1e3a8a; text-decoration: underline;">عرض صفحة المنتج على الموقع</a>
    </p>
    
    <!-- Action Required -->
    <div style="background: #fff8e1; border-right: 4px solid #ffc107; padding: 15px; margin: 30px 0;">
      <strong style="color: #f57c00;">إجراء مطلوب:</strong><br>
      يرجى إعداد عرض سعر مخصص وإرساله للعميل عبر الهاتف أو البريد الإلكتروني في أقرب وقت ممكن.
    </div>
    
    <!-- Footer -->
    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
      <p>تم إرسال هذا الطلب تلقائياً من خلال موقع <a href="${siteUrl}" style="color: #1e3a8a;">ميدل أوشن</a></p>
      <p>© ${new Date().getFullYear()} Middle Ocean. جميع الحقوق محفوظة.</p>
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
