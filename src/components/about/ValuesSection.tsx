"use client";

import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface ValuesSectionProps {
  data?: {
    sectionTitle?: {
      en: string;
      ar: string;
    };
    items?: Array<{
      _key: string;
      title?: {
        en: string;
        ar: string;
      };
      description?: {
        en: string;
        ar: string;
      };
      icon?: string;
    }>;
  };
  locale: string;
}

// Dynamic icon renderer
function IconComponent({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={className} /> : null;
}

export function ValuesSection({ data, locale }: ValuesSectionProps) {
  const isRtl = locale === "ar";
  const sectionTitle = data?.sectionTitle?.[locale as "en" | "ar"] || (isRtl ? "قيمنا" : "Our Values");
  
  // Default values if CMS data is not available
  const defaultValues = [
    {
      _key: "1",
      title: { en: "Quality First", ar: "الجودة أولاً" },
      description: { 
        en: "Premium products from trusted global brands like Mimaki, Epson, Canon, and Konica Minolta",
        ar: "منتجات ممتازة من علامات تجارية عالمية موثوقة مثل Mimaki وEpson وCanon وKonica Minolta"
      },
      icon: "Shield",
    },
    {
      _key: "2",
      title: { en: "Customer Success", ar: "نجاح العميل" },
      description: { 
        en: "Over 2,000 brands trust us—we're invested in your growth and success",
        ar: "أكثر من 2000 علامة تجارية تثق بنا—نحن مستثمرون في نموك ونجاحك"
      },
      icon: "Users",
    },
    {
      _key: "3",
      title: { en: "Innovation", ar: "الابتكار" },
      description: { 
        en: "Three specialized brands (OceanTeck, OceanJett, Middle Ocean) driving continuous improvement",
        ar: "ثلاث علامات تجارية متخصصة (OceanTeck و OceanJett و Middle Ocean) تقود التحسين المستمر"
      },
      icon: "Lightbulb",
    },
    {
      _key: "4",
      title: { en: "Partnership", ar: "الشراكة" },
      description: { 
        en: "Long-term relationships built on trust, reliability, and mutual success",
        ar: "علاقات طويلة الأمد مبنية على الثقة والموثوقية والنجاح المتبادل"
      },
      icon: "Handshake",
    },
    {
      _key: "5",
      title: { en: "Regional Expertise", ar: "الخبرة الإقليمية" },
      description: { 
        en: "Deep understanding of Middle East market needs and local business practices",
        ar: "فهم عميق لاحتياجات سوق الشرق الأوسط والممارسات التجارية المحلية"
      },
      icon: "Globe",
    },
    {
      _key: "6",
      title: { en: "Reliability", ar: "الموثوقية" },
      description: { 
        en: "Consistent quality, dependable delivery, and expert technical support you can count on",
        ar: "جودة متسقة وتسليم موثوق ودعم فني خبير يمكنك الاعتماد عليه"
      },
      icon: "CheckCircle",
    },
  ];

  const values = data?.items?.length ? data.items : defaultValues;

  return (
    <section className="relative w-full py-20 md:py-28 bg-background">
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
              ? "المبادئ التي توجه كل ما نقوم به"
              : "The principles that guide everything we do"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value) => (
            <div
              key={value._key}
              className={cn(
                "group relative p-6 md:p-8 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-300",
                isRtl && "rtl text-right"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <IconComponent 
                    name={value.icon || "Star"} 
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title?.[locale as "en" | "ar"]}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description?.[locale as "en" | "ar"]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
