"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Printer, MessageSquareText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"

export function PrintBrochureButton({ className }: { className?: string }) {
  const t = useTranslations("Navigation")
  
  return (
    <Button 
      variant="outline" 
      onClick={() => window.print()}
      className={cn("w-full sm:w-auto gap-2 border-white/10 hover:bg-white/5 cursor-pointer print:hidden", className)}
    >
      <Printer className="size-4" />
      <span className="max-sm:hidden">Print Brochure</span>
      <span className="sm:hidden">Print</span>
    </Button>
  )
}

import { buttonVariants } from "@/components/ui/button"

export function RequestQuoteButton({ className, locale }: { className?: string, locale: string }) {
  return (
    <Link 
      href="/contact" 
      className={cn(buttonVariants({ variant: "default" }), "gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 print:hidden", className)}
    >
      <MessageSquareText className="size-4" />
      {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
    </Link>
  )
}

export function StickyHeader({ title, locale }: { title: string, locale: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past initial hero area
      setIsVisible(window.scrollY > 200)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className={cn(
        // top-[101px] = 57px navbar + ~44px breadcrumb bar (minus 1px to overlap border)
        "fixed top-[101px] left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg transition-all duration-300 transform print:hidden",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <h3 className="font-bold text-base truncate">{title}</h3>
        <RequestQuoteButton locale={locale} className="shrink-0 h-9 px-4 text-xs" />
      </div>
    </div>
  )
}
