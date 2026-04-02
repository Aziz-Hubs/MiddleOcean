import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface TeamSectionProps {
  data?: {
    sectionTitle?: {
      en: string;
      ar: string;
    };
    members?: Array<{
      _key: string;
      name: string;
      role?: {
        en: string;
        ar: string;
      };
      bio?: {
        en: string;
        ar: string;
      };
      photo?: string;
      order: number;
    }>;
  };
  locale: string;
}

export function TeamSection({ data, locale }: TeamSectionProps) {
  const isRtl = locale === "ar";
  const sectionTitle = data?.sectionTitle?.[locale as "en" | "ar"] || (isRtl ? "فريقنا" : "Our Team");
  const members = data?.members || [];

  if (members.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-20 md:py-28 bg-muted/30">
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
              ? "تعرف على الأشخاص الذين يقودون نجاحنا"
              : "Meet the people driving our success"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {members.map((member) => (
            <div
              key={member._key}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300",
                isRtl && "rtl text-right"
              )}
            >
              {/* Photo */}
              <div className="aspect-square overflow-hidden bg-muted">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="text-sm text-primary font-medium mb-3">
                    {member.role[locale as "en" | "ar"]}
                  </p>
                )}
                {member.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio[locale as "en" | "ar"]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
