"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Earth from "@/components/ui/globe";
import { cn } from "@/lib/utils";

export default function ContactUs1() {
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });
  const t = useTranslations("CTA");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="relative w-full overflow-hidden pt-12 md:pt-16 pb-16 bg-transparent">
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="bg-card/30 border border-white/5 mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="grid md:grid-cols-2 h-full">
            <div 
              className={cn(
                "relative p-8 md:p-12 flex flex-col justify-center",
                isRtl ? "text-right items-end" : "text-left items-start"
              )} 
              ref={formRef}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 w-full"
              >
                <div className={cn("flex flex-col gap-3 mb-10", isRtl ? "items-end" : "items-start")}>
                  <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter text-foreground leading-[1.1]">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md leading-relaxed mt-2">
                    {t("subtitle")}
                  </p>
                </div>

                <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 w-full", isRtl ? "text-right" : "text-left")}>
                  {/* Headquarters */}
                  <div className={cn("flex items-start gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <MapPin className="h-5 w-5 text-black" />
                    </div>
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase opacity-70">
                        {t("headquarters")}
                      </h3>
                      <p className="text-foreground/80 text-sm mt-1.5 whitespace-pre-line leading-relaxed">
                        {t("address")}
                      </p>
                    </div>
                  </div>

                  {/* Direct Sales */}
                  <div className={cn("flex items-start gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <Mail className="h-5 w-5 text-black" />
                    </div>
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase opacity-70">
                        {t("sales")}
                      </h3>
                      <a
                        href={`mailto:${t("email")}`}
                        className="text-foreground/80 text-sm mt-1.5 hover:text-cyan-400 transition-colors block"
                      >
                        {t("email")}
                      </a>
                    </div>
                  </div>

                  {/* Support Line */}
                  <div className={cn("flex items-start gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <Phone className="h-5 w-5 text-black" />
                    </div>
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase opacity-70">
                        {t("support")}
                      </h3>
                      <p className="text-foreground/80 text-sm mt-1.5">
                        {t("phone")}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.google.com/maps?q=24.705140,46.674997", "_blank")}
                  className={cn(
                    "group bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white/60 rounded-full h-12 px-10 cursor-pointer shadow-none transition-all hover:scale-[1.02] flex items-center gap-2",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  {t("getDirections")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? -20 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex items-center justify-center p-6 md:p-10"
            >
              <div className="relative w-full h-full min-h-[380px]">
                <article className="relative w-full h-full min-h-[380px] overflow-hidden rounded-[3rem] border border-white/10 bg-black p-12 text-white flex flex-col justify-between shadow-2xl">
                  {/* TRUE Subtle Rainbow Glow - Strictly localized to the leading corner */}
                  <div className={cn(
                    "absolute -top-20 w-64 h-64 blur-[90px] opacity-50 pointer-events-none z-10",
                    isRtl ? "-right-20 bg-[radial-gradient(circle,rgba(255,0,0,0.6)_0%,rgba(255,165,0,0.5)_20%,rgba(255,255,0,0.4)_40%,rgba(0,128,0,0.3)_60%,rgba(0,0,255,0.2)_80%,transparent_100%)]" : "-left-20 bg-[radial-gradient(circle,rgba(255,0,0,0.6)_0%,rgba(255,165,0,0.5)_20%,rgba(255,255,0,0.4)_40%,rgba(0,128,0,0.3)_60%,rgba(0,0,255,0.2)_80%,transparent_100%)]"
                  )} />

                  <div className={cn("relative z-20", isRtl ? "text-right" : "text-left")}>
                    <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 leading-tight text-white/95">
                      {t("cardTitle")}
                    </h3>
                    <p className="text-white/40 text-base md:text-lg font-medium max-w-[300px] leading-relaxed">
                      {t("cardSubtitle")}
                    </p>
                  </div>

                  <div className={cn(
                    "absolute z-0 flex h-[500px] w-[500px] items-center justify-center",
                    isRtl ? "-left-28 -bottom-28" : "-right-28 -bottom-28"
                  )}>
                    <Earth
                      scale={0.85}
                      baseColor={[0.15, 0.45, 0.85]}
                      markerColor={[0.2, 0.8, 1]}
                      glowColor={[0.1, 0.35, 0.7]}
                      className="w-full h-full"
                    />
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
