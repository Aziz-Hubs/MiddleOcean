import { getTranslations } from "next-intl/server"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import AppHero from "@/components/app-hero"
import { PartnersSection } from "@/components/ui/partners-section"
import { sanityClient } from "@/sanity/client"
import { ProductCategoriesGrid } from "@/components/product-categories-grid"
import FeatureSteps from "@/components/mvpblocks/feature-2"
import { TestimonialsSection } from "@/components/testimonials-section"
import { categoryQuery, siteSettingsQuery } from "@/sanity/queries"
import { SanityCategory } from "@/sanity/types"
import ContactUs1 from "@/components/contact-us-1"
import { Metadata } from "next"

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteTitle = (isArabic ? "ميدل اوشن للطباعة" : "Middle Ocean Printing");
  const description = isArabic 
    ? "ميدل اوشن للطباعة هي الشركة الرائدة في حلول مواد الطباعة الرقمية في الأردن والمنطقة. موزعين معتمدين لـ OceanTeck و OceanJett."
    : "Middle Ocean Printing is the leading provider of digital printing materials solutions in Jordan and the region. Authorized distributors of OceanTeck and OceanJett.";

  return {
    title: isArabic 
      ? "ميدل اوشن للطباعة - حلول متكاملة لمواد الطباعة الرقمية والإعلان" 
      : "Middle Ocean Printing - Complete Digital Printing Materials & Advertising Solutions",
    description,
    openGraph: {
      title: isArabic ? `الرئيسية | ${siteTitle}` : `Home | ${siteTitle}`,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}`,
      siteName: siteTitle,
      images: [
        {
          url: '/landing_page_assets/hero/ecosystem_collage.png',
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? `الرئيسية | ${siteTitle}` : `Home | ${siteTitle}`,
      description,
      images: ['/landing_page_assets/hero/ecosystem_collage.png'],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}`,
    }
  };
}

export default async function Home(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const t = await getTranslations("Index")
  const isArabic = locale === "ar"

  // Fetch categories and site settings
  const [categories, siteSettings] = await Promise.all([
    sanityClient.fetch(categoryQuery),
    sanityClient.fetch(siteSettingsQuery)
  ])

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": isArabic ? "ميدل اوشن للطباعة" : "Middle Ocean Printing",
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo',
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/brand/logo.svg`,
    "sameAs": [
      siteSettings?.socialLinks?.facebook,
      siteSettings?.socialLinks?.instagram,
      siteSettings?.socialLinks?.linkedin,
      siteSettings?.socialLinks?.twitter,
    ].filter(Boolean),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteSettings?.phone,
      "contactType": "customer service",
      "email": siteSettings?.email,
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": isArabic ? "ميدل اوشن للطباعة" : "Middle Ocean Printing",
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/landing_page_assets/hero/ecosystem_collage.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": typeof siteSettings?.address === 'object' ? siteSettings.address[locale as keyof typeof siteSettings.address] : siteSettings?.address,
      "addressLocality": "Amman",
      "addressCountry": "JO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": siteSettings?.mapCoordinates?.lat,
      "longitude": siteSettings?.mapCoordinates?.lng
    },
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo',
    "telephone": siteSettings?.phone
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <h1 className="sr-only">
        {isArabic 
          ? "ميدل اوشن للطباعة - حلول متكاملة لمواد الطباعة الرقمية والإعلان" 
          : "Middle Ocean Printing - Complete Digital Printing Materials & Advertising Solutions"}
      </h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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
      {/* CTA Section */}
      <ContactUs1 settings={siteSettings} />
    </div>

  )
}
