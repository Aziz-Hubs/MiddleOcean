import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { aboutPageQuery, siteSettingsQuery } from "@/sanity/queries";
import { SanityAboutPage } from "@/sanity/types";
import ContactUs1 from "@/components/contact-us-1";
import {
  HeroSection,
  HistorySection,
  MissionVisionSection,
  ValuesSection,
  TeamSection,
  TimelineSection,
} from "@/components/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  // Try to fetch about page data for dynamic metadata
  let aboutData: SanityAboutPage | null = null;
  try {
    aboutData = await sanityClient.fetch(aboutPageQuery);
  } catch {
    // Fallback to default metadata if query fails
  }

  const title = isArabic
    ? aboutData?.hero?.title?.ar || "من نحن | ميدل أوشن للطباعة"
    : aboutData?.hero?.title?.en || "About Us | Middle Ocean Printing";

  const description = isArabic
    ? aboutData?.hero?.subtitle?.ar ||
      "تعرف على تاريخ ورؤية ميدل أوشن للطباعة، شريكك الموثوق في عالم الطباعة الرقمية ومواد الإعلان منذ سنوات."
    : aboutData?.hero?.subtitle?.en ||
      "Learn about the history and vision of Middle Ocean Printing, your trusted partner in the world of digital printing and advertising materials for years.";

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.jo"}/${locale}/about`,
      languages: {
        en: "/en/about",
        ar: "/ar/about",
      },
    },
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://middleocean.jo"}/${locale}/about`,
      siteName: isArabic ? "ميدل أوشن للطباعة" : "Middle Ocean Printing",
      locale: isArabic ? "ar_JO" : "en_US",
      type: "website",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch about page data and site settings in parallel
  const [aboutData, siteSettings] = await Promise.all([
    sanityClient
      .fetch<SanityAboutPage>(aboutPageQuery)
      .catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Hero Section */}
      <HeroSection data={aboutData?.hero} locale={locale} />

      {/* History Section */}
      <HistorySection data={aboutData?.history} locale={locale} />

      {/* Mission & Vision Section */}
      <MissionVisionSection data={aboutData?.missionVision} locale={locale} />

      {/* Values Section */}
      <ValuesSection data={aboutData?.values} locale={locale} />

      {/* Timeline Section */}
      <TimelineSection data={aboutData?.timeline} locale={locale} />

      {/* Team Section */}
      <TeamSection data={aboutData?.team} locale={locale} />

      {/* CTA Section - Reusing ContactUs1 from landing page */}
      <ContactUs1 settings={siteSettings} />
    </main>
  );
}
