"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { RainbowButton } from "@/components/ui/rainbow-button"
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
  useRainbow?: boolean
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
  useRainbow = false,
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

  const buttonContent = (
    <>
      <MessageSquareText className="size-4" />
      {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
    </>
  )

  const dialog = (
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
  )

  if (useRainbow) {
    return (
      <>
        <RainbowButton onClick={() => setIsDialogOpen(true)} className={cn("gap-2 print:hidden", className)}>
          {buttonContent}
        </RainbowButton>
        {dialog}
      </>
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
            "w-full sm:w-auto gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 print:hidden",
            className
          )}
        >
          {buttonContent}
        </Button>
      </motion.div>
      {dialog}
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
  const [breadcrumbHeight, setBreadcrumbHeight] = useState(44)
  const [isOverFooter, setIsOverFooter] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stickyTop = 57 + breadcrumbHeight

  useEffect(() => {
    const breadcrumbBar = document.querySelector('[data-breadcrumb-bar]')
    
    if (!breadcrumbBar) return
    
    const updateHeight = () => {
      const rect = breadcrumbBar.getBoundingClientRect()
      const height = Math.max(44, rect.height)
      setBreadcrumbHeight(height)
    }
    
    updateHeight()
    
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(breadcrumbBar)
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setIsOverFooter(false)
      return
    }

    const footer = document.querySelector('[data-footer]')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverFooter(entry.isIntersecting)
      },
      {
        rootMargin: "100px 0px 0px 0px",
        threshold: 0,
      }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showHeader = isVisible && !(isMobile && isOverFooter)

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg transition-all duration-300 transform print:hidden",
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
      style={{ top: `${stickyTop}px` }}
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
          useRainbow={true}
        />
      </div>
    </div>
  )
}
