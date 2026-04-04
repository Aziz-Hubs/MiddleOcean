"use client";

import { cn } from "@/lib/utils";
import { Calendar, Rocket } from "lucide-react";

interface TimelineSectionProps {
  data?: {
    sectionTitle?: {
      en: string;
      ar: string;
    };
    events?: Array<{
      _key: string;
      year: number;
      title?: {
        en: string;
        ar: string;
      };
      description?: {
        en: string;
        ar: string;
      };
      isFuture: boolean;
    }>;
  };
  locale: string;
}

export function TimelineSection({ data, locale }: TimelineSectionProps) {
  const isRtl = locale === "ar";
  const sectionTitle = data?.sectionTitle?.[locale as "en" | "ar"] || (isRtl ? "مسيرتنا" : "Our Journey");
  
  // Default timeline events if CMS data is not available
  const defaultEvents = [
    {
      _key: "1",
      year: 2015,
      title: { en: "Founded in Amman", ar: "التأسيس في عمان" },
      description: { 
        en: "Middle Ocean Printing established as a digital printing materials distributor",
        ar: "تأسست ميدل أوشن للطباعة كموزع لمواد الطباعة الرقمية"
      },
      isFuture: false,
    },
    {
      _key: "2",
      year: 2017,
      title: { en: "Regional Expansion", ar: "التوسع الإقليمي" },
      description: { 
        en: "Expanded operations to serve customers across Jordan and the region",
        ar: "توسيع العمليات لخدمة العملاء في جميع أنحاء الأردن والمنطقة"
      },
      isFuture: false,
    },
    {
      _key: "3",
      year: 2019,
      title: { en: "Brand Portfolio Launch", ar: "إطلاق محفظة العلامات التجارية" },
      description: { 
        en: "Introduced OceanTeck and OceanJett as proprietary brands",
        ar: "تقديم OceanTeck و OceanJett كعلامات تجارية خاصة"
      },
      isFuture: false,
    },
    {
      _key: "4",
      year: 2021,
      title: { en: "1,000+ Brands", ar: "1000+ علامة تجارية" },
      description: { 
        en: "Reached milestone of serving over 1,000 satisfied brands",
        ar: "الوصول إلى إنجاز خدمة أكثر من 1,000 علامة تجارية راضية"
      },
      isFuture: false,
    },
    {
      _key: "5",
      year: 2024,
      title: { en: "2,000+ Brands", ar: "2000+ علامة تجارية" },
      description: { 
        en: "Expanded to serve over 2,000 brands with 70+ products",
        ar: "التوسع لخدمة أكثر من 2,000 علامة تجارية بأكثر من 70 منتج"
      },
      isFuture: false,
    },
    {
      _key: "6",
      year: 2025,
      title: { en: "Showroom Expansion", ar: "توسيع المعرض" },
      description: { 
        en: "Opening expanded showroom and logistics facilities in Amman",
        ar: "افتتاح مرافق عرض ولوجستيات موسعة في عمان"
      },
      isFuture: true,
    },
    {
      _key: "7",
      year: 2026,
      title: { en: "Regional Hub", ar: "مركز إقليمي" },
      description: { 
        en: "Establishing regional distribution centers for faster delivery",
        ar: "إنشاء مراكز توزيع إقليمية لتسليم أسرع"
      },
      isFuture: true,
    },
  ];

  const events = data?.events?.length ? data.events : defaultEvents;

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(
          "text-center mb-12 md:mb-16",
          isRtl && "rtl"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isRtl 
              ? "من بدايات متواضعة إلى ريادة الصناعة"
              : "From humble beginnings to industry leadership"
            }
          </p>
        </div>

        {/* Horizontal Timeline - Desktop */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            
            {/* Events */}
            <div className="relative flex justify-between items-start pt-8">
              {events.map((event, index) => (
                <div
                  key={event._key}
                  className={cn(
                    "relative flex flex-col items-center",
                    isRtl && "rtl"
                  )}
                  style={{ width: `${100 / events.length}%` }}
                >
                  {/* Marker */}
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      event.isFuture
                        ? "border-dashed border-primary/50 bg-background"
                        : "border-primary bg-primary text-primary-foreground"
                    )}
                  >
                    {event.isFuture ? (
                      <Rocket className="h-4 w-4 text-primary/70" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "mt-4 text-center px-2",
                    isRtl && "text-right"
                  )}>
                    <span className={cn(
                      "inline-block text-sm font-bold mb-2",
                      event.isFuture ? "text-primary/70" : "text-primary"
                    )}>
                      {event.year}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                      {event.title?.[locale as "en" | "ar"]}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.description?.[locale as "en" | "ar"]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Timeline - Mobile */}
        <div className="md:hidden">
          <div className="relative">
            {/* Timeline Line */}
            <div className={cn(
              "absolute top-0 bottom-0 w-0.5 bg-border",
              isRtl ? "right-5" : "left-5"
            )} />

            {/* Events */}
            <div className="space-y-8">
              {events.map((event) => (
                <div
                  key={event._key}
                  className={cn(
                    "relative flex items-start gap-4",
                    isRtl && "rtl flex-row-reverse"
                  )}
                >
                  {/* Marker */}
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                      event.isFuture
                        ? "border-dashed border-primary/50 bg-background"
                        : "border-primary bg-primary text-primary-foreground"
                    )}
                  >
                    {event.isFuture ? (
                      <Rocket className="h-4 w-4 text-primary/70" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "flex-1 pt-1",
                    isRtl && "text-right"
                  )}>
                    <span className={cn(
                      "inline-block text-sm font-bold mb-1",
                      event.isFuture ? "text-primary/70" : "text-primary"
                    )}>
                      {event.year}
                    </span>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {event.title?.[locale as "en" | "ar"]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description?.[locale as "en" | "ar"]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
