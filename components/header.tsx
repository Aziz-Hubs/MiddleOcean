"use client"

import { cn } from "@/lib/utils"

import { Logo } from "@/components/logo"
import { useScroll } from "@/hooks/use-scroll"
import { DesktopNav } from "@/components/desktop-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { SanityCategory } from "@/sanity/types"

export function Header({ categories }: { categories: SanityCategory[] }) {
  const scrolled = useScroll(10)
  const t = useTranslations("Navigation")

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        {
          "border-border bg-background/80 backdrop-blur-md": scrolled,
        }
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link
            className="rounded-xl px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50"
            href="/"
          >
            <img src="/logo.svg" alt="MiddleOcean" className="h-8 w-auto" />
          </Link>
          <DesktopNav categories={categories} />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <RainbowButton asChild size="default">
            <Link href="/contact">{t("contact")}</Link>
          </RainbowButton>
        </div>
        <MobileNav categories={categories} />
      </nav>
    </header>
  )
}
