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
  const sanitizedQuery = query
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .trim();

  if (sanitizedQuery.length === 0) {
    return [];
  }

  try {
    // Use the appropriate query based on locale
    const searchQuery = locale === "ar" ? searchProductsQueryAr : searchProductsQueryEn;
    
    const results = await sanityClient.fetch(searchQuery, {
      searchTerm: sanitizedQuery.toLowerCase(),
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
