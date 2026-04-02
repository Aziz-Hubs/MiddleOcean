"use client"

import { useState } from "react"
import { sanityClient } from "@/sanity/client"
import { productReviewsPagedQuery } from "@/sanity/queries"
import { Star, ChevronLeft, ChevronRight, Quote, Building2, MessageSquareDashed } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ─── Types ──────────────────────────────────────────────────────────────────

interface Review {
  _id: string
  companyName: { en?: string; ar?: string } | string
  companyLogoUrl?: string
  reviewText: { en?: string; ar?: string } | string
  rating: number
  reviewerName?: { en?: string; ar?: string } | string
  date?: string
}

interface ProductReviewsProps {
  productId: string
  locale: string
  initialReviews: Review[]
  totalCount: number
}

const REVIEWS_PER_PAGE = 2

// ─── Static placeholder reviews ───────────────────────────────────────────────

const PLACEHOLDER_REVIEWS_EN: Review[] = [
  {
    _id: "ph-1",
    companyName: "Al-Rashid Print Co.",
    reviewText: "Outstanding quality materials and incredibly fast delivery. The UV DTF films transformed our production output — our clients immediately noticed the improvement in print durability. The team at Middle Ocean is exceptional and always goes the extra mile to ensure our projects are successful. Highly recommended for any professional printing business looking for a reliable partner.",
    rating: 5,
    reviewerName: "Mohammed Al-Rashid, Production Director",
    date: "2025-11-01",
  },
  {
    _id: "ph-2",
    companyName: "Horizon Visual LLC",
    reviewText: "We've been sourcing from Middle Ocean for over two years. Consistent quality, excellent technical support, and a team that genuinely understands B2B needs. Their expertise in wide-format printing is unmatched in the region. We look forward to many more years of successful collaboration.",
    rating: 5,
    reviewerName: "Sara Khalil, Procurement Manager",
    date: "2025-09-15",
  },
  {
    _id: "ph-3",
    companyName: "Delta Advertising Group",
    reviewText: "The acrylic sheets are flawless — cut perfectly to spec with zero edge defects. Turnaround time beats every other supplier we've tried in the region. Their attention to detail and commitment to quality is evident in every batch we receive.",
    rating: 4,
    reviewerName: "Tariq Nasser, Operations Lead",
    date: "2025-07-22",
  },
]

const PLACEHOLDER_REVIEWS_AR: Review[] = [
  {
    _id: "ph-1",
    companyName: "شركة الراشد للطباعة",
    reviewText: "جودة مواد استثنائية وتسليم سريع للغاية. لقد حوّلت أفلام UV DTF إنتاجنا بالكامل — لاحظ عملاؤنا فوراً التحسن في متانة الطباعة. فريق ميدل أوشن استثنائي ويبذل دائماً قصارى جهده لضمان نجاح مشاريعنا. نوصي بهم بشدة لأي عمل طباعة احترافي يبحث عن شريك موثوق.",
    rating: 5,
    reviewerName: "محمد الراشد، مدير الإنتاج",
    date: "2025-11-01",
  },
  {
    _id: "ph-2",
    companyName: "هورايزون فيجوال",
    reviewText: "نتعامل مع ميدل أوشن منذ أكثر من عامين. جودة ثابتة، ودعم فني ممتاز، وفريق يفهم حقاً متطلبات قطاع الأعمال. خبرتهم في الطباعة ذات التنسيق العريض لا مثيل لها في المنطقة. نتطلع إلى سنوات عديدة أخرى من التعاون الناجح.",
    rating: 5,
    reviewerName: "سارة خليل، مديرة المشتريات",
    date: "2025-09-15",
  },
  {
    _id: "ph-3",
    companyName: "مجموعة دلتا للإعلان",
    reviewText: "الألواح الأكريليك لا تشوبها شائبة — مقطوعة بدقة تامة دون أي عيوب على الحواف. وقت التسليم يتفوق على جميع الموردين الآخرين في المنطقة. اهتمامهم بالتفاصيل والتزامهم بالجودة واضحان في كل دفعة نستلمها.",
    rating: 4,
    reviewerName: "طارق ناصر، مسؤول العمليات",
    date: "2025-07-22",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveLocale(field: unknown, locale: string): string {
  if (!field) return ""
  if (typeof field === "string") return field
  const record = field as Record<string, string>
  return record[locale] || record["en"] || ""
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-zinc-600"
          )}
        />
      ))}
    </div>
  )
}

// ─── Empty slot ───────────────────────────────────────────────────────────────

function EmptySlot({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/30 bg-white/[0.01] p-10 min-h-[280px]">
      <MessageSquareDashed className="size-8 text-zinc-700" aria-hidden />
      <p className="text-sm text-muted-foreground/50 text-center">
        {locale === "ar" ? "لا توجد مراجعات أخرى\nفي هذه الصفحة" : "No more reviews\non this page"}
      </p>
    </div>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review, locale, isPlaceholder }: { review: Review; locale: string; isPlaceholder?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const tr = useTranslations("Reviews")
  
  const company = resolveLocale(review.companyName, locale)
  const text = resolveLocale(review.reviewText, locale)
  const reviewer = resolveLocale(review.reviewerName, locale)

  const dateLabel = review.date
    ? new Date(review.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
      })
    : null

  const isLongText = text.length > 150

  return (
    <>
      <div 
        onClick={() => isLongText && setIsOpen(true)}
        className={cn(
          "relative flex flex-col gap-4 rounded-2xl border border-border/40 overflow-hidden",
          "bg-background/40 backdrop-blur-md p-6 lg:p-7",
          "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20",
          "print:border-zinc-200 print:bg-transparent min-h-[240px] lg:h-[280px] w-full group",
          isPlaceholder && "opacity-90",
          isLongText && "cursor-pointer"
        )}
      >
        {/* Decorative quote */}
        <Quote className="absolute top-6 end-6 size-8 text-white/[0.03] transition-colors group-hover:text-white/[0.08]" aria-hidden />

        <div className="flex flex-col gap-3 flex-1 overflow-hidden">
          <StarRow rating={review.rating} />

          <div className="relative flex-1 overflow-hidden">
            <blockquote className={cn(
              "text-sm lg:text-base text-muted-foreground leading-relaxed font-light break-words",
              locale === "ar" && "font-arabic text-right"
            )}>
              &ldquo;{text.length > 160 ? text.substring(0, 160) + "..." : text}&rdquo;
            </blockquote>
          </div>
          
          {isLongText && (
            <button 
              className={cn(
                "text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-start",
                locale === "ar" && "font-arabic"
              )}
            >
              {tr("readMore")}
            </button>
          )}
        </div>

        <footer className="flex items-center gap-4 pt-4 border-t border-border/20 mt-auto">
          <div className="shrink-0 size-10 rounded-xl border border-border/40 bg-white/5 overflow-hidden flex items-center justify-center">
            {review.companyLogoUrl ? (
              <Image
                src={review.companyLogoUrl}
                alt={`${company} logo`}
                width={40}
                height={40}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="size-4 text-zinc-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("font-semibold text-sm text-foreground truncate", locale === "ar" && "font-arabic")}>
              {company}
            </p>
            {reviewer && (
              <p className={cn("text-[11px] text-muted-foreground/60 truncate mt-0.5", locale === "ar" && "font-arabic")}>
                {reviewer}
              </p>
            )}
          </div>
          {dateLabel && <p className="text-[10px] text-muted-foreground/30 tabular-nums shrink-0">{dateLabel}</p>}
        </footer>

        {isPlaceholder && (
          <span className="absolute bottom-2 end-3 text-[8px] font-mono text-zinc-700 opacity-50 uppercase tracking-[0.2em] pointer-events-none">
            {locale === "ar" ? "عرض توضيحي" : "Sample"}
          </span>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(
          "sm:max-w-[550px] border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl p-0 overflow-hidden rounded-3xl",
          locale === "ar" && "rtl"
        )}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-8 lg:p-10 space-y-8">
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <StarRow rating={review.rating} />
                  <Quote className="size-8 text-white/10" aria-hidden />
                </div>
                <DialogTitle className={cn(
                  "text-xl lg:text-2xl font-black uppercase tracking-tight text-white leading-tight",
                  locale === "ar" && "font-arabic text-right leading-relaxed"
                )}>
                  {tr("fullReview")}
                </DialogTitle>
              </DialogHeader>

              <div className={cn(
                "text-base lg:text-lg text-zinc-300 leading-relaxed font-light whitespace-pre-wrap max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar",
                locale === "ar" && "font-arabic text-right"
              )}>
                &ldquo;{text}&rdquo;
              </div>

              <footer className="flex items-center gap-5 pt-8 border-t border-white/10">
                <div className="shrink-0 size-14 rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                  {review.companyLogoUrl ? (
                    <Image
                      src={review.companyLogoUrl}
                      alt={`${company} logo`}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <Building2 className="size-6 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-lg text-white truncate", locale === "ar" && "font-arabic")}>
                    {company}
                  </p>
                  {reviewer && (
                    <p className={cn("text-sm text-zinc-400 truncate mt-1", locale === "ar" && "font-arabic")}>
                      {reviewer}
                    </p>
                  )}
                  {dateLabel && <p className="text-[11px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">{dateLabel}</p>}
                </div>
              </footer>
            </div>
            
            <div className="bg-white/5 p-4 flex justify-end px-8">
               <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-full px-8 border-white/10 hover:bg-white/10 cursor-pointer">
                  {tr("close")}
               </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductReviews({ productId, locale, initialReviews, totalCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const isRtl = locale === "ar"
  const isPlaceholder = totalCount === 0

  // Source data per mode
  const allPlaceholders = isRtl ? PLACEHOLDER_REVIEWS_AR : PLACEHOLDER_REVIEWS_EN
  const totalPages = isPlaceholder
    ? Math.ceil(allPlaceholders.length / REVIEWS_PER_PAGE)   // 3 → 2 pages
    : Math.ceil(totalCount / REVIEWS_PER_PAGE)

  const displayReviews = isPlaceholder
    ? allPlaceholders.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE)
    : reviews

  const isLastPage = currentPage === totalPages
  const hasEmptySlot = isLastPage && (
    isPlaceholder
      ? allPlaceholders.length % REVIEWS_PER_PAGE !== 0
      : totalCount % REVIEWS_PER_PAGE !== 0
  )

  const goToPage = async (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return

    if (isPlaceholder) {
      setCurrentPage(page)
      return
    }

    setIsLoading(true)
    try {
      const start = (page - 1) * REVIEWS_PER_PAGE
      const end = start + REVIEWS_PER_PAGE
      const data: Review[] = await sanityClient.fetch(productReviewsPagedQuery, {
        productId,
        start,
        end,
      })
      setReviews(data)
      setCurrentPage(page)
    } catch (err) {
      console.error("Failed to fetch reviews:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <section className="space-y-8 print:hidden">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground", locale === "ar" && "font-arabic")}
          >
            {isRtl ? "آراء العملاء" : "Client Reviews"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-2 font-light"
          >
            {isPlaceholder
              ? (isRtl ? "أمثلة على مراجعات موثقة لتوضيح مستوى الخدمة" : "Sample verified reviews from our strategic partners")
              : (isRtl ? `${totalCount} مراجعة موثقة` : `${totalCount} verified review${totalCount !== 1 ? "s" : ""}`)}
          </motion.p>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
               {isRtl ? "صفحة" : "Page"}
             </span>
             <span className="text-xl font-black tabular-nums text-primary/80">
              {isRtl ? `${currentPage}/${totalPages}` : `${currentPage}/${totalPages}`}
            </span>
          </div>
        )}
      </div>

      {/* Grid reviews — fixed height container to prevent layout shifts */}
      <div className={cn(
        "relative flex flex-col gap-5 transition-opacity duration-300 min-h-[420px] lg:min-h-[580px]",
        isLoading && "opacity-40 pointer-events-none"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            {displayReviews.map((review) => (
              <ReviewCard key={review._id} review={review} locale={locale} isPlaceholder={isPlaceholder} />
            ))}
            {hasEmptySlot && <EmptySlot locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="size-10 rounded-full border-white/10 hover:bg-white/5 transition-all p-0"
            aria-label={isRtl ? "الصفحة السابقة" : "Previous page"}
          >
            <PrevIcon className="size-5" />
          </Button>

          <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  disabled={isLoading}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={cn(
                    "size-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer",
                    currentPage === page
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "hover:bg-white/10 text-muted-foreground/60"
                  )}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="size-10 rounded-full border-white/10 hover:bg-white/5 transition-all p-0"
            aria-label={isRtl ? "الصفحة التالية" : "Next page"}
          >
            <NextIcon className="size-5" />
          </Button>
        </div>
      )}
    </section>
  )
}
