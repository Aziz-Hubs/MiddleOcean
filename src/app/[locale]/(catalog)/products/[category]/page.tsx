import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { CategoryHero } from "@/components/category-hero"
import { sanityClient } from "@/sanity/client"
import { categoryBySlugQuery, categoryQuery, siteSettingsQuery } from "@/sanity/queries"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { Link } from "@/i18n/routing"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { SanityCategory } from "@/sanity/types"
import ContactUs1 from "@/components/contact-us-1"
import { StickyBreadcrumbContainer } from "@/components/sticky-breadcrumb-container"
import { Suspense } from "react"
import CategoryProductGridWrapper from "@/components/category-product-grid-wrapper"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { CategoriesMarquee } from "@/components/categories-marquee"

import type { Metadata } from "next"

import { getAlternateLanguages } from "@/lib/seo"

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await props.params
  const isArabic = locale === "ar"
  const categoryData = await sanityClient.fetch(`*[_type == "category" && slug.current == $category][0]{ 
    title, 
    description, 
    seo { metaTitle, metaDescription, "ogImageUrl": ogImage.asset->url },
    "thumbnailUrl": image.asset->url
  }`, { category })

  if (!categoryData) return {}

  const rawTitle = categoryData.seo?.metaTitle || categoryData.title
  const title = typeof rawTitle === 'object' ? rawTitle[locale as keyof typeof rawTitle] || rawTitle['en'] : rawTitle || ""
  
  const rawDesc = categoryData.seo?.metaDescription || categoryData.description
  const description = typeof rawDesc === 'object' ? rawDesc[locale as keyof typeof rawDesc] || rawDesc['en'] : rawDesc || ""
  const safeDesc = typeof description === 'string' ? description.substring(0, 160) : (isArabic ? "تصفح مجموعتنا من مواد الطباعة الرقمية وحلول الإعلان." : "Browse our collection of digital printing materials and advertising solutions.")
  
  const imageUrl = categoryData.seo?.ogImageUrl || categoryData.thumbnailUrl

  return {
    title,
    description: safeDesc,
    openGraph: {
      title,
      description: safeDesc,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDesc,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products/${category}`,
      languages: getAlternateLanguages(`/products/${category}`),
    }
  }
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, category } = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("Navigation")
  const isRtl = locale === "ar"

  const page = Number(searchParams.page) || 1
  const limit = 12

  // Fetch data from Sanity
  const [categoryData, allCategories, siteSettings]: [SanityCategory, SanityCategory[], any] = await Promise.all([
    sanityClient.fetch(categoryBySlugQuery, { slug: category }),
    sanityClient.fetch(categoryQuery),
    sanityClient.fetch(siteSettingsQuery)
  ])

  if (!categoryData) {
    notFound()
  }

  const categoryTitleRaw = categoryData.title
  const categoryTitle = typeof categoryTitleRaw === 'object' 
    ? categoryTitleRaw[locale as keyof typeof categoryTitleRaw] 
    : categoryTitleRaw

  const jsonLd = {
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
    ],
  }

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StickyBreadcrumbContainer>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>
                {t("home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronIcon className="size-4 opacity-40" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/products" />}>
                {t("products_title")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronIcon className="size-4 opacity-40" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/products/${category}`} />} className="font-semibold text-foreground">
                {typeof categoryData.title === 'object' 
                  ? categoryData.title[locale as keyof typeof categoryData.title] 
                  : categoryData.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </StickyBreadcrumbContainer>

      {/* Hero Section */}
      <CategoryHero 
        name={categoryData.title} 
        description={categoryData.description} 
        image={categoryData.image} 
        className="relative z-10"
      />
      <CategoriesMarquee categories={allCategories} />

      {/* Products Grid with Suspense */}
      <div className="container mx-auto px-6 py-24 pb-12">
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <CategoryProductGridWrapper 
            slug={category}
            page={page}
            limit={limit}
            locale={locale}
            categoryTitle={typeof categoryData.title === 'object' ? categoryData.title[locale as keyof typeof categoryData.title] : categoryData.title}
          />
        </Suspense>
      </div>

      {/* Contact Section */}
      <ContactUs1 settings={siteSettings} />
    </div>
  )
}
