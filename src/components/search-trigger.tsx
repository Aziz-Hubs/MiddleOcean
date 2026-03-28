"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/product-search";

interface SearchTriggerProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function SearchTrigger({
  variant = "ghost",
  size = "icon",
  className,
  showText = false,
}: SearchTriggerProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Search");

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn(
          "relative",
          showText && "gap-2 px-3",
          className
        )}
        aria-label={t("triggerAriaLabel")}
      >
        <Search className="h-4 w-4" />
        {showText && <span className="hidden sm:inline">{t("triggerText")}</span>}
        
        {/* Keyboard shortcut hint - hidden on mobile */}
        <span className={cn(
          "hidden lg:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground",
          locale === "ar" ? "mr-2" : "ml-2"
        )}>
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </span>
      </Button>

      <ProductSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
