"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, PrinterIcon, DownloadIcon, HelpCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const t = useTranslations("Legal");
  const handlePrint = () => window.print();
  const handleDownload = () => {
    // In a real app, this might fetch a PDF or trigger a print-to-pdf
    window.print();
  };

  return (
    <div className="fixed bottom-8 end-8 z-50 flex flex-col gap-3 print:hidden">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, y: 20, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           className="flex flex-col gap-3 items-end"
        >
          <Button 
            variant="secondary" 
            size="icon" 
            className="size-12 rounded-full shadow-2xl hover:shadow-primary/20 transition-all group overflow-hidden relative"
            onClick={handlePrint}
          >
            <PrinterIcon className="size-5 group-hover:scale-110 transition-transform" />
            <span className="sr-only">Print</span>
          </Button>
          
          <Button 
            className="h-12 px-6 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all group overflow-hidden relative shadow-primary/20"
            onClick={() => {
              const contactBtn = document.getElementById("legal-inquiry-btn");
              contactBtn?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <HelpCircleIcon className="size-4 me-2 group-hover:rotate-12 transition-transform" />
            {t('legalInquiry')}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function DownloadCTA() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="hidden sm:flex gap-2 text-xs font-semibold uppercase tracking-wider h-8"
      onClick={() => window.print()}
    >
      <DownloadIcon className="size-3" />
      {useTranslations("Legal")('downloadPDF')}
    </Button>
  );
}
