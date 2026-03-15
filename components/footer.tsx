import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { 
	InstagramIcon, 
	TwitterIcon, 
	LinkedinIcon, 
	FacebookIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SanityCategory } from "@/sanity/types";

export function Footer({ categories = [] }: { categories?: SanityCategory[] }) {
	const t = useTranslations("Footer");
	const tf = useTranslations("Footer"); // Keep for consistency
	const locale = useLocale();
	const isRtl = locale === "ar";

	return (
		<footer className="w-full border-t border-border bg-background/80 backdrop-blur-md pt-16 pb-8">
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* Brand Section */}
					<div className="space-y-6">
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
						</div>
					</div>

					{/* Links Grid */}
					<div className="grid grid-cols-2 gap-8 lg:col-span-2">
						<div className="space-y-4">
							<h4 className="font-bold text-sm uppercase tracking-wider">{t("sections.products")}</h4>
							<ul className="space-y-2">
								{categories.length > 0 ? (
									categories.map((cat) => (
										<li key={cat._id}>
											<Link 
												className="text-muted-foreground hover:text-primary transition-colors text-sm" 
												href={`/products?category=${cat.slug.current}`}
											>
												{isRtl ? cat.title.ar : cat.title.en}
											</Link>
										</li>
									))
								) : (
									<li className="text-muted-foreground text-sm">No categories available</li>
								)}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-sm uppercase tracking-wider">{t("sections.company")}</h4>
							<ul className="space-y-2">
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/about">{t("links.about")}</Link></li>
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/contact">{t("links.contact")}</Link></li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
					<p>{t("copyright", { year: new Date().getFullYear() })}</p>
					<div className="flex gap-6">
						<Link href="/privacy" className="hover:text-primary transition-colors">{t("links.privacy")}</Link>
						<Link href="/terms" className="hover:text-primary transition-colors">{t("links.terms")}</Link>
						<Link href="/cookies" className="hover:text-primary transition-colors">{t("links.cookies")}</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
