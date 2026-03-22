import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { CategoryHero } from "@/components/category-hero"
import { sanityClient } from "@/sanity/client"
import { categoryBySlugQuery, categoryQuery } from "@/sanity/queries"
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
import CategoryProductGridWrapper from "@/src/components/category-product-grid-wrapper"
import { ProductGridSkeleton } from "@/src/components/product-grid-skeleton"
import { CategoriesMarquee } from "@/components/categories-marquee"

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, slug } = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("Navigation")
  const isRtl = locale === "ar"

  const page = Number(searchParams.page) || 1
  const limit = 12

  // Fetch data from Sanity
  const [category, allCategories]: [SanityCategory, SanityCategory[]] = await Promise.all([
    sanityClient.fetch(categoryBySlugQuery, { slug }),
    sanityClient.fetch(categoryQuery)
  ])

  if (!category) {
    notFound()
  }

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <main className="flex min-h-screen flex-col bg-background pt-16">
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
              <BreadcrumbLink render={<Link href={`/products/${slug}`} />} className="font-semibold text-foreground">
                {typeof category.title === 'object' 
                  ? category.title[locale as keyof typeof category.title] 
                  : category.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </StickyBreadcrumbContainer>

      {/* Hero Section */}
      <CategoryHero 
        name={category.title} 
        description={category.description} 
        image={category.image} 
        className="-mt-[57px] relative z-10"
      />
      <CategoriesMarquee categories={allCategories} />

      {/* Products Grid with Suspense */}
      <div className="container mx-auto px-6 py-24 pb-12">
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <CategoryProductGridWrapper 
            slug={slug}
            page={page}
            limit={limit}
            locale={locale}
            categoryTitle={typeof category.title === 'object' ? category.title[locale as keyof typeof category.title] : category.title}
          />
        </Suspense>
      </div>

      {/* Contact Section */}
      <ContactUs1 />
    </main>
  )
}
