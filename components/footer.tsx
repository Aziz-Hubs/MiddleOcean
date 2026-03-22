"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { 
	InstagramIcon, 
	TwitterIcon, 
	LinkedinIcon, 
	FacebookIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon,
	Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SanityCategory } from "@/sanity/types";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export function Footer({ categories = [] }: { categories?: SanityCategory[] }) {
	const t = useTranslations("Footer");
	const tf = useTranslations("Footer"); // Keep for consistency
	const locale = useLocale();
	const isRtl = locale === "ar";
	const pathname = usePathname();

	return (
		<footer className="w-full border-t border-border bg-background/80 backdrop-blur-md pt-16 pb-8 overflow-hidden">
			<motion.div 
				className="mx-auto max-w-7xl px-6"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: false, amount: 0.1 }}
			>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* Brand Section */}
					<motion.div variants={itemVariants} className="space-y-6">
						<Link href="/" className="flex items-center gap-2 group">
							<img 
								src="/logo.svg" 
								alt="Middle Ocean Logo" 
								className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
							/>
							<span className="text-xl font-bold tracking-tight">
								{t("brand_first")} <span className="animate-rainbow bg-gradient-to-r from-[#ff0000] via-[#ff00ff] to-[#ff0000] bg-[length:200%_auto] bg-clip-text text-transparent">{t("brand_second")}</span>
							</span>
						</Link>
						<p className="text-muted-foreground text-sm leading-relaxed max-w-xs transition-opacity duration-300">
							{t("description")}
						</p>
						<div className="flex gap-4">
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors">
								<InstagramIcon className="size-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors">
								<TwitterIcon className="size-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors">
								<LinkedinIcon className="size-5" />
							</a>
							<div className="w-px h-4 bg-border my-auto mx-1" />
							<Link
								href={pathname}
								locale={locale === "en" ? "ar" : "en"}
								className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
								title={t("language_toggle")}
							>
								<Languages className="size-5" />
							</Link>
						</div>
					</motion.div>

					{/* Links Grid */}
					<div className="grid grid-cols-2 gap-8 lg:col-span-2">
						<motion.div variants={itemVariants} className="space-y-4">
							<h4 className="font-bold text-sm uppercase tracking-wider">{t("sections.products")}</h4>
							<ul className="space-y-2">
								{categories.length > 0 ? (
									categories.map((cat) => (
										<li key={cat._id}>
											<Link 
												className="text-muted-foreground hover:text-primary transition-colors text-sm" 
												href={`/products/${cat.slug.current}`}
											>
												{isRtl ? cat.title.ar : cat.title.en}
											</Link>
										</li>
									))
								) : (
									<li className="text-muted-foreground text-sm">No categories available</li>
								)}
							</ul>
						</motion.div>
						<motion.div variants={itemVariants} className="space-y-4">
							<h4 className="font-bold text-sm uppercase tracking-wider">{t("sections.company")}</h4>
							<ul className="space-y-2">
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/about">{t("links.about")}</Link></li>
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/contact">{t("links.contact")}</Link></li>
							</ul>
						</motion.div>
					</div>
				</div>

				{/* Bottom Section */}
				<motion.div 
					variants={itemVariants}
					className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground"
				>
					<p>{t("copyright", { year: new Date().getFullYear() })}</p>
					<div className="flex gap-6">
						<Link href="/privacy" className="hover:text-primary transition-colors">{t("links.privacy")}</Link>
						<Link href="/terms" className="hover:text-primary transition-colors">{t("links.terms")}</Link>
						<Link href="/cookies" className="hover:text-primary transition-colors">{t("links.cookies")}</Link>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
