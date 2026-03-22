"use client"

import React from "react"
import { useLocale } from "next-intl"
import { 
  Printer, 
  Layers, 
  Box, 
  Monitor, 
  Image as ImageIcon, 
  Package, 
  Settings, 
  Megaphone, 
  PenTool 
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { Marquee } from "@/src/components/ui/marquee"
import { cn } from "@/lib/utils"
import { SanityCategory } from "@/sanity/types"

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

interface CategoriesMarqueeProps {
  categories: SanityCategory[]
}

export function CategoriesMarquee({ categories }: CategoriesMarqueeProps) {
  const locale = useLocale()
  const isRtl = locale === "ar"

  return (
    <section 
      dir={isRtl ? "rtl" : "ltr"}
      className="relative w-full overflow-hidden bg-background/60 backdrop-blur-xl py-6"
    >
      <div className="container mx-auto px-6">
        {/* 
          Direction Logic Fix:
          - We FORCE dir="ltr" on the Marquee track to ensure duplicated sets are always to the right.
          - Arabic (RTL): We want "Right to Left" movement. In LTR track, this is the default (reverse=false).
          - English (LTR): We want "Left to Right" movement. In LTR track, this is the reversed state (reverse=true).
          - This ensures a perfectly infinite, seamless loop in both locales.
        */}
        <Marquee 
          pauseOnHover 
          className="[--duration:40s] [--gap:1.5rem] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" 
          reverse={!isRtl} 
          repeat={4} 
          dir="ltr"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Settings
            const name = category.title[locale as "en" | "ar"]
            const description = category.description[locale as "en" | "ar"]
            
            return (
              <Link
                key={category._id}
                href={`/products/${category.slug.current}`}
                className={cn(
                  "group/card relative flex w-72 flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10 overflow-hidden",
                  isRtl ? "text-right" : "text-left"
                )}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50 ring-1 ring-white/10 transition-all group-hover/card:bg-white/10 group-hover/card:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white/80 transition-colors group-hover/card:text-white">
                    {name}
                  </h3>
                </div>
                {/* Rainbow Strip - Top of Card */}
                <div 
                    className={cn(
                        "absolute top-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 transition-all duration-500 w-0 group-hover/card:w-full",
                        isRtl ? "right-0" : "left-0"
                    )} 
                />
                <p className="line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500 transition-colors group-hover/card:text-zinc-400">
                  {description}
                </p>
              </Link>
            )
          })}
        </Marquee>
      </div>
    </section>
  )
}
