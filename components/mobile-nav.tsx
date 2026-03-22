import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button, buttonVariants } from "@/components/ui/button";
import { companyLinks, legalLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { XIcon, MenuIcon, Settings, ChevronDown } from "lucide-react";
import { SanityCategory } from "@/sanity/types";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { iconMap } from "./desktop-nav";

export function MobileNav({ categories }: { categories: SanityCategory[] }) {
	const [open, setOpen] = useState(false);
	const [activeSection, setActiveSection] = useState<string | null>("products");
	const locale = useLocale();
	const t = useTranslations("Navigation");
	const isRtl = locale === "ar";

	const toggleSection = (section: string) => {
		setActiveSection(activeSection === section ? null : section);
	};

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon />
				</div>
			</Button>
			{open && (
				<Portal className="top-14">
					<PortalBackdrop />
					<div
						className={cn(
							"size-full overflow-y-auto p-4 bg-background/95 backdrop-blur-sm",
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex w-full flex-col gap-y-2">
							{/* Products Section */}
							<div className="flex flex-col">
								<button
									onClick={() => toggleSection("products")}
									className="flex items-center justify-between w-full px-2 py-3 text-sm font-semibold border-b border-border/50"
								>
									<span>{t("products_title")}</span>
									<ChevronDown
										className={cn(
											"size-4 transition-transform duration-200",
											activeSection === "products" && "rotate-180"
										)}
									/>
								</button>
								{activeSection === "products" && (
									<div className="flex flex-col mt-2 gap-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
										{categories.map((cat) => {
											const Icon = iconMap[cat.icon] || Settings;
											return (
												<Link
													key={cat._id}
													href={`/products/${cat.slug.current}`}
													className="flex items-center gap-3 rounded-xl p-3 active:bg-muted dark:active:bg-muted/50 transition-colors"
													onClick={() => setOpen(false)}
												>
													<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
														<Icon className="size-5" />
													</div>
													<div className="flex flex-col">
														<span className="font-medium text-sm">
															{isRtl ? cat.title.ar : cat.title.en}
														</span>
														<span className="text-xs text-muted-foreground line-clamp-1">
															{isRtl ? cat.description.ar : cat.description.en}
														</span>
													</div>
												</Link>
											);
										})}
									</div>
								)}
							</div>

							{/* Company Section */}
							<div className="flex flex-col">
								<button
									onClick={() => toggleSection("company")}
									className="flex items-center justify-between w-full px-2 py-3 text-sm font-semibold border-b border-border/50"
								>
									<span>{t("company")}</span>
									<ChevronDown
										className={cn(
											"size-4 transition-transform duration-200",
											activeSection === "company" && "rotate-180"
										)}
									/>
								</button>
								{activeSection === "company" && (
									<div className="flex flex-col mt-2 gap-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
										{companyLinks.map((link) => (
											<LinkItem
												className="rounded-xl p-3 active:bg-muted dark:active:bg-muted/50"
												key={`company-${link.label}`}
												{...link}
												label={t(link.label)}
												description={t(link.description || "")}
												onClick={() => setOpen(false)}
											/>
										))}
									</div>
								)}
							</div>

							{/* Legal Section */}
							<div className="flex flex-col">
								<button
									onClick={() => toggleSection("legal")}
									className="flex items-center justify-between w-full px-2 py-3 text-sm font-semibold border-b border-border/50"
								>
									<span>{t("legal")}</span>
									<ChevronDown
										className={cn(
											"size-4 transition-transform duration-200",
											activeSection === "legal" && "rotate-180"
										)}
									/>
								</button>
								{activeSection === "legal" && (
									<div className="flex flex-col mt-2 gap-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
										{legalLinks.map((link) => (
											<LinkItem
												className="rounded-xl p-3 active:bg-muted dark:active:bg-muted/50"
												key={`legal-${link.label}`}
												{...link}
												label={t(link.label)}
												description={t(link.description || "")}
												onClick={() => setOpen(false)}
											/>
										))}
									</div>
								)}
							</div>
						</div>
						<div className="mt-8 flex flex-col gap-2">
							<Link
								href="/contact"
								onClick={() => setOpen(false)}
								className={cn(buttonVariants({ size: "lg" }), "w-full rounded-xl")}
							>
								{isRtl ? "تواصل معنا" : "Contact Us"}
							</Link>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
