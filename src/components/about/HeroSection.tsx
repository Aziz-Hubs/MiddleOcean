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
import { Building2 } from "lucide-react";

interface HeroSectionProps {
  data?: {
    title?: {
      en: string;
      ar: string;
    };
    subtitle?: {
      en: string;
      ar: string;
    };
    image?: string;
  };
  locale: string;
}

export function HeroSection({ data, locale }: HeroSectionProps) {
  const isRtl = locale === "ar";
  const title = data?.title?.[locale as "en" | "ar"] || (isRtl ? "من نحن" : "About Us");
  const subtitle = data?.subtitle?.[locale as "en" | "ar"] || (isRtl
    ? "شريكك الموثوق في مواد الطباعة الرقمية"
    : "Your trusted partner in digital printing materials"
  );

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {data?.image ? (
          <>
            <img
              src={data.image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-24 md:py-32 lg:py-40">
        <div className={cn(
          "max-w-4xl mx-auto",
          isRtl && "rtl"
        )}>
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="text-xs">
              <Building2 className="mr-1 h-3 w-3" />
              {isRtl ? "معلومات عنا" : "Company Info"}
            </Badge>
          </div>

          {/* Title Card */}
          <Card className="border-0 bg-background/60 backdrop-blur-sm shadow-none">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decorative Separator */}
      <Separator className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
