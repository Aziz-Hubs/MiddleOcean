import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { sanityClient } from "@/sanity/client";
import { categoryQuery } from "@/sanity/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

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

	// Providing all messages to the client side
	const messages = await getMessages();

	// Fetch categories for the navbar
	const categories = await sanityClient.fetch(categoryQuery);

	return (
		<html
			lang={locale}
			dir={locale === "ar" ? "rtl" : "ltr"}
			suppressHydrationWarning
			className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
		>
			<body className="flex min-h-screen flex-col">
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<WebGLShader />
						<Header categories={categories} />
						<main className="flex-1">
							{children}
						</main>
						<Footer />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
