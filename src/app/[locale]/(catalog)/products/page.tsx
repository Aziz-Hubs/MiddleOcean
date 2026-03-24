import { getTranslations } from "next-intl/server"
import { sanityClient } from "@/sanity/client"
import { categoryQuery, siteSettingsQuery } from "@/sanity/queries"
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
import ContactUs1 from "@/components/contact-us-1"
import { CategoryHero } from "@/components/category-hero"
import { StickyBreadcrumbContainer } from "@/components/sticky-breadcrumb-container"
import { CategoriesMarquee } from "@/components/categories-marquee"
import { Suspense } from "react"
import ProductGridWrapper from "@/components/product-grid-wrapper"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { Metadata } from "next"

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  
  return {
    title: isArabic ? "كتالوج المنتجات | ميدل اوشن للطباعة" : "Product Catalog | Middle Ocean Printing",
    description: isArabic 
      ? "تصفح كتالوجنا الكامل لمواد الطباعة الرقمية، الألواح الإعلانية، الأحبار، والماكينات. حلول متكاملة لجميع احتياجاتك الإعلانية."
      : "Browse our complete catalog of digital printing materials, advertising sheets, inks, and machines. Integrated solutions for all your advertising needs.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/products`,
    }
  };
}

export default async function ProductsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("Navigation")
  const isRtl = locale === "ar"

  const page = Number(searchParams.page) || 1
  const limit = 12

  // Fetch categories and site settings
  const [categories, siteSettings] = await Promise.all([
    sanityClient.fetch(categoryQuery),
    sanityClient.fetch(siteSettingsQuery)
  ])

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  const pageName = {
    en: "Products",
    ar: "المنتجات"
  }

  const pageDescription = {
    en: "Explore our comprehensive range of digital printing and advertising solutions.",
    ar: "اكتشف مجموعتنا الشاملة من حلول الطباعة الرقمية والإعلانات."
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
              <BreadcrumbLink render={<Link href="/products" />} className="font-semibold text-foreground">
                {t("products_title")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </StickyBreadcrumbContainer>

      {/* Hero Section */}
      <CategoryHero 
        name={pageName}
        description={pageDescription}
        className="relative z-10"
      />
      <CategoriesMarquee categories={categories} />

      {/* Products Grid with Suspense */}
      <div className="container mx-auto px-6 py-24 pb-12">
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductGridWrapper 
            page={page}
            limit={limit}
            locale={locale}
          />
        </Suspense>
      </div>

      {/* Contact Section */}
      <ContactUs1 settings={siteSettings} />
    </div>
  )
}
