"use client"

import { cn } from "@/lib/utils"

import { Logo } from "@/components/logo"
import { useScroll } from "@/hooks/use-scroll"
import { DesktopNav } from "@/components/desktop-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SearchTrigger } from "@/components/search-trigger"
import { SearchBar } from "@/components/search-bar"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { SanityCategory } from "@/sanity/types"

export function Header({ categories }: { categories: SanityCategory[] }) {
  const t = useTranslations("Navigation")
  const scrolled = useScroll(20)
  const pathname = usePathname()
  
  // Detect if we are on a product page (e.g., /en/products/category/slug or /ar/products/category/slug)
  const isProductPage = pathname.includes("/products/") && pathname.split("/").length > 4

  return (
    <header className={cn(
      "fixed top-0",
      "z-50 w-full transition-all duration-300 print:hidden",
      scrolled 
        ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5" 
        : "border-transparent bg-transparent shadow-none"
    )}>
      <div className="container mx-auto flex h-[57px] items-center px-6">
        <div className="flex items-center gap-8 flex-1">
          <Link
            className="rounded-xl px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50 transition-colors"
            href="/"
          >
            <Logo className="h-8 w-auto" />
          </Link>
          <div className="hidden md:block">
            <DesktopNav categories={categories} />
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2",
          isProductPage ? "justify-end" : "justify-end"
        )}>
          <div className="hidden items-center gap-3 md:flex">
            <SearchBar className="w-[280px] lg:w-[320px]" />
            <RainbowButton asChild size="default">
              <Link href="/contact">{t("contact")}</Link>
            </RainbowButton>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <SearchTrigger variant="ghost" size="icon" />
            <MobileNav categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
