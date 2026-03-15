import { getTranslations } from "next-intl/server"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import AppHero from "@/components/app-hero"
import { PartnersSection } from "@/components/ui/partners-section"
import { sanityClient } from "@/sanity/client"
import { ProductCategoriesGrid } from "@/components/product-categories-grid"
import FeatureSteps from "@/components/mvpblocks/feature-2"
import { TestimonialsSection } from "@/components/testimonials-section"
import { categoryQuery } from "@/sanity/queries"
import { SanityCategory } from "@/sanity/types"

export default async function Home(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const t = await getTranslations("Index")

  // Fetch categories for Bento Grid
  const categories: SanityCategory[] = await sanityClient.fetch(categoryQuery)

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Hero Marquee Section */}
      {/* Hero Section */}
      <AppHero />

      {/* Partners Section */}
      <PartnersSection />

      {/* Product Categories Bento Grid Section */}
      <ProductCategoriesGrid locale={locale} categories={categories} />
      {/* Features Steps Section */}
      <FeatureSteps />
      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  )
}
