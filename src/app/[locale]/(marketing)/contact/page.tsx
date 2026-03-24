import { getTranslations } from "next-intl/server";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import ContactPageClient from "./ContactPageClient";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  
  return {
    title: isArabic ? "اتصل بنا" : "Contact Us",
    description: isArabic 
      ? "تواصل مع فريقنا الخبير في ميدل اوشن للطباعة للحصول على استشارات، عروض أسعار، أو دعم فني بخصوص منتجات الطباعة الرقمية."
      : "Get in touch with our expert team at Middle Ocean Printing for consultations, quotes, or technical support regarding digital printing products.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/contact`,
    }
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("ContactUs");
  const settings = await sanityClient.fetch(siteSettingsQuery);

  return <ContactPageClient settings={settings} locale={locale} />;
}
