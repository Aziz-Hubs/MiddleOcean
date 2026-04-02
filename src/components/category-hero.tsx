"use client"

import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

import Image from "next/image"

interface CategoryHeroProps {
  name: { en: string; ar: string }
  description?: { en: string; ar: string }
  image?: string
  className?: string
}

export function CategoryHero({ name, description, image, className }: CategoryHeroProps) {
  const locale = useLocale()
  const isRtl = locale === "ar"
  const localizedName = name[locale as "en" | "ar"]
  const localizedDescription = description?.[locale as "en" | "ar"]

  return (
    <section className={cn(
      "relative h-[35vh] min-h-[350px] w-full overflow-hidden border-b border-border bg-background/80 backdrop-blur-md",
      className
    )}>
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {image && (
          <Image
            src={image}
            alt={name[locale as "en" | "ar"]}
            fill
            sizes="100vw"
            className="object-cover opacity-20 transition-transform duration-1000 group-hover:scale-110"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full flex-col px-6">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "max-w-4xl space-y-6",
              isRtl ? "text-right mr-0 ml-auto" : "text-left"
            )}
          >
            
            <h1 className={cn(
              "text-5xl font-black uppercase text-white sm:text-6xl md:text-7xl lg:text-8xl",
              isRtl ? "tracking-normal leading-normal" : "tracking-tighter"
            )}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 py-1">
                {localizedName}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg leading-relaxed text-zinc-300 md:text-xl lg:text-2xl font-light max-w-2xl"
            >
              {localizedDescription}
            </motion.p>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
