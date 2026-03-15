"use client"

import React, { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { companyLinks } from "./nav-links"
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
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
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

  console.log("Rendering DesktopNav with categories:", categories?.length)

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
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Settings
                  return (
                    <NavigationMenuLink
                      key={cat._id}
                      render={(props) => (
                        <LinkItem
                          {...props}
                          href={`/products?category=${cat.slug.current}`}
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
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading categories...
                </div>
              )}
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
  )
}
