"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
        {/* Section Header */}
        <div className={cn(
          "text-center mb-12 md:mb-16 max-w-2xl mx-auto",
          isRtl && "rtl"
        )}>
          <Badge variant="secondary" className="mb-4">
            {isRtl ? "مبادئنا" : "Our Principles"}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg">
            {isRtl
              ? "المبادئ التي توجه كل ما نقوم به"
              : "The principles that guide everything we do"
            }
          </p>
          <Separator className="mt-6 w-24 mx-auto" />
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card
              key={value._key}
              className={cn(
                "group transition-all duration-300 hover:shadow-md hover:border-primary/30",
                isRtl && "rtl text-right"
              )}
            >
              <CardHeader>
                <div className={cn(
                  "flex items-start gap-4",
                  isRtl && "flex-row-reverse"
                )}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent
                      name={value.icon || "Star"}
                      className="h-6 w-6 text-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {value.title?.[locale as "en" | "ar"]}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {value.description?.[locale as "en" | "ar"]}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
