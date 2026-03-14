"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface Slide {
  id: number;
  kicker: string;
  title: string;
  description: string;
  navTitle: string;
  navDescription: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroMarquee() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 0,
      kicker: t("slide1_kicker"),
      title: t("slide1_title"),
      description: t("slide1_navDescription"),
      navTitle: t("slide1_navTitle"),
      navDescription: t("slide1_navDescription"),
      image: "/ecosystem_collage.png",
      primaryCta: { label: t("button_getQuote"), href: "/contact" },
      secondaryCta: { label: t("button_browseMaterials"), href: "/products" },
    },
    {
      id: 1,
      kicker: t("slide2_kicker"),
      title: t("slide2_title"),
      description: t("slide2_description"),
      navTitle: t("slide2_navTitle"),
      navDescription: t("slide2_navDescription"),
      image: "/machinery_printer.png",
      primaryCta: { label: t("button_exploreProducts"), href: "/products" },
    },
    {
      id: 2,
      kicker: t("slide3_kicker"),
      title: t("slide3_title"),
      description: t("slide3_description"),
      navTitle: t("slide3_navTitle"),
      navDescription: t("slide3_navDescription"),
      image: "/premium_materials.png",
      primaryCta: { label: t("button_shopAcrylics"), href: "/products/acrylic" },
      secondaryCta: { label: t("button_shopFoam"), href: "/products/foam" },
    },
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[activeSlide].image}
            alt={slides[activeSlide].title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.span
          key={`kicker-${activeSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-primary"
        >
          {slides[activeSlide].kicker}
        </motion.span>
        
        <motion.h1
          key={`title-${activeSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl lg:text-9xl"
        >
          {slides[activeSlide].title}
        </motion.h1>

        <motion.p
          key={`desc-${activeSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg font-bold uppercase tracking-widest text-white/50 lg:text-xl"
        >
          {slides[activeSlide].description}
        </motion.p>

        <motion.div
          key={`btns-${activeSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <LiquidButton asChild>
            <a href={slides[activeSlide].primaryCta.href}>
              {slides[activeSlide].primaryCta.label}
            </a>
          </LiquidButton>
          {slides[activeSlide].secondaryCta && (
            <LiquidButton variant="secondary" asChild>
              <a href={slides[activeSlide].secondaryCta.href}>
                {slides[activeSlide].secondaryCta.label}
              </a>
            </LiquidButton>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-4 px-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(index)}
            className={cn(
              "h-1 w-12 rounded-full transition-all duration-500",
              activeSlide === index ? "bg-primary w-24" : "bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
