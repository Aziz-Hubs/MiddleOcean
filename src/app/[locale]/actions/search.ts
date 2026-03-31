"use server";

import { sanityClient } from "@/sanity/client";
import { searchProductsQueryEn, searchProductsQueryAr, recentProductsQuery } from "@/sanity/queries";
import { SanityProduct } from "@/sanity/types";

export type SearchResult = SanityProduct;

export async function searchProducts(
  query: string,
  locale: "en" | "ar" = "en"
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Sanitize search term - escape special GROQ characters
  // Only escape quotes and backslashes, preserve spaces and other characters
  const sanitizedQuery = query
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .trim();

  if (sanitizedQuery.length === 0) {
    return [];
  }

  try {
    // Use the appropriate query based on locale
    const searchQuery = locale === "ar" ? searchProductsQueryAr : searchProductsQueryEn;
    
    // GROQ match operator: "term*" does prefix matching (finds "drill" in "drills", "drilling")
    // This is better than "*term*" which searches for literal asterisks
    // The match operator is case-insensitive and tokenizes text for word-based search
    const searchTerm = sanitizedQuery + "*";
    
    const results = await sanityClient.fetch(searchQuery, {
      searchTerm,
    });

    return results || [];
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Failed to search products");
  }
}

export async function getRecentProducts(
  locale: "en" | "ar" = "en"
): Promise<SanityProduct[]> {
  try {
    const results = await sanityClient.fetch(recentProductsQuery);
    return results || [];
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return [];
  }
}
