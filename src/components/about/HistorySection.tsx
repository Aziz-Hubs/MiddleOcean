import { cn } from "@/lib/utils";

interface HistorySectionProps {
  data?: {
    title?: {
      en: string;
      ar: string;
    };
    content?: {
      en: string;
      ar: string;
    };
  };
  locale: string;
}

export function HistorySection({ data, locale }: HistorySectionProps) {
  const isRtl = locale === "ar";
  const title = data?.title?.[locale as "en" | "ar"] || (isRtl ? "قصتنا" : "Our Story");
  const content = data?.content?.[locale as "en" | "ar"] || (isRtl 
    ? "تأسست ميدل أوشن للطباعة بمهمة واضحة: إحداث ثورة في صناعة مواد الطباعة الرقمية في الأردن والشرق الأوسط. ما بدأ كمبادرة مركزة نما ليصبح نظامًا متكاملاً يخدم أكثر من 2,000 علامة تجارية في جميع أنحاء المنطقة."
    : "Middle Ocean Printing was founded with a clear mission: to revolutionize the digital printing materials industry in Jordan and the Middle East. What began as a focused initiative has grown into a comprehensive ecosystem serving over 2,000 brands across the region."
  );

  return (
    <section className="relative w-full py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(
          "max-w-4xl mx-auto",
          isRtl && "rtl text-right"
        )}>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
