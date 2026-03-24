import { getTranslations } from "next-intl/server";
import { TOCSidebar } from "@/components/terms-of-service/TOCSidebar";
import { LegalSection } from "@/components/terms-of-service/LegalSections";
import { NotAnOfferBlock, TechSpecsBlock, BrandGrid } from "@/components/terms-of-service/B2BComponents";
import { FloatingActions, DownloadCTA } from "@/components/terms-of-service/InteractiveActions";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, CalendarIcon } from "lucide-react";
import { TOS_SECTIONS, LEGAL_DEFINITIONS, TOS_METADATA } from "@/lib/legal-content";
import { FadeIn, ScaleIn, StaggerContainer } from "@/components/terms-of-service/AnimationWrappers";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsOfServicePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("Legal");
  
  // Use static data based on locale
  const lang = (locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const sections = TOS_SECTIONS[lang];
  const definitions = LEGAL_DEFINITIONS[lang];
  const metadata = TOS_METADATA;

  // Calculate Reading Time
  const totalText = sections.reduce((acc: string, s: { tlDr: string; content: any }) => acc + s.tlDr + JSON.stringify(s.content), "");
  const wordCount = totalText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="relative min-h-screen bg-background pt-24 pb-20 print:bg-white print:pt-0">
      {/* Print Only Header */}
      <div className="hidden print:flex flex-col border-b-2 border-primary pb-8 mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-primary">Middle Ocean Printing</h2>
            <p className="text-sm text-muted-foreground">Premium Printing & Digital Solutions</p>
          </div>
          <div className="text-end">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{t('tocTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('lastUpdated')}: {new Date(metadata.lastUpdated || '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Background blobs for premium look - hidden on print */}
      <div className="absolute top-0 right-0 -z-10 size-96 bg-primary/5 blur-[120px] rounded-full print:hidden" />
      <div className="absolute bottom-0 left-0 -z-10 size-96 bg-cyan-500/5 blur-[120px] rounded-full print:hidden" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <header className="mb-12 border-b border-border/50 pb-8 print:hidden">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full font-bold tracking-tight bg-primary/10 text-primary border-none">
                    LEGAL DOCUMENT
                  </Badge>
                  {metadata.lastUpdated && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                      <CalendarIcon className="size-3" />
                      {t('lastUpdated')}: {new Date(metadata.lastUpdated).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  {t('tocTitle')}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="size-4" />
                    {t('readingTime', { minutes: readingTime })}
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <DownloadCTA />
                </div>
              </div>
            </div>
          </FadeIn>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* content container */}
          <div className="flex-1 max-w-3xl w-full print:max-w-none">
            {/* Special Disclaimer Block */}
            <div className="print:break-inside-avoid">
              <NotAnOfferBlock 
                title={t('notAnOffer')} 
                description={t('notAnOfferDesc')} 
              />
            </div>

            {/* Terms Content */}
            <div className="space-y-4">
              {sections.map((section: any) => (
                <div key={section.id} className="print:break-inside-avoid print:mb-8">
                  <LegalSection 
                    id={section.id}
                    title={section.title}
                    tlDr={section.tlDr}
                    content={section.content}
                  />
                </div>
              ))}
            </div>

            {/* Technical Specs Clause */}
            <div className="print:break-inside-avoid">
              <TechSpecsBlock 
                title={t('technicalSpecs')} 
                description={t('technicalSpecsDesc')}
              />
            </div>

            {/* Brand grid - hidden on print for brevity/professionalism unless requested */}
            {metadata.brandAssets && metadata.brandAssets.length > 0 && (
              <div className="print:hidden">
                <BrandGrid 
                  title={t('protectedTrademarks')}
                  description={t('trademarkDisclaimer')}
                  images={metadata.brandAssets.map((url) => ({ url, altText: "Trademark Asset" }))} 
                />
              </div>
            )}

            {/* Definitions Section */}
            {definitions && definitions.length > 0 && (
              <section id="definitions" className="mt-20 p-8 rounded-3xl border border-dashed border-border bg-muted/20 print:bg-white print:border-solid print:mt-12 print:break-inside-avoid">
                <FadeIn>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <div className="size-2 rounded-full bg-primary" />
                     {t('definitions')}
                  </h2>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 print:grid-cols-1">
                  {definitions.map((def: any, idx: number) => (
                    <ScaleIn key={idx} delay={idx * 0.05}>
                      <div className="group print:mb-4">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
                           {def.term}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {def.description}
                        </p>
                      </div>
                    </ScaleIn>
                  ))}
                </div>
              </section>
            )}

            {/* Final Inquiry Button - hidden on print */}
            <div className="mt-20 text-center print:hidden" id="legal-inquiry-btn">
               <FadeIn>
                 <p className="text-muted-foreground mb-6">Have a question about these terms?</p>
                 <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                    {t('legalInquiry')}
                 </button>
               </FadeIn>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-20 pt-8 border-t border-border text-center text-[10px] text-muted-foreground">
              <p>© {new Date().getFullYear()} Middle Ocean Printing. All rights reserved.</p>
              <p>This is a legally binding electronic document. Page Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Sidebar TOC - hidden on print */}
          <aside className="hidden lg:block print:hidden">
            <FadeIn delay={0.2} className="h-full">
              <TOCSidebar items={sections} className="flex-shrink-0" />
            </FadeIn>
          </aside>
        </div>
      </div>

      <FloatingActions />
    </div>
  );
;
}
