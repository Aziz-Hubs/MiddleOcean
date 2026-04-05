"use client"

import { cn } from "@/lib/utils"

import { Logo } from "@/components/logo"
import { useScroll } from "@/hooks/use-scroll"
import { DesktopNav } from "@/components/desktop-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SearchBar } from "@/components/search-bar"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { SanityCategory } from "@/sanity/types"

export function Header({ categories }: { categories: SanityCategory[] }) {
  const t = useTranslations("Navigation")
  const scrolled = useScroll(20)

  return (
    <header className={cn(
      "fixed top-0",
      "z-50 w-full transition-all duration-300 print:hidden",
      scrolled 
        ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5" 
        : "border-transparent bg-transparent shadow-none"
    )}>
      <div className="container mx-auto flex h-[57px] items-center justify-between px-6">
        {/* Left section: Logo and DesktopNav */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            className="rounded-xl px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50 transition-colors"
            href="/"
          >
            <Logo className="h-12 w-auto" />
          </Link>
          <div className="hidden md:block">
            <DesktopNav categories={categories} />
          </div>
        </div>

        {/* Center section: SearchBar (both mobile and desktop) */}
        <div className="flex-1 flex justify-center px-2 sm:px-4">
          <div className="hidden md:block w-full max-w-[400px] lg:max-w-[480px] xl:max-w-[560px]">
            <SearchBar className="w-full" />
          </div>
          <div className="md:hidden w-full max-w-[260px] sm:max-w-[280px]">
            <SearchBar className="w-full" />
          </div>
        </div>

        {/* Right section: CTA (desktop) or MobileNav (mobile) */}
        <div className="flex items-center">
          <div className="hidden md:block">
            <RainbowButton asChild size="default">
              <Link href="/contact">{t("contact")}</Link>
            </RainbowButton>
          </div>
          <div className="md:hidden">
            <MobileNav categories={categories} />
          </div>
        </div>
      </div>
    </header>
  )
}
