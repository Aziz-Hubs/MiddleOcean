import { useTranslations } from "next-intl";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  
  return {
    title: isArabic ? "من نحن | ميدل اوشن للطباعة" : "About Us | Middle Ocean Printing",
    description: isArabic 
      ? "تعرف على تاريخ ورؤية ميدل اوشن للطباعة، شريكك الموثوق في عالم الطباعة الرقمية ومواد الإعلان منذ سنوات."
      : "Learn about the history and vision of Middle Ocean Printing, your trusted partner in the world of digital printing and advertising materials for years.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'}/${locale}/about`,
    }
  };
}


export default function Page() {
  const t = useTranslations("Footer");
  return (
    <div className="container mx-auto py-24 px-6 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tighter">
        {t("links.about")}
      </h1>
      <p className="mt-4 text-muted-foreground">Scaffolded about us page.</p>
    </div>
  );
}
