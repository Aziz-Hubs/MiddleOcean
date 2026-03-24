"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScaleIcon, CogIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function NotAnOfferBlock({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-12 border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden shadow-lg shadow-primary/5">
        <CardContent className="p-6 relative">
          <div className="absolute inset-y-0 start-0 w-1 bg-primary" />
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <ScaleIcon className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                {title}
              </h3>
              <p className="text-muted-foreground leading-relaxed italic">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TechSpecsBlock({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "backOut" }}
      className="mb-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 end-0 p-8 opacity-10">
        <CogIcon className="size-24 animate-spin-slow" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <CogIcon className="size-6 text-cyan-400" />
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed font-mono text-sm max-w-2xl">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function BrandGrid({ images, title, description }: { images: { url: string; altText: string }[]; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="mb-12 py-8 px-6 rounded-2xl border border-border bg-muted/30"
    >
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheckIcon className="size-5 text-primary" />
        <h3 className="font-bold tracking-tight">{title}</h3>
        <div className="h-px flex-1 bg-border" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {images.map((img, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: idx * 0.05 }}
            className="group relative aspect-video flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={img.url}
              alt={img.altText}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground text-center italic">
        {description}
      </p>
    </motion.div>
  );
}
