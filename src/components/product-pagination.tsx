"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/routing"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface ProductPaginationProps {
  totalPages: number
  currentPage: number
  locale: string
}

export function ProductPagination({
  totalPages,
  currentPage,
  locale,
}: ProductPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isRtl = locale === "ar"

  if (totalPages <= 1) return null

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const showMax = 5

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show page 1
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis-start")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end")
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    return pages
  }

  const translations = {
    en: {
      previous: "Previous",
      next: "Next",
    },
    ar: {
      previous: "السابق",
      next: "التالي",
    },
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            text={t.previous}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                asChild
              >
                <Link href={createPageURL(page)}>{page}</Link>
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
            asChild
          >
            <Link href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}>
              <span className="hidden sm:block">{t.next}</span>
              <ChevronRightIcon className="rtl:rotate-180" data-icon="inline-end" />
            </Link>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
