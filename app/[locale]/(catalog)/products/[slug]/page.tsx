import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { CategoryHero } from "@/components/category-hero"
import { sanityClient } from "@/sanity/client"
import { categoryBySlugQuery, productsByCategoryPagedQuery, productsByCategoryCountQuery } from "@/sanity/queries"
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
import InteractiveProductCard from "@/src/components/ui/interactive-product-card"
import { ProductPagination } from "@/src/components/product-pagination"

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
  const start = (page - 1) * limit
  const end = start + limit

  // Fetch category data from Sanity
  const category: SanityCategory = await sanityClient.fetch(categoryBySlugQuery, { slug })

  if (!category) {
    notFound()
  }

  // Fetch products for this category and total count
  const [products, totalCount] = await Promise.all([
    sanityClient.fetch(productsByCategoryPagedQuery, { slug, start, end }),
    sanityClient.fetch(productsByCategoryCountQuery, { slug })
  ])

  const totalPages = Math.ceil(totalCount / limit)

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
              <BreadcrumbPage className="font-semibold text-foreground">
                {typeof category.title === 'object' 
                  ? category.title[locale as keyof typeof category.title] 
                  : category.title}
              </BreadcrumbPage>
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

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-24 pb-12">

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any) => (
                <InteractiveProductCard key={product._id} product={product} />
              ))}
            </div>

            <ProductPagination 
              totalPages={totalPages}
              currentPage={page}
              locale={locale}
            />
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-zinc-400 font-light">
              {isRtl 
                ? `لا توجد منتجات حالياً في فئة ${category.title.ar}.`
                : `No products found in ${category.title.en} category.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <ContactUs1 />
    </main>
  )
}
