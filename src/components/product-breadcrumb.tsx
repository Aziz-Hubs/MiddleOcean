"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "@/i18n/routing"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductBreadcrumbProps {
  locale: string
  category: string
  categoryTitle: string
  productTitle: string
}

export function ProductBreadcrumb({
  locale,
  category,
  categoryTitle,
  productTitle,
}: ProductBreadcrumbProps) {
  const t = useTranslations("Navigation")
  const isRtl = locale === "ar"
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight
  const [isOverFooter, setIsOverFooter] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

    const footer = document.querySelector("[data-footer]")
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

  return (
    <div
      data-breadcrumb-bar
      className={cn(
        "border-b border-border/40 bg-background/95 backdrop-blur-md py-3 print:hidden z-40",
        isMobile && isOverFooter ? "static" : "sticky top-[57px]"
      )}
    >
      <div className="container mx-auto px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronIcon className="size-4 opacity-40" />
            </BreadcrumbSeparator>

            {categoryTitle && category !== "all" ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/products" />}>
                    {t("products_title")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronIcon className="size-4 opacity-40" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={`/products/${category}`}/>}>
                    <span className="capitalize">{categoryTitle}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/products" />}>
                  {t("products_title")}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            <BreadcrumbSeparator>
              <ChevronIcon className="size-4 opacity-40" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground line-clamp-1 max-w-[200px] lg:max-w-[400px]">
                {productTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}