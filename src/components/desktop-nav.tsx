"use client"

import React, { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { companyLinks, legalLinks } from "./nav-links"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LinkItem } from "@/components/sheard"
import { sanityClient } from "@/sanity/client"
import { SanityCategory } from "@/sanity/types"
import {
  Printer,
  Layers,
  Box,
  Monitor,
  Image as ImageIcon,
  Package,
  Settings,
  Megaphone,
  PenTool,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

export const iconMap: Record<string, React.ElementType> = {
  Printer,
  Layers,
  Box,
  Monitor,
  ImageIcon,
  Package,
  Settings,
  Megaphone,
  PenTool,
}

export function DesktopNav({ categories }: { categories: SanityCategory[] }) {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const isRtl = locale === "ar"


  return (
    <NavigationMenu>
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
          <NavigationMenuTrigger>
            {t("products_title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col w-[600px]">
              <div className="grid grid-cols-2 gap-3 p-4">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || Settings
                    return (
                      <NavigationMenuLink
                        key={cat._id}
                        render={(props) => (
                          <LinkItem
                            {...props}
                            href={`/products/${cat.slug.current}`}
                            label={isRtl ? cat.title.ar : cat.title.en}
                            description={
                              isRtl ? cat.description.ar : cat.description.en
                            }
                            icon={<Icon className="size-5" />}
                          />
                        )}
                      />
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground col-span-2">
                    Loading categories...
                  </div>
                )}
              </div>
              <div className="bg-muted/30 p-4 border-t border-border/50">
                <Link
                  href="/products"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group/all"
                >
                  <span className="relative">
                    {t("explore_all")}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/all:w-full" />
                  </span>
                  <div className={cn(
                    "transition-transform group-hover/all:translate-x-1",
                    isRtl && "rotate-180 group-hover/all:-translate-x-1"
                  )}>
                    {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
                  </div>
                </Link>
              </div>
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
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("legal")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {legalLinks.map((link) => (
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
  )
}
