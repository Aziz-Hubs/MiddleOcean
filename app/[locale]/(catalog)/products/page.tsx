import { getTranslations } from "next-intl/server"
import { sanityClient } from "@/sanity/client"
import { allProductsPagedQuery, productsCountQuery, categoryQuery } from "@/sanity/queries"
import { SanityCategory } from "@/sanity/types"
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
import InteractiveProductCard from "@/src/components/ui/interactive-product-card"
import { CategoriesMarquee } from "@/components/categories-marquee"
import { ProductPagination } from "@/src/components/product-pagination"

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
  const start = (page - 1) * limit
  const end = start + limit

  // Fetch paged products, total count, and categories
  const [products, totalCount, categories] = await Promise.all([
    sanityClient.fetch(allProductsPagedQuery, { start, end }),
    sanityClient.fetch(productsCountQuery),
    sanityClient.fetch(categoryQuery)
  ])

  const totalPages = Math.ceil(totalCount / limit)

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
              <BreadcrumbPage className="font-semibold text-foreground">
                {t("products_title")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </StickyBreadcrumbContainer>

      {/* Hero Section */}
      <CategoryHero 
        name={pageName}
        description={pageDescription}
        className="-mt-[57px] relative z-10"
      />
      {page === 1 && <CategoriesMarquee categories={categories} />}

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
            <p className="text-lg text-zinc-400">
              {isRtl ? "لا توجد منتجات حالياً." : "No products found."}
            </p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <ContactUs1 />
    </main>
  )
}
