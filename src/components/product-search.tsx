"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, Clock, TrendingUp, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProductSearch } from "@/hooks/use-product-search";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import { SearchResult } from "@/app/[locale]/actions/search";
import { SanityProduct } from "@/sanity/types";

interface ProductSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSearch({ open, onOpenChange }: ProductSearchProps) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("Search");
  const router = useRouter();

  const {
    query,
    setQuery,
    results,
    recentProducts,
    isLoading,
    error,
    hasSearched,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useProductSearch({ locale });

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(""), 200);
    }
  }, [open, setQuery]);

  const handleSelect = useCallback(
    (product: SearchResult | SanityProduct) => {
      onOpenChange(false);
      const url = `/${locale}/products/${product.category?.slug?.current || "uncategorized"}/${product.slug.current}`;
      router.push(url);
    },
    [locale, onOpenChange, router]
  );

  const handleSubmitSearch = useCallback(() => {
    if (query.trim().length >= 2) {
      addRecentSearch(query.trim());
    }
  }, [query, addRecentSearch]);

  const getLocalizedText = (obj: { en?: string; ar?: string } | undefined) => {
    if (!obj) return "";
    return obj[locale] || obj.en || "";
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      description={t("description")}
      className={cn(
        "sm:max-w-[640px]",
        locale === "ar" && "rtl"
      )}
    >
      <Command
        shouldFilter={false}
        className={cn(
          "overflow-hidden",
          locale === "ar" && "font-sans"
        )}
      >
        <div className="flex items-center border-b px-4 py-4">
          <CommandInput
            placeholder={t("placeholder")}
            value={query}
            onValueChange={setQuery}
            onKeyDown={(e) => {
              // Prevent command palette from interpreting space as selection
              if (e.key === " " || e.code === "Space") {
                e.stopPropagation();
              }
              // Save search query when user presses Enter (explicit submit)
              if (e.key === "Enter" && query.trim().length >= 2) {
                handleSubmitSearch();
              }
            }}
            className={cn(
              "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground",
              locale === "ar" && "text-right"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className={cn(
                "rounded-sm opacity-50 hover:opacity-100",
                locale === "ar" ? "mr-2" : "ml-2"
              )}
              aria-label={t("clear")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <CommandList className="max-h-[60vh] overflow-y-auto px-4 pb-4">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-8 text-center">
              <p className="text-sm text-destructive">{t("error")}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery(query)}
                className="mt-2"
              >
                {t("retry")}
              </Button>
            </div>
          )}

          {/* Empty Search State - Recent Searches */}
          {!isLoading && !error && !query && recentSearches.length > 0 && (
            <CommandGroup heading={t("recentSearches")}>
              {recentSearches.map((term) => (
                <CommandItem
                  key={term}
                  value={`recent-${term}`}
                  onSelect={() => setQuery(term)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{term}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(term);
                    }}
                    className="rounded-sm p-1 hover:bg-muted"
                    aria-label={t("remove")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </CommandItem>
              ))}
              <CommandItem
                value="clear-recent"
                onSelect={clearRecentSearches}
                className="text-muted-foreground"
              >
                {t("clearRecent")}
              </CommandItem>
            </CommandGroup>
          )}

          {/* Empty Search State - Recent Products */}
          {!isLoading && !error && !query && recentProducts.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("recentProducts")}>
                {recentProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    onSelect={() => handleSelect(product)}
                    getLocalizedText={getLocalizedText}
                    locale={locale}
                  />
                ))}
              </CommandGroup>
            </>
          )}

          {/* Search Results */}
          {!isLoading && !error && hasSearched && results.length > 0 && (
            <CommandGroup heading={t("results")}>
              <AnimatePresence>
                {results.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductItem
                      product={product}
                      onSelect={() => handleSelect(product)}
                      getLocalizedText={getLocalizedText}
                      locale={locale}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </CommandGroup>
          )}

          {/* No Results State */}
          {!isLoading && !error && hasSearched && query.length >= 2 && results.length === 0 && (
            <CommandEmpty className="py-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Search className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {t("noResults", { query })}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {t("tryDifferent")}
                </p>
              </div>
            </CommandEmpty>
          )}

          {/* Initial Empty State */}
          {!isLoading && !error && !hasSearched && recentSearches.length === 0 && recentProducts.length === 0 && (
            <div className="py-8 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                {t("startTyping")}
              </p>
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

interface ProductItemProps {
  product: SearchResult | SanityProduct;
  onSelect: () => void;
  getLocalizedText: (obj: { en?: string; ar?: string } | undefined) => string;
  locale: "en" | "ar";
}

function ProductItem({ product, onSelect, getLocalizedText, locale }: ProductItemProps) {
  const title = getLocalizedText(product.title);
  const description = getLocalizedText(product.description);
  const categoryTitle = getLocalizedText(product.category?.title);

  return (
    <CommandItem
      value={product._id}
      onSelect={onSelect}
      className="flex items-center gap-3 py-3 px-2 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          locale === "ar" && "text-right"
        )}>
          {title}
        </p>
        {description && (
          <p className={cn(
            "text-xs text-muted-foreground line-clamp-1 mt-0.5",
            locale === "ar" && "text-right"
          )}>
            {description}
          </p>
        )}
        {categoryTitle && (
          <p className={cn(
            "text-xs text-primary mt-0.5",
            locale === "ar" && "text-right"
          )}>
            {categoryTitle}
          </p>
        )}
      </div>

    </CommandItem>
  );
}
