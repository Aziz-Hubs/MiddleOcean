"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { MessageSquareText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { QuoteRequestDialog } from "./quote-request-dialog"
import { motion } from "framer-motion"

export function DownloadBrochureButton({ 
  className, 
  productSlug 
}: { 
  className?: string, 
  productSlug: string 
}) {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/product-brochure?product=${productSlug}&locale=${locale}`)
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brochure-${productSlug}-${locale}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert(locale === 'ar' ? 'فشل تحميل الكتيب' : 'Failed to download brochure')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload}
      disabled={isDownloading}
      className={cn("w-full sm:w-auto gap-2 border-white/10 hover:bg-white/5 cursor-pointer print:hidden", className)}
    >
      {isDownloading ? (
        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Download className="size-4" />
      )}
      <span>{isDownloading ? (locale === 'ar' ? 'جاري التحميل...' : 'Downloading...') : t("print_brochure")}</span>
    </Button>
  )
}

import { buttonVariants } from "@/components/ui/button"

interface RequestQuoteButtonProps {
  className?: string
  locale: string
  productId?: string
  productName?: string
  productNameAr?: string
  productSlug?: string
  category?: string
  categoryAr?: string
}

export function RequestQuoteButton({ 
  className, 
  locale,
  productId,
  productName,
  productNameAr,
  productSlug,
  category,
  categoryAr,
}: RequestQuoteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // If we don't have product details, fall back to the contact page link
  const hasProductDetails = productId && productName && productSlug && category
  
  if (!hasProductDetails) {
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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => setIsDialogOpen(true)}
          className={cn(
            "gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 print:hidden",
            className
          )}
        >
          <MessageSquareText className="size-4" />
          {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
        </Button>
      </motion.div>
      
      <QuoteRequestDialog
        productId={productId}
        productName={productName}
        productNameAr={productNameAr || productName}
        productSlug={productSlug}
        category={category}
        categoryAr={categoryAr || category}
        locale={locale}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}

export function StickyHeader({ 
  title, 
  locale,
  productId,
  productSlug,
  category,
  productNameAr,
  categoryAr
}: { 
  title: string
  locale: string
  productId?: string
  productSlug?: string
  category?: string
  productNameAr?: string
  categoryAr?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className={cn(
        "sticky top-[44px] left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg transition-all duration-300 transform print:hidden",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <h3 className="font-bold text-base truncate">{title}</h3>
        <RequestQuoteButton 
          locale={locale} 
          className="shrink-0 h-9 px-4 text-xs"
          productId={productId}
          productName={title}
          productNameAr={productNameAr}
          productSlug={productSlug}
          category={category}
          categoryAr={categoryAr}
        />
      </div>
    </div>
  )
}
