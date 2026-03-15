"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
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
import { sanityClient } from "@/sanity/client"

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

interface SanityCategory {
  _id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  icon: string
  slug: {
    current: string
  }
  image?: string
}

export function ProductCategoriesGrid({
  locale,
  categories,
}: {
  locale: string
  categories?: SanityCategory[]
}) {
  const t = useTranslations("Categories")
  const isRtl = locale === "ar"

  // Define layout spans based on slug (Symmetrical 4-column 2-tier mix for 7 items)
  const getLayoutClass = (slug: string, index: number) => {
    // 4 Columns x 2 Rows = 8 slots
    // 7 items: (1 wide x2 slots) + (6 small x1 slot) = 8 slots filled.

    // We force specific items to be featured to fill the grid perfectly
    if (slug === "machines")
      return "col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-1" // Horizontal Feature (2 slots)

    return "col-span-1 lg:col-span-1 lg:row-span-1" // Rest 6 items are 1x1 (6 slots)
  }

  const displayCategories =
    categories && categories.length > 0 ? categories : []

  return (
    <section
      className="relative w-full overflow-hidden bg-black py-24"
      id="products"
    >
      <div className="w-full">
        <div className="mb-16 text-center">
          <motion.h2
            className="text-4xl font-black tracking-tighter text-white uppercase sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-xl font-bold tracking-widest text-white/60 uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <BentoGrid>
          {displayCategories.map((cat, index) => {
            const name = isRtl ? cat.title.ar : cat.title.en
            const description = isRtl ? cat.description.ar : cat.description.en
            const Icon = iconMap[cat.icon] || Settings

            // Map slugs to background images with fallbacks
            const fallbacks: Record<string, string> = {
              machines: "/images/categories/machines.png",
              "acrylic-sheets": "/images/categories/acrylic_sheets.png",
              "foam-sheets": "/images/categories/foam_sheets.png",
              "digital-printing-materials":
                "/images/categories/digital_printing_materials.png",
              screens: "/images/categories/screens.png",
              "printers-supplies": "/images/categories/printers_supplies.png",
              "advertisement-materials":
                "/images/categories/advertisement_materials.png",
            }
            const image =
              cat.image ||
              fallbacks[cat.slug.current] ||
              "/images/categories/machines.png"
            const className = getLayoutClass(cat.slug.current, index)

            return (
              <BentoCard
                key={cat._id}
                name={name}
                description={description}
                Icon={Icon}
                className={className}
                href={`/products?category=${cat.slug.current}`}
                cta=""
                background={
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />
                    {/* Top Corner Triangle Fade */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background: `linear-gradient(${isRtl ? "225deg" : "135deg"}, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)`,
                      }}
                    />
                    {/* Bottom Edge Fade */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background: `linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 40%), linear-gradient(${isRtl ? "270deg" : "90deg"}, rgba(0,0,0,0.8) 0%, transparent 30%)`,
                      }}
                    />
                    {/* Bottom Corner Specific Radial Fade */}
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
    </section>
  )
}
