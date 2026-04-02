import { cn } from "@/lib/utils";
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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Mission Card */}
          <div className={cn(
            "relative p-8 md:p-10 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow",
            isRtl && "rtl text-right"
          )}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {missionTitle}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className={cn(
            "relative p-8 md:p-10 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow",
            isRtl && "rtl text-right"
          )}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {visionTitle}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {vision}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
