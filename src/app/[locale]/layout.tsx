import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
// import { WebGLShader } from "@/components/ui/web-gl-shader";
import { WebGLShaderWrapper } from "@/components/web-gl-shader-wrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { sanityClient } from "@/sanity/client";
import { categoryQuery, siteSettingsQuery } from "@/sanity/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  
  // Fetch global settings for SEO defaults
  const settings = await sanityClient.fetch(siteSettingsQuery);
  const siteTitle = settings?.title || (isArabic ? "ميدل اوشن للطباعة" : "Middle Ocean Printing");
  
  return {
    title: {
      template: `%s | ${siteTitle}`,
      default: isArabic 
        ? "ميدل اوشن للطباعة - شريكك الموثوق لحلول مواد الطباعة الرقمية" 
        : "Middle Ocean Printing - Your Trusted Partner for Digital Printing Materials Solutions",
    },
    description: isArabic 
      ? "المزود الرائد لحلول مواد الطباعة الرقمية، بما في ذلك الفلكس والفينيل والأحبار والمواد الإعلانية. الشركة الأم لـ OceanTeck و OceanJett." 
      : "Leading provider of Digital Printing Materials Solutions, specializing in Flex, Vinyl, Inks, and Advertising Materials. Parent company of OceanTeck and OceanJett.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo'),
    alternates: {
      languages: {
        'en': '/en',
        'ar': '/ar',
      },
    },
  };
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Fetch messages and categories in parallel to reduce blocking time
	const [messages, categories] = await Promise.all([
		getMessages(),
		sanityClient.fetch(categoryQuery),
	]);


	return (
		<html
			lang={locale}
			dir={locale === "ar" ? "rtl" : "ltr"}
			suppressHydrationWarning
			className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
		>
			<body className="flex min-h-screen flex-col">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none"
				>
					{locale === "ar" ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content"}
				</a>
				<NextIntlClientProvider messages={messages}>

					<ThemeProvider>
						<TooltipProvider>
							<WebGLShaderWrapper />
							<Header categories={categories} />
							<main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
								<Suspense>
									{children}
								</Suspense>
							</main>

							<Footer categories={categories} />
						</TooltipProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
