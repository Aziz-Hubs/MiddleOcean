"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { 
	InstagramIcon, 
	TwitterIcon, 
	LinkedinIcon, 
	Languages,
	MailIcon,
	MapPinIcon,
	PhoneIcon
} from "lucide-react";
import { SanityCategory } from "@/sanity/types";
import { motion, Variants } from "framer-motion";
import { Logo } from "@/components/logo";
import { companyLinks, legalLinks } from "./nav-links";

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
	const tn = useTranslations("Navigation"); 
	const locale = useLocale();
	const isRtl = locale === "ar";
	const pathname = usePathname();

	return (
		<footer className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-24 pb-12 overflow-hidden print:hidden border-t border-border/40 shadow-lg shadow-black/5">
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
							<Logo 
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
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
								<InstagramIcon className="size-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
								<TwitterIcon className="size-5" />
							</a>
							<a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
								<LinkedinIcon className="size-5" />
							</a>
							<div className="w-px h-4 bg-border my-auto mx-1" />
							<Link
								href={pathname}
								locale={locale === "en" ? "ar" : "en"}
								className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
								title={t("language_toggle")}
								aria-label={t("language_toggle")}
							>
								<Languages className="size-5" />
							</Link>

						</div>
					</motion.div>

					{/* Links Grid */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
						{/* Products Column */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="font-bold text-sm uppercase tracking-wider">{t("sections.products")}</h3>
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

						{/* Company Column */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="font-bold text-sm uppercase tracking-wider">{t("sections.company")}</h3>
							<ul className="space-y-2">
								{companyLinks.map((link) => (
									<li key={link.label}>
										<Link 
											className="text-muted-foreground hover:text-primary transition-colors text-sm" 
											href={link.href as any}
										>
											{tn(link.label)}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Legal Column */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="font-bold text-sm uppercase tracking-wider">{t("sections.legal")}</h3>
							<ul className="space-y-2">
								{legalLinks.map((link) => (
									<li key={link.label}>
										<Link 
											className="text-muted-foreground hover:text-primary transition-colors text-sm" 
											href={link.href as any}
										>
											{tn(link.label)}
										</Link>
									</li>
								))}
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
						<span>{t("brand_first")} {t("brand_second")}</span>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
