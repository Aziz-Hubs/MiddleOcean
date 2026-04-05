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
import { Target, Eye } from "lucide-react";

interface MissionVisionSectionProps {
  data?: {
    missionTitle?: {
      en: string;
      ar: string;
    };
    mission?: {
      en: string;
      ar: string;
    };
    visionTitle?: {
      en: string;
      ar: string;
    };
    vision?: {
      en: string;
      ar: string;
    };
  };
  locale: string;
}

export function MissionVisionSection({ data, locale }: MissionVisionSectionProps) {
  const isRtl = locale === "ar";

  const missionTitle = data?.missionTitle?.[locale as "en" | "ar"] || (isRtl ? "مهمتنا" : "Our Mission");
  const mission = data?.mission?.[locale as "en" | "ar"] || (isRtl
    ? "تمكين محترفي الطباعة بمواد مبتكرة وآلات موثوقة ودعم خبير من خلال علامات تجارية موثوقة."
    : "Empowering print professionals with innovative materials, reliable machinery, and expert support through trusted brands."
  );

  const visionTitle = data?.visionTitle?.[locale as "en" | "ar"] || (isRtl ? "رؤيتنا" : "Our Vision");
  const vision = data?.vision?.[locale as "en" | "ar"] || (isRtl
    ? "أن نكون المزود الرائد لحلول الطباعة الرقمية الذكية والمستدامة في جميع أنحاء الشرق الأوسط وما بعده."
    : "To be the leading provider of smart, sustainable digital printing solutions across the Middle East and beyond."
  );

  return (
    <section className="relative w-full py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Mission Card */}
          <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
            isRtl && "rtl text-right"
          )}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <CardHeader>
              <div className={cn(
                "flex items-center gap-3",
                isRtl && "flex-row-reverse"
              )}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {isRtl ? "مهمتنا" : "Mission"}
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl">{missionTitle}</CardTitle>
                </div>
              </div>
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base md:text-lg leading-relaxed">
                {mission}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
            isRtl && "rtl text-right"
          )}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
            <CardHeader>
              <div className={cn(
                "flex items-center gap-3",
                isRtl && "flex-row-reverse"
              )}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 border-accent text-accent">
                    {isRtl ? "رؤيتنا" : "Vision"}
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl">{visionTitle}</CardTitle>
                </div>
              </div>
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base md:text-lg leading-relaxed">
                {vision}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
