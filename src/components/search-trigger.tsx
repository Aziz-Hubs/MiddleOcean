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
      </Button>

      <ProductSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
