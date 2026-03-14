import { getTranslations } from "next-intl/server"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import AppHero from "@/components/app-hero"
import { ThreeDImageRing } from "@/components/ui/three-d-image-ring"
import { sanityClient } from "@/sanity/client"
import { ProductCategoriesGrid } from "@/components/product-categories-grid"
import FeatureSteps from "@/components/mvpblocks/feature-2"
import { TestimonialsSection } from "@/components/testimonials-section"
export default async function Home(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const t = await getTranslations("Index")
  const partnerNames = ["OceanTeck", "OceanJett", "FLORA", "HP", "Epson", "Midocean"]
  
  // Fetch categories for Bento Grid
  const categories = await sanityClient.fetch(`*[_type == "category"]{
    _id,
    title,
    description,
    icon,
    slug,
    "image": image.asset->url
  }`);

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Hero Marquee Section */}
      {/* Hero Section */}
      <AppHero />
      
      {/* Partners 3D Ring Section - Inward Facing True 3D */}
      <section className="relative h-[300px] w-full mt-16 mb-24 overflow-visible">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="relative z-10 flex h-full flex-col items-center justify-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <h2 className="mb-12 text-3xl md:text-5xl font-extrabold tracking-tighter text-white/40 text-center uppercase">
              {t("trusted-partners" as any) || "Strategic Partners"}
            </h2>
            <div className="h-[200px] w-full max-w-4xl overflow-visible flex items-center justify-center">
              <ThreeDImageRing
                texts={partnerNames}
                width={1200}
                height={400}
                imageDistance={1500}
                perspective={2000}
                initialRotation={180}
                draggable={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Bento Grid Section */}
      <ProductCategoriesGrid locale={locale} categories={categories} />
      {/* Features Steps Section */}
      <FeatureSteps />
      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  )
}
