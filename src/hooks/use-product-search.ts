"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { searchProducts, getRecentProducts, SearchResult } from "@/app/[locale]/actions/search";
import { SanityProduct } from "@/sanity/types";

interface UseProductSearchOptions {
  locale: "en" | "ar";
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseProductSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  recentProducts: SanityProduct[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (term: string) => void;
}

const STORAGE_KEY = "product-search-recent";
const MAX_RECENT_SEARCHES = 5;

export function useProductSearch({
  locale,
  debounceMs = 300,
  minQueryLength = 2,
}: UseProductSearchOptions): UseProductSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentProducts, setRecentProducts] = useState<SanityProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch (e) {
      console.error("Failed to load recent searches:", e);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)));
    } catch (e) {
      console.error("Failed to save recent searches:", e);
    }
  }, []);

  // Add a search term to recent searches
  const addRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updated);
      return updated;
    });
  }, [saveRecentSearches]);

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear recent searches:", e);
    }
  }, []);

  // Remove a specific recent search
  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      saveRecentSearches(updated);
      return updated;
    });
  }, [saveRecentSearches]);

  // Fetch recent products for empty state
  useEffect(() => {
    let mounted = true;
    
    const fetchRecent = async () => {
      try {
        const products = await getRecentProducts(locale);
        if (mounted) {
          setRecentProducts(products);
        }
      } catch (e) {
        console.error("Failed to fetch recent products:", e);
      }
    };

    fetchRecent();
    
    return () => {
      mounted = false;
    };
  }, [locale]);

  // Search effect with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset state if query is too short
    if (!query.trim() || query.trim().length < minQueryLength) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    // Debounced search
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const searchResults = await searchProducts(query.trim(), locale);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, locale, debounceMs, minQueryLength, addRecentSearch]);

  return {
    query,
    setQuery,
    results,
    recentProducts,
    isLoading,
    error,
    hasSearched,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
}
