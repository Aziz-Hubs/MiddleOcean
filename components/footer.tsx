import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
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

export function Footer() {
	const t = useTranslations("Footer");
	const tf = useTranslations("Footer"); // Same namespace but keep for consistency

	return (
		<footer className="w-full border-t border-border bg-background/95 backdrop-blur-sm pt-16 pb-8">
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
					{/* Brand Section */}
					<div className="space-y-6">
						<Link href="/">
							<Logo className="h-6 w-32" />
						</Link>
						<p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
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
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/products/printers">{t("links.printers")}</Link></li>
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/products/materials">{t("links.materials")}</Link></li>
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/products/displays">{t("links.displays")}</Link></li>
								<li><Link className="text-muted-foreground hover:text-primary transition-colors text-sm" href="/products/parts">{t("links.parts")}</Link></li>
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
