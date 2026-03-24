"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  CheckCircle2, 
  ArrowRight,
  Printer,
  Layers,
  Cpu,
  Zap
} from "lucide-react";

const AUTOPLAY_DELAY = 5000;

interface Step {
  step: string;
  title: string;
  content: string;
  Icon: React.ElementType;
  image: string;
}

export default function FeatureSteps() {
  const t = useTranslations("Features");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [activeStep, setActiveStep] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const steps: Step[] = [
    {
      step: t("step1"),
      title: t("title1"),
      content: t("content1"),
      Icon: Printer,
      image: "/landing_page_assets/features/printer.png",
    },
    {
      step: t("step2"),
      title: t("title2"),
      content: t("content2"),
      Icon: Layers,
      image: "/landing_page_assets/features/materials.png",
    },
    {
      step: t("step3"),
      title: t("title3"),
      content: t("content3"),
      Icon: Cpu,
      image: "/landing_page_assets/features/cnc_machine.png",
    },
    {
      step: t("step4"),
      title: t("title4"),
      content: t("content4"),
      Icon: Zap,
      image: "/landing_page_assets/features/laser_cutter.png",
    },
  ];

  const handleStepChange = (index: number) => {
    setActiveStep(index);
    setProgressKey((prev) => prev + 1);
  };

  return (
    <section 
      className="relative w-full overflow-hidden py-24 px-4 md:px-12 lg:px-16 bg-transparent min-h-[1100px] md:min-h-[900px] lg:min-h-[850px]" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 text-center">
          <motion.h2 
            className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>
          <motion.p 
            className="mx-auto mt-4 max-w-2xl text-lg md:text-xl font-bold uppercase tracking-widest text-white/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
          <div className={cn(
            "space-y-4",
            "order-2 lg:order-1"
          )}>
            {steps.map((item, index) => (
              <motion.div
                key={index}
                layout
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl border p-6 md:p-8 transition-all duration-500 backdrop-blur-xl",
                  activeStep === index 
                    ? "bg-primary/10 border-primary/50 shadow-[inset_0_1px_0_rgba(var(--primary-rgb),0.3),0_0_30px_rgba(var(--primary-rgb),0.15)]" 
                    : "bg-card/30 border-white/5 hover:border-white/15"
                )}
                onClick={() => handleStepChange(index)}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Rainbow Progress Bar */}
                {activeStep === index && (
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
                        handleStepChange((activeStep + 1) % steps.length);
                      }}
                      style={{
                        position: 'absolute',
                        [isRtl ? "right" : "left"]: 0
                      }}
                    />
                  </div>
                )}

                <div className="flex items-start gap-4 md:gap-6 relative z-10">
                  <div className={cn(
                    "flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-500",
                    activeStep === index 
                      ? "from-primary to-primary/60 text-white scale-110 rotate-3" 
                      : "from-white/10 to-white/5 text-white/30 group-hover:from-white/20 group-hover:text-white/50"
                  )}>
                    <item.Icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <span className={cn(
                      "text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500",
                      activeStep === index ? "text-primary" : "text-white/30"
                    )}>
                      {item.step}
                    </span>
                    <h3 className="mt-1 text-xl md:text-2xl font-black text-white">{item.title}</h3>
                    
                    <div 
                      className={cn(
                        "grid transition-all duration-500 ease-in-out mt-0",
                        activeStep === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-base md:text-lg font-medium leading-relaxed text-white/60">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={cn(
            "relative aspect-[16/10] lg:aspect-square h-full min-h-[250px] md:min-h-[400px] lg:min-h-[600px] overflow-hidden rounded-3xl border border-white/10 bg-black/50 backdrop-blur-3xl",
            "order-1 lg:order-2" 
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full">
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full z-0"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  {/* Subtle overlay to improve text contrast if needed, though here it's purely for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
