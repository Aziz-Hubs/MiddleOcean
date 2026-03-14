"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { productLinks, companyLinks } from "./nav-links";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LinkItem } from "@/components/sheard";

export function DesktopNav() {
	const t = useTranslations("Navigation");

	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink
						render={(props) => <Link {...props} href="/" />}
						className={navigationMenuTriggerStyle()}
					>
						{t("home")}
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>{t("products_title")}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid w-[600px] grid-cols-2 gap-3 p-4">
							{productLinks.map((link) => (
								<NavigationMenuLink
									key={link.label}
									render={(props) => (
										<LinkItem
											{...props}
											{...link}
											label={t(link.label)}
											description={t(link.description || "")}
										/>
									)}
								/>
							))}
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>{t("company")}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4">
							{companyLinks.map((link) => (
								<li key={link.label}>
									<NavigationMenuLink
										render={(props) => (
											<LinkItem
												{...props}
												{...link}
												label={t(link.label)}
												description={t(link.description || "")}
											/>
										)}
									/>
								</li>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
