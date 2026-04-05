import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

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
          <Card className="border-border/50">
            <CardHeader>
              <div className={cn(
                "flex items-center gap-3",
                isRtl && "flex-row-reverse"
              )}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-3xl md:text-4xl">{title}</CardTitle>
              </div>
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <CardDescription className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {content}
                </CardDescription>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
