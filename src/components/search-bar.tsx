"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductSearch } from "@/components/product-search";
import { sanityClient } from "@/sanity/client";
import { productNamesForPlaceholderQuery } from "@/sanity/queries";

interface ProductName {
  en: string;
  ar?: string;
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [productNames, setProductNames] = useState<ProductName[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("Search");
  const isRtl = locale === "ar";

  // Fetch product names for placeholder
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const names = await sanityClient.fetch(productNamesForPlaceholderQuery);
        if (names && names.length > 0) {
          setProductNames(names);
        }
      } catch (error) {
        console.error("Failed to fetch product names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductNames();
  }, []);

  // Cycle through product names
  useEffect(() => {
    if (productNames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productNames.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [productNames.length]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCurrentPlaceholder = useCallback(() => {
    if (productNames.length === 0) return t("placeholder");
    const product = productNames[currentIndex];
    return product[locale] || product.en || t("placeholder");
  }, [productNames, currentIndex, locale, t]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex items-center gap-3 rounded-full border border-input bg-background px-4 py-2.5 text-sm text-muted-foreground shadow-sm transition-all",
          "hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isRtl && "flex-row-reverse font-sans",
          className
        )}
        aria-label={t("triggerAriaLabel")}
      >
        <Search className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors",
          isRtl ? "order-1" : "order-0"
        )} />
        
        <div className={cn(
          "relative h-5 overflow-hidden min-w-[180px] text-left",
          isRtl && "text-right"
        )}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center truncate"
            >
              {isLoading ? t("placeholder") : getCurrentPlaceholder()}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>

      <ProductSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
