"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 8000;

export default function AppHero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [progressKey, setProgressKey] = React.useState(0);

  const slides = [
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

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setProgressKey((prev) => prev + 1);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section 
      dir={isRtl ? "rtl" : "ltr"}
      className="relative w-full min-h-[80vh] flex flex-col items-center overflow-hidden pt-0"
    >
      <div className="flex flex-col w-full h-full">
        {/* Top Content Area */}
        <div className="flex-1 w-full relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              duration: 40,
              direction: isRtl ? "rtl" : "ltr",
            }}
            className="w-full h-full z-10"
          >
            <CarouselContent className="h-full">
              {slides.map((slide, index) => (
                <CarouselItem
                  key={index}
                  className="h-full basis-full relative py-4 lg:py-8"
                >
                  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-24">
                    {/* Image/Graphic Column - Top on mobile, order handled by dir="rtl" on desktop */}
                    <div className={cn(
                      "relative aspect-square lg:aspect-auto h-[300px] lg:h-[600px] w-full flex items-center justify-center order-1 lg:order-2",
                    )}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.8 }}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-contain"
                            priority
                          />
                          {/* Ambient glow behind image */}
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
 
                    {/* Text Column - Bottom on mobile, order handled by dir="rtl" on desktop */}
                    <div className={cn(
                      "flex flex-col z-20 order-2 lg:order-1 min-h-[400px] lg:min-h-[550px]",
                      isRtl ? "text-right items-start" : "text-left items-start"
                    )}>
                      {/* Main Text Content */}
                      <div className={cn(
                        "flex flex-col space-y-6 w-full",
                        isRtl ? "items-start" : "items-start"
                      )}>
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "text-primary font-bold tracking-[0.2em] text-xs sm:text-sm uppercase block",
                            isRtl ? "text-right" : "text-left"
                          )}
                        >
                          {slide.kicker}
                        </motion.span>
 
                        <motion.h1 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className={cn(
                            "text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-tight",
                            isRtl ? "text-right" : "text-left"
                          )}
                        >
                          {slide.title}
                        </motion.h1>
 
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={cn(
                            "text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl",
                            isRtl ? "text-right" : "text-left"
                          )}
                        >
                          {slide.description}
                        </motion.p>
 
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={cn(
                            "flex flex-wrap gap-4 pt-4",
                            isRtl ? "justify-start" : "justify-start"
                          )}
                        >
                          <Link 
                            href={slide.primaryCta.href}
                            className={cn(
                              buttonVariants({ size: "lg" }),
                              "rounded-full px-8 py-6 text-base font-bold shadow-2xl hover:scale-105 transition-transform"
                            )}
                          >
                            {slide.primaryCta.label}
                          </Link>
                          {slide.secondaryCta && (
                            <Link
                              href={slide.secondaryCta.href}
                              className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "rounded-full px-8 py-6 text-base font-bold transition-all hover:bg-accent"
                              )}
                            >
                              {slide.secondaryCta.label}
                            </Link>
                          )}
                        </motion.div>
                      </div>
 
                      {/* Brands Section - Only on first slide, moved to bottom */}
                      {index === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-auto pt-16 flex flex-col space-y-4 w-full"
                        >
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50",
                            isRtl ? "text-right" : "text-left"
                          )}>
                            {t("trustedBrands") || "Trusted by top brands"}
                          </span>
                          <div className={cn(
                            "flex flex-wrap gap-6 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-500",
                            isRtl ? "justify-start" : "justify-start"
                          )}>
                            {["OceanTeck", "OceanJett", "FLORA", "HP", "Epson"].map((brand) => (
                              <span key={brand} className="text-sm font-black tracking-tighter">
                                {brand}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
 
        {/* Bottom Navigation Area */}
        <div className="w-full relative z-20 pb-4 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border/50">
              {slides.map((slide, index) => {
                const isActive = current === index;
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative cursor-pointer transition-all duration-500 p-8 flex flex-col group overflow-hidden",
                      isActive ? "bg-accent/50 flex" : "hover:bg-accent/20 hidden md:flex"
                    )}
                    onClick={() => api?.scrollTo(index)}
                  >
                    {/* Rainbow Progress Bar */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 z-30 overflow-hidden">
                        <motion.div
                          key={progressKey}
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: AUTOPLAY_DELAY / 1000,
                            ease: "linear",
                          }}
                          onAnimationComplete={() => {
                            api?.scrollNext();
                          }}
                          style={{
                            position: 'absolute',
                            [isRtl ? "right" : "left"]: 0
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className={cn(
                        "text-[10px] font-black tracking-widest uppercase transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/60"
                      )}>
                        {slide.navTitle}
                      </h4>
                      <p className={cn(
                        "text-sm font-medium leading-relaxed line-clamp-2",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {slide.navDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
