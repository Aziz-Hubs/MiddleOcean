"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
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
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

// ─── Icon lookup ────────────────────────────────────────────────────────────
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

// ─── Types ───────────────────────────────────────────────────────────────────
interface SanityCategory {
  _id: string
  title: { en: string; ar: string }
  description: { en: string; ar: string }
  icon: string
  slug: { current: string }
  image?: string
}

// ─── Static fallback images ───────────────────────────────────────────────────
const FALLBACKS: Record<string, string> = {
  machines: "/images/categories/machines.png",
  "acrylic-sheets": "/images/categories/acrylic_sheets.png",
  "foam-sheets": "/images/categories/foam_sheets.png",
  "digital-printing-materials": "/images/categories/digital_printing_materials.png",
  screens: "/images/categories/screens.png",
  "printers-supplies": "/images/categories/printers_supplies.png",
  "advertisement-materials": "/images/categories/advertisement_materials.png",
}

function getImage(cat: SanityCategory) {
  return cat.image || FALLBACKS[cat.slug.current] || "/images/categories/machines.png"
}

// ─── Mobile-only card ─────────────────────────────────────────────────────────
// BentoCard is sized by CSS grid — it doesn't work inside Embla's flex track.
// This card is fully self-contained: "relative h-full" gives absolute children
// a real bounding box.
function MobileCategoryCard({
  cat,
  locale,
  isRtl,
}: {
  cat: SanityCategory
  locale: string
  isRtl: boolean
}) {
  const Icon = iconMap[cat.icon || ""] || Settings
  const name = isRtl ? cat.title?.ar : cat.title?.en
  const description = isRtl ? cat.description?.ar : cat.description?.en
  const image = getImage(cat)

  return (
    <Link
      href={`/${locale}/products/${cat.slug.current}`}
      className="group relative block h-full w-full overflow-hidden"
    >
      {/* Background photo */}
      <Image
        src={image}
        alt={name}
        fill
        sizes="80vw"
        className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
      />

      {/* Dark overlay — top corner */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(${isRtl ? "225deg" : "135deg"}, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 35%, transparent 65%)`,
        }}
      />
      {/* Dark overlay — bottom */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 50%)" }}
      />

      {/* Content layer */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col justify-between p-6",
          isRtl ? "items-end text-right" : "items-start text-left"
        )}
      >
        {/* Top — icon + title */}
        <div className={cn("flex flex-col gap-2", isRtl ? "items-end" : "items-start")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white leading-tight">
            {name}
          </h3>
        </div>

        {/* Bottom — description */}
        <p className="text-base font-medium leading-relaxed text-white/55 max-w-[220px]">
          {description}
        </p>
      </div>
    </Link>
  )
}

// ─── Wired-up mobile carousel (manages its own API + dot state) ──────────────
function MobileCarousel({
  items,
  locale,
  isRtl,
}: {
  items: SanityCategory[]
  locale: string
  isRtl: boolean
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    // Defer initial select to avoid cascading renders
    const timer = setTimeout(() => onSelect(api), 0)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      clearTimeout(timer)
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  const rainbowColors = [
    "from-red-500 via-orange-400 to-yellow-400",
    "from-yellow-400 via-green-400 to-cyan-400",
    "from-cyan-400 via-blue-500 to-violet-500",
    "from-violet-500 via-fuchsia-500 to-pink-500",
    "from-pink-500 via-red-400 to-orange-400",
    "from-orange-400 via-yellow-300 to-green-400",
    "from-green-400 via-teal-400 to-cyan-500",
  ]

  return (
    <div className="block md:hidden">
      <Carousel
        opts={{ align: "start", loop: true, direction: isRtl ? "rtl" : "ltr" }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-4 mr-1">
          {items.map((cat) => (
            <CarouselItem key={cat._id} className="basis-[78%] pl-0 pr-3 sm:basis-[60%]">
              <div className="relative h-[380px] w-full overflow-hidden rounded-2xl">
                <MobileCategoryCard cat={cat} locale={locale} isRtl={isRtl} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Live rainbow pagination dots */}
      <div className="mt-5 flex items-center justify-center gap-2 px-4">
        {items.map((cat, i) => {
          const isActive = i === current
          const gradient = rainbowColors[i % rainbowColors.length]
          return (
            <button
              key={cat._id}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-[4px] rounded-full transition-all duration-500 ease-out focus:outline-none",
                isActive
                  ? `w-7 bg-gradient-to-r ${gradient}`
                  : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ProductCategoriesGrid({
  locale,
  categories,
}: {
  locale: string
  categories?: SanityCategory[]
}) {
  const t = useTranslations("Categories")
  const isRtl = locale === "ar"

  const getLayoutClass = (slug: string) =>
    slug === "machines"
      ? "col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-1"
      : "col-span-1 lg:col-span-1 lg:row-span-1"

  const items = categories && categories.length > 0 ? categories : []

  return (
    <section className="relative w-full overflow-hidden bg-black py-24" id="products">
      <div className="w-full">

        {/* Section header */}
        <div className="mb-16 px-4 text-center">
          <motion.h2
            className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-xl font-bold uppercase tracking-widest text-white/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* ── Mobile: horizontal swipe carousel (hidden on md+) ── */}
        <MobileCarousel items={items} locale={locale} isRtl={isRtl} />

        {/* ── Desktop: original Bento Grid (hidden below md) ── */}
        <div className="hidden md:block">
<BentoGrid>
            {items.map((cat) => {
               const name = isRtl ? cat.title?.ar : cat.title?.en
               const description = isRtl ? cat.description?.ar : cat.description?.en
               const Icon = iconMap[cat.icon || ""] || Settings
               const image = getImage(cat)
              const className = getLayoutClass(cat.slug.current)

              return (
                <BentoCard
                  key={cat._id}
                  name={name}
                  description={description}
                  Icon={Icon}
                  className={className}
                  href={`/${locale}/products/${cat.slug.current}`}
                  cta=""
                  glowColor={
                    cat.slug.current === "machines" ? "blue" :
                    cat.slug.current === "acrylic-sheets" ? "purple" :
                    cat.slug.current === "foam-sheets" ? "green" :
                    cat.slug.current === "digital-printing-materials" ? "red" :
                    cat.slug.current === "screens" ? "orange" :
                    "cyan"
                  }
                  background={
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{
                          background: `linear-gradient(${isRtl ? "225deg" : "135deg"}, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{
                          background: `linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 40%), linear-gradient(${isRtl ? "270deg" : "90deg"}, rgba(0,0,0,0.8) 0%, transparent 30%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{
                          background: `radial-gradient(circle at ${isRtl ? "90%" : "10%"} 90%, rgba(0,0,0,1) 0%, transparent 50%)`,
                        }}
                      />
                    </div>
                  }
                />
              )
            })}
          </BentoGrid>
        </div>

      </div>
    </section>
  )
}
