"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Header() {
	const scrolled = useScroll(10);
	const t = useTranslations("Navigation");

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b transition-all duration-300", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<Link
						className="rounded-xl px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50"
						href="/"
					>
						<Logo className="h-4" />
					</Link>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button render={(props) => (
						<Link {...props} href="/contact">
							{t("contact")}
						</Link>
					)}>
						{t("contact")}
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
