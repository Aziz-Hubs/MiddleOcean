"use client"

import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"

/**
 * StickyBreadcrumbContainer
 * 
 * Provides a sticky container for breadcrumbs that is transparent at the top
 * and gains a blurred/prominent background upon scrolling (matching the navbar behavior).
 */
export function StickyBreadcrumbContainer({ children }: { children: React.ReactNode }) {
  const scrolled = useScroll(20) // Slightly higher threshold than navbar for a staggered effect if desired

  return (
    <div 
      className={cn(
        "sticky top-16 z-20 border-b transition-all duration-300 py-4",
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-border" 
          : "bg-transparent border-border"
      )}
    >
      <div className="container mx-auto px-6">
        {children}
      </div>
    </div>
  )
}
