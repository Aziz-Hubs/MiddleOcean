import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { sanityClient } from "@/sanity/client"
import { productBySlugQuery, productReviewsPagedQuery, productReviewsCountQuery, siteSettingsQuery } from "@/sanity/queries"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "@/i18n/routing"
import { ChevronRight, ChevronLeft, ShieldCheck, Cpu, Zap, Target } from "lucide-react"
import { DownloadBrochureButton, RequestQuoteButton, StickyHeader } from "@/components/product-client-components"
import { ProductReviews } from "@/components/product-reviews"
import { ProductImage } from "@/components/product-image"
import ContactUs1 from "@/components/contact-us-1"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Metadata } from "next"

function resolveLocale(field: Record<string, string> | string | undefined, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  return field[locale] || field["en"] || ""
}

import { getAlternateLanguages } from "@/lib/seo"

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string; product: string }>
}): Promise<Metadata> {
  const { locale, category, product: productSlug } = await props.params
  const product = await sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0]{ 
    title, 
    description, 
    seo { metaTitle, metaDescription, "ogImageUrl": ogImage.asset->url },
    "thumbnailUrl": media.thumbnail.asset->url
  }`, { slug: productSlug })

  if (!product) return {}

  const title = resolveLocale(product.seo?.metaTitle, locale) || resolveLocale(product.title, locale) || ""
  const description = resolveLocale(product.seo?.metaDescription, locale) || resolveLocale(product.description, locale) || ""
  const imageUrl = product.seo?.ogImageUrl || product.thumbnailUrl
  
  const siteTitle = (locale === "ar" ? "ميدل اوشن للطباعة" : "Middle Ocean Printing");
  const fullTitle = `${title} | ${siteTitle}`;

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title: fullTitle,
      description: description.substring(0, 160),
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${category}/${productSlug}`,
      siteName: siteTitle,
      images: imageUrl ? [{ url: imageUrl }] : [],
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description.substring(0, 160),
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${category}/${productSlug}`,
      languages: getAlternateLanguages(`/products/${category}/${productSlug}`),
    }
  }
}

export default async function ProductPage(props: {
  params: Promise<{ locale: string; category: string; product: string }>
  searchParams: Promise<{ source?: string }>
}) {
  const { locale, category, product: productSlug } = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("Navigation")
  const tp = await getTranslations("Product")
  const isRtl = locale === "ar"
  const source = searchParams.source || "products"

  const productData = await sanityClient.fetch(productBySlugQuery, { slug: productSlug })

  if (!productData) {
    notFound()
  }

  const [initialReviews, reviewsCount, siteSettings] = await Promise.all([
    sanityClient.fetch(productReviewsPagedQuery, {
      productId: productData._id,
      start: 0,
      end: 2,
    }),
    sanityClient.fetch(productReviewsCountQuery, {
      productId: productData._id,
    }),
    sanityClient.fetch(siteSettingsQuery),
  ])

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  const productTitle = resolveLocale(productData.title, locale)
  const productTitleAr = resolveLocale(productData.title, "ar") || resolveLocale(productData.title, "en")
  const productDesc = resolveLocale(productData.description, locale)
  const categoryTitle = resolveLocale(productData.category?.title, locale) || category.replace(/-/g, ' ')
  const categoryTitleAr = resolveLocale(productData.category?.title, "ar") || category.replace(/-/g, ' ')
  const partNumber = `SKU-${productData._id.substring(0, 8).toUpperCase()}`
  const brandFromSpec = productData.specifications?.find((s: { name: Record<string, string> | string; value: Record<string, string> | string }) => {
    const nameEn = resolveLocale(s.name, "en")?.toLowerCase()
    return nameEn === "brand"
  })
  const displayBrandName = (productData.brand?.title === "Generic" || !productData.brand?.title) && brandFromSpec
    ? (resolveLocale(brandFromSpec.value, locale) || "Middle Ocean Printing")
    : (productData.brand?.title || "Middle Ocean Printing")

  const features = [
    { icon: Zap, label: isRtl ? "كفاءة عالية" : "High Efficiency", description: isRtl ? "يقلل من وقت التوقف وتكاليف الصيانة" : "Reduces downtime and maintenance costs" },
    { icon: ShieldCheck, label: isRtl ? "موثوقية" : "Reliability", description: isRtl ? "مصمم للبيئات الصناعية الصعبة" : "Built for demanding industrial environments" },
    { icon: Target, label: isRtl ? "دقة متناهية" : "Precision", description: isRtl ? "نتائج دقيقة في كل مرة" : "Perfectly calibrated for exact results" },
    { icon: Cpu, label: isRtl ? "تكامل سلس" : "Seamless Integration", description: isRtl ? "يتوافق مع الأنظمة الحالية بسهولة" : "Compatible with your existing workflows" },
  ]

  // Certification badge config — colourful so they pop against the dark surface
  const certBadges = [
    { label: "ISO 9001", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
    { label: "CE Certified", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productTitle,
    description: productDesc,
    image: productData.media?.thumbnailUrl,
    sku: partNumber,
    brand: {
      '@type': 'Brand',
      name: displayBrandName,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0.00',
      priceCurrency: 'USD',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t("home"),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t("products_title"),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryTitle,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productTitle,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${category}/${productSlug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Sticky request-quote header — z-30, appears after 200px scroll */}
      <StickyHeader 
        title={productTitle} 
        locale={locale} 
        productId={productData._id}
        productSlug={productSlug}
        category={category}
        productNameAr={productTitleAr}
        categoryAr={categoryTitleAr}
      />

      {/* Breadcrumb bar — sticky below navbar */}
      <div data-breadcrumb-bar className="sticky top-[57px] z-40 border-b border-border/40 bg-background/95 backdrop-blur-md py-3 print:hidden">
        <div className="container mx-auto px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronIcon className="size-4 opacity-40" />
              </BreadcrumbSeparator>

              {categoryTitle && category !== 'all' ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/products" />}>{t("products_title")}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronIcon className="size-4 opacity-40" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={`/products/${category}`} />}>
                      <span className="capitalize">{categoryTitle}</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/products" />}>{t("products_title")}</BreadcrumbLink>
                </BreadcrumbItem>
              )}

              <BreadcrumbSeparator>
                <ChevronIcon className="size-4 opacity-40" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground line-clamp-1 max-w-[200px] lg:max-w-[400px]">
                  {productTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="relative z-10 bg-background text-foreground min-h-screen print:min-h-0 pt-12 lg:pt-20 print:pt-0 print:bg-white print:text-black">
        <article className="container mx-auto px-6 py-6 lg:py-10 print:py-0 print:px-0">

          {/* Print header */}
          <div className="hidden print:flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
            <div className="flex items-center gap-6">
              <Image src="/brand/logo.svg" alt="Logo" width={140} height={35} className="h-8 w-auto" />
              <div className="hidden md:block print:block ps-6 text-[9px] text-zinc-400 font-medium leading-relaxed">
                <p>{siteSettings?.phone}</p>
                <p>{siteSettings?.email}</p>
                <p>www.middleocean.jo</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xs font-bold text-black uppercase tracking-widest">{tp("specification_sheet")}</h2>
              <p className="text-[10px] text-zinc-400 mt-1">{new Date().toLocaleDateString(locale)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-14 print:pb-6 print:block border-b border-border/40 print:border-none">
            <div className="lg:sticky lg:top-[105px] self-start">
              <ProductImage 
                src={productData.media?.thumbnailUrl} 
                alt={productTitle} 
                priority 
              />
            </div>

            <div className="flex flex-col gap-7">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-white/50 print:text-zinc-500">
                  <span className="uppercase">{displayBrandName} •&nbsp;</span>
                  {partNumber}
                </div>
                <h1 className={cn(
                  "text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground print:text-black leading-[1.1]",
                  locale === "ar" && "font-arabic"
                )}>
                  {productTitle}
                </h1>
              </div>

              {productDesc && (
                <p className={cn(
                  "text-base text-muted-foreground print:text-zinc-600 leading-relaxed font-light",
                  locale === "ar" && "font-arabic"
                )}>
                  {productDesc}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <RequestQuoteButton 
                  locale={locale} 
                  className="h-12 px-8 text-sm" 
                  productId={productData._id}
                  productName={productTitle}
                  productNameAr={productTitleAr}
                  productSlug={productSlug}
                  category={category}
                  categoryAr={categoryTitleAr}
                />
                <DownloadBrochureButton className="h-12 px-8 text-sm" productSlug={productSlug} />
              </div>

              <div className="space-y-3 print:hidden">
                <h2 className={cn(
                  "text-base font-bold uppercase tracking-widest text-muted-foreground print:text-black",
                  isRtl && "font-arabic"
                )}>
                  {tp("specifications")}
                </h2>
                <div className="rounded-xl border border-border/40 bg-background/40 backdrop-blur-md overflow-hidden">
                  {productData.specifications && productData.specifications.length > 0 ? (
                    <div className="divide-y divide-border/20 print:divide-zinc-200">
                      {productData.specifications
                        ?.filter((spec: { name: Record<string, string> | string; value: Record<string, string> | string }) => {
                          const nameEn = resolveLocale(spec.name, "en")?.toLowerCase()
                          return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
                        })
                        .map((spec: { name: Record<string, string> | string; value: Record<string, string> | string }, idx: number) => {
                          const specName = resolveLocale(spec.name, locale) || "Unknown"
                          const specValue = resolveLocale(spec.value, locale) || "N/A"
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "flex flex-col sm:flex-row sm:items-center px-4 py-3",
                                idx % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                              )}
                            >
                              <div className="w-full sm:w-2/5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 print:text-zinc-500 mb-1.5 sm:mb-0 sm:border-e border-border/20 sm:pe-4">
                                {specName}
                              </div>
                              <div className={cn("w-full sm:w-3/5 text-sm text-foreground font-medium print:text-black sm:ps-4", locale === "ar" && "font-arabic")}>
                                {specValue}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {isRtl ? "لم يتم توفير مواصفات فنية لهذا المنتج." : "No technical specifications provided for this product."}
                    </div>
                  )}
              </div>
            </div>

          </div>

          <div className="hidden print:block space-y-10 mt-12 print:break-before-page">
            <div className="space-y-6">
              <h2 className={cn("text-lg font-bold uppercase tracking-widest text-black border-b border-zinc-200 pb-2", isRtl && "font-arabic")}>
                {tp("specifications")}
              </h2>
              <div className="grid grid-cols-1 gap-2 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                {productData.specifications
                  ?.filter((spec: { name: Record<string, string> | string; value: Record<string, string> | string }) => {
                    const nameEn = resolveLocale(spec.name, "en")?.toLowerCase()
                    return nameEn !== "media thumbnail" && nameEn !== "thumbnail"
                  })
                  .map((spec: { name: Record<string, string> | string; value: Record<string, string> | string }, idx: number) => {
                    const specName = resolveLocale(spec.name, locale) || "Unknown"
                    const specValue = resolveLocale(spec.value, locale) || "N/A"
                    return (
                      <div key={idx} className={cn("grid grid-cols-2 px-6 py-3 border-b border-zinc-100 last:border-0", idx % 2 === 0 ? "bg-zinc-50/30" : "bg-white")}>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{specName}</div>
                        <div className={cn("text-xs font-medium text-black", isRtl && "font-arabic")}>{specValue}</div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Print-only Details (Warranty & Gallery) */}
            <div className="hidden print:block space-y-10 mt-12 border-t border-zinc-100 pt-10">
              <div className="grid grid-cols-2 gap-12">
                {productData.warrantyMonths && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{tp("warranty_protection")}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-black">{productData.warrantyMonths}</span>
                      <span className="text-sm font-bold text-zinc-600 uppercase">{isRtl ? "شهر" : "Months"}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[200px]">
                      {isRtl 
                        ? "ضمان مصنع كامل يغطي العيوب المصنعية ويضمن راحة بالك."
                        : "Full manufacturer warranty covering manufacturing defects and ensuring your peace of mind."
                      }
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{tp("certifications")}</h3>
                  <div className="flex flex-wrap gap-4">
                    {certBadges.map((cert) => (
                      <div key={cert.label} className="flex flex-col">
                        <span className="text-xs font-bold text-black uppercase">{cert.label}</span>
                        <span className="text-[9px] text-zinc-400">{tp("quality_verified")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {productData.media?.galleryUrls && productData.media.galleryUrls.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-zinc-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{tp("visuals")}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {productData.media.galleryUrls.slice(0, 3).map((url: string, idx: number) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-zinc-100 shadow-sm relative">
                        <Image 
                          src={url} 
                          alt={`Gallery ${idx}`} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-10 mt-10 border-t border-zinc-100 flex justify-between items-end">
                <div className="text-[9px] text-zinc-400 font-medium">
                  <p>© {new Date().getFullYear()} Middle Ocean Printing. {tp("all_rights_reserved")}</p>
                  <p>{tp("specs_notice")}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-800">Middle Ocean Printing</p>
                  <p className="text-[9px] text-zinc-500">Amman, Jordan • www.middleocean.jo</p>
                </div>
              </div>

              {/* Added boilerplate text for brochure enrichment */}
              <div className="pt-10 mt-10 border-t border-zinc-100 space-y-4">
                <h3 className={cn("text-xs font-bold uppercase tracking-widest text-zinc-500", isRtl && "font-arabic")}>
                  {isRtl ? "لماذا تختار ميدل أوشن؟" : "The Middle Ocean Advantage"}
                </h3>
                <p className={cn("text-[10px] text-zinc-500 leading-relaxed", isRtl && "font-arabic")}>
                  {isRtl 
                    ? "بصفتنا الشريك الأول للطباعة الرقمية والآلات في منطقة الشرق الأوسط، نحن ملتزمون بتقديم أعلى مستويات الجودة والموثوقية. نحن لا نوفر المعدات فحسب، بل نبني بيئة متكاملة تضمن نجاح أعمالكم من خلال الدعم الفني المستمر وسلسلة التوريد الموثوقة."
                    : "As the MENA region's premier partner for digital printing and machinery, we are committed to delivering the highest standards of quality and reliability. We don't just provide equipment; we build a complete ecosystem that ensures your business success through continuous technical support and a reliable supply chain."
                  }
                </p>
                <div className="grid grid-cols-3 gap-6 text-[9px] text-zinc-400 mt-6 pt-6 border-t border-zinc-100/50">
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-50/50 border border-zinc-100">
                    <span className={cn("font-bold text-zinc-800 uppercase tracking-tight", isRtl && "font-arabic")}>
                      {isRtl ? "خـبرة عـالمية" : "Global Expertise"}
                    </span>
                    <span className={cn("leading-relaxed", isRtl && "font-arabic")}>
                      {isRtl 
                        ? "شراكة مع نخبة المصنعين العالميين لنقدم لكم أحدث ما توصلت إليه تكنولوجيا الطباعة."
                        : "Partnering with world-class manufacturers to bring you cutting-edge printing technology."
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-50/50 border border-zinc-100">
                    <span className={cn("font-bold text-zinc-800 uppercase tracking-tight", isRtl && "font-arabic")}>
                      {isRtl ? "دعـم إقـليمي" : "Regional Support"}
                    </span>
                    <span className={cn("leading-relaxed", isRtl && "font-arabic")}>
                      {isRtl 
                        ? "فرق فنية متخصصة في الأردن والمنطقة لضمان استمرارية إنتاجكم دون انقطاع."
                        : "Dedicated technical teams across the region to ensure your production remains uninterrupted."
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-50/50 border border-zinc-100">
                    <span className={cn("font-bold text-zinc-800 uppercase tracking-tight", isRtl && "font-arabic")}>
                      {isRtl ? "مـواد فـاخـرة" : "Premium Materials"}
                    </span>
                    <span className={cn("leading-relaxed", isRtl && "font-arabic")}>
                      {isRtl 
                        ? "وصول حصري لأجود أنواع وسائط الطباعة ومدخلات الإنتاج الأصلية ذات الجودة العالية."
                        : "Exclusive access to the highest-grade printing media and premium original ink supplies."
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="pt-12 print:hidden space-y-12">
            <div className="space-y-3">
              <h2 className={cn(
                "text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground",
                locale === "ar" && "font-arabic"
              )}>
                {isRtl ? "القيمة التجارية" : "Business Value"}
              </h2>
              <p className={cn(
                "text-base text-muted-foreground max-w-3xl leading-relaxed font-light",
                locale === "ar" && "font-arabic"
              )}>
                {isRtl 
                  ? "نحن ملتزمون بتقديم حلول متكاملة تضمن أعلى مستويات الكفاءة والموثوقية، مما يساعد شركاءنا على تحقيق أقصى قيمة لاستثماراتهم في عالم الطباعة والإعلان."
                  : "We are dedicated to providing integrated solutions that ensure the highest levels of efficiency and reliability, helping our partners achieve maximum value for their investments in the printing and advertising world."
                }
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-md p-5 print:border-zinc-200 print:bg-transparent"
                  >
                    <div className="shrink-0 p-2.5 rounded-xl bg-white/10 w-fit print:bg-zinc-100">
                      <feature.icon className="size-5 text-white print:text-zinc-800" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground print:text-black">{feature.label}</h3>
                      <p className="text-xs text-muted-foreground print:text-zinc-500 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 items-start print:hidden">
              <div className="lg:col-span-2">
                <ProductReviews
                  productId={productData._id}
                  locale={locale}
                  initialReviews={initialReviews}
                  totalCount={reviewsCount}
                />
              </div>

              <div className="space-y-6 lg:sticky lg:top-[160px]">
                <h2 className={cn(
                  "text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground",
                  locale === "ar" && "font-arabic"
                )}>
                  {isRtl ? "الضمان والاعتماد" : "Warranty & Certs"}
                </h2>
                <div className="rounded-2xl border border-border/40 bg-background/40 backdrop-blur-md p-6 lg:p-8 print:border-zinc-200 print:bg-transparent min-h-[400px]">
                  <div className="flex flex-col gap-10">
                    <h3 className={cn("text-xs font-bold uppercase tracking-widest text-muted-foreground", locale === "ar" && "font-arabic")}>
                      {isRtl ? "تفاصيل الضمان" : "Warranty Details"}
                    </h3>
                    
                    {productData.warrantyMonths ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="size-8 text-yellow-400 shrink-0" />
                          <span className="text-3xl font-black text-foreground print:text-black">
                            {productData.warrantyMonths} {isRtl ? "شهر" : "Months"}
                          </span>
                        </div>
                        <p className={cn("text-sm text-muted-foreground leading-relaxed", locale === "ar" && "font-arabic")}>
                          {isRtl ? "ضمان مصنع كامل يغطي العيوب المصنعية ويضمن راحة بالك." : "Full manufacturer warranty covering manufacturing defects and ensuring your peace of mind."}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isRtl ? "الضمان حسب سياسة الشركة." : "Warranty according to company policy."}
                      </p>
                    )}

                    <div className="pt-8 border-t border-border/20">
                      <h3 className={cn("text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4", locale === "ar" && "font-arabic")}>
                        {isRtl ? "شهادات الجودة" : "Quality Certificates"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {certBadges.map((cert) => (
                          <span
                            key={cert.label}
                            className={cn(
                              "inline-flex items-center px-4 py-1.5 rounded-full border text-[11px] font-semibold font-mono tracking-wide",
                              cert.color
                            )}
                          >
                            {cert.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="print:hidden">
          <ContactUs1 settings={siteSettings} />
        </div>
      </div>
    </>
  )

}
