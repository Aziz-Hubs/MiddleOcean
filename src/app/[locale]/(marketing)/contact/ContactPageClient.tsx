"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Phone, Mail, MapPin, ExternalLink, CheckCircle2, ChevronDown, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ContactPageClient({ settings, locale }: { settings: { phone?: string; email?: string; whatsapp?: string; mapCoordinates?: { lat: number; lng: number }; address?: Record<string, string>; faqs?: Array<{ question: Record<string, string>; answer: Record<string, string> }>; socialLinks?: Record<string, string> }, locale: string }) {
  const t = useTranslations("ContactUs");

  const [isOpen, setIsOpen] = useState(false);
  const [copiedData, setCopiedData] = useState<string | null>(null);

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Defer processing to avoid cascading renders and hydration mismatches
    const timer = setTimeout(() => {
      const ammanTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Amman" }));
      const day = ammanTime.getDay();
      const hour = ammanTime.getHours();
      
      let open = false;
      if (day >= 0 && day <= 3) {
        open = hour >= 9 && hour < 17;
      } else if (day === 4) {
        open = hour >= 9 && hour < 15;
      }
      setIsOpen(open);
      setShowMap(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedData(type);
      setTimeout(() => setCopiedData(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const phone = settings?.phone || "+962 6 565 6565";
  const whatsapp = settings?.whatsapp || "+962 7 9999 9999";
  const email = settings?.email || "contact@middleocean.com";
  
  // Use map coordinates from sanity if present, else fallback to Middle Ocean's actual coordinates
  const lat = settings?.mapCoordinates?.lat || 31.97142025210645;
  const lng = settings?.mapCoordinates?.lng || 35.90529755092632;
  const addressText = settings?.address?.[locale] || "60 Issam Ajlouni Str, Sherko Complex, Floor-1, Amman – Jordan";
  const googleMapUrl = "https://www.google.com/maps/place/Middle+Ocean+For+Printer+Trading/data=!4m2!3m1!1s0x0:0x7561e9c98d383603?sa=X&ved=1t:2428&ictx=111";

  const isRtl = locale === "ar";

  // Additional FAQs from Middleocean.jo
  const additionalFaqs = [
    {
      question: {
        en: "How many brands does Middle Ocean serve?",
        ar: "كم عدد العلامات التجارية التي تخدمها ميدل أوشن؟"
      },
      answer: {
        en: "We are proud to serve over 2000 major brands, providing them with reliable and high-quality printing solutions.",
        ar: "نحن فخورون بخدمة أكثر من 2000 علامة تجارية كبرى، حيث نوفر لهم حلول طباعة موثوقة وعالية الجودة."
      }
    },
    {
      question: {
        en: "What are the main brands under Middle Ocean?",
        ar: "ما هي العلامات التجارية الرئيسية تحت مظلة ميدل أوشن؟"
      },
      answer: {
        en: "Our core brands include OceanTeck, which focuses on engineering and machinery, and OceanJett, which specializes in premium digital printing consumables and materials.",
        ar: "تشمل علاماتنا التجارية الأساسية OceanTeck، التي تركز على الهندسة والآلات، وOceanJett، المتخصصة في مستهلكات ومواد الطباعة الرقمية الفاخرة."
      }
    },
    {
      question: {
        en: "Do you offer custom solutions for specific material needs?",
        ar: "هل تقدمون حلولاً مخصصة لاحتياجات المواد المحددة؟"
      },
      answer: {
        en: "Yes, we specialize in providing custom materials tailored to your unique printing and advertising requirements, ensuring the best results for every project.",
        ar: "نعم، نحن متخصصون في تقديم مواد مخصصة مصممة خصيصاً لمتطلبات الطباعة والإعلان الفريدة الخاصة بك، لضمان أفضل النتائج لكل مشروع."
      }
    },
    {
      question: {
        en: "What is OceanTeck's focus?",
        ar: "ما هو تركيز OceanTeck؟"
      },
      answer: {
        en: "OceanTeck is our machinery division, providing high-performance digital printing machines and essential spare parts to ensure seamless operations.",
        ar: "OceanTeck هو قسم الآلات لدينا، حيث يوفر ماكينات طباعة رقمية عالية الأداء وقطع غيار أساسية لضمان استمرارية العمل بسلاسة."
      }
    }
  ];

  const allFaqs = [...(settings?.faqs || []), ...additionalFaqs];

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 1. Hero & Orientation Component - Category Page Style */}
      <section className={cn(
        "relative w-full overflow-hidden border-b border-border bg-background/80 backdrop-blur-md py-16 md:py-24",
        isRtl ? "text-right" : "text-left"
      )}>
        <div className="container mx-auto max-w-7xl px-6 relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge variant={isOpen ? "default" : "secondary"} className={`text-xs py-1.5 px-4 transition-colors border-border/50 backdrop-blur-sm bg-background/50 ${isOpen ? "bg-green-500 hover:bg-green-600" : ""}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOpen ? "bg-white animate-pulse" : "bg-gray-400"}`}></span>
              {isOpen ? t("openNow") : t("closedNow")}
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "max-w-4xl space-y-6",
              isRtl ? "text-right mr-0 ml-auto" : "text-left"
            )}
          >
            <h1 className={cn(
              "text-5xl font-black uppercase text-white sm:text-6xl md:text-7xl lg:text-8xl",
              isRtl ? "tracking-normal leading-normal" : "tracking-tighter"
            )}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 py-1">
                {t("heroTitle")}
              </span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg leading-relaxed text-zinc-300 md:text-xl lg:text-2xl font-light max-w-2xl"
            >
              {t("heroSubtitle")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 space-y-24 relative z-10">
        {/* 2. Direct Contact Cards Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <ContactCard 
            icon={<Phone className="w-6 h-6 text-yellow-500" />}
            title={t("phone")}
            content={phone}
            actionLabel={t("clickToCall")}
            onAction={() => window.location.href = `tel:${phone.replace(/\s+/g, '')}`}
            copyAction={() => handleCopy(phone, "phone")}
            copied={copiedData === "phone"}
            t={t}
          />
          <ContactCard 
            icon={<Mail className="w-6 h-6 text-blue-500" />}
            title={t("email")}
            content={email}
            actionLabel={t("clickToEmail")}
            onAction={() => window.location.href = `mailto:${email}?subject=Middle%20Ocean%20Website%20Inquiry`}
            copyAction={() => handleCopy(email, "email")}
            copied={copiedData === "email"}
            t={t}
          />
          <ContactCard 
            icon={<WhatsAppIcon className="w-6 h-6 text-[#25D366]" />}
            title={t("whatsapp")}
            content={whatsapp}
            actionLabel={t("clickToMessage")}
            onAction={() => window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')}
            copyAction={() => handleCopy(whatsapp, "whatsapp")}
            copied={copiedData === "whatsapp"}
            t={t}
          />
        </section>

        {/* 3. Mapscn Component & Physical Location */}
        <section className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5 rounded-3xl overflow-hidden border border-border/40 transition-colors hover:border-primary/20">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  {t("address")}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {addressText}
                </p>
              </div>
              
              <div className="pt-6">
                <Button size="lg" className="text-lg px-8 group rounded-full" onClick={() => window.open(googleMapUrl, '_blank')}>
                  {t("getDirections")}
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            <div className="h-[400px] md:h-auto relative bg-muted/30 flex items-center justify-center">
              {showMap ? (
                <Map 
                  viewport={{ center: [lng, lat], zoom: 15 }}
                  scrollZoom={false}
                  dragPan={true}
                  doubleClickZoom={true}
                >
                  <MapControls position="bottom-right" showZoom={true} />
                  <MapMarker longitude={lng} latitude={lat}>
                    <MarkerContent>
                      <div className="relative flex items-center justify-center w-12 h-12">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                          <MapPin className="w-6 h-6" />
                        </div>
                      </div>
                    </MarkerContent>
                  </MapMarker>
                </Map>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Initializing Map...</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Support/Social Proof Footer */}
        {(allFaqs.length > 0 || settings?.socialLinks) && (
          <section className="max-w-4xl mx-auto space-y-16">
            {allFaqs.length > 0 && (
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{t("faq")}</h3>
                  <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </div>
                <Accordion className="w-full space-y-4">
                  {allFaqs.map((faq: { question: Record<string, string>; answer: Record<string, string> }, index: number) => (
                    <AccordionItem 
                      value={`faq-${index}`} 
                      key={index}
                      className="px-6 rounded-2xl bg-background/40 backdrop-blur-sm transition-all hover:bg-background/60"
                    >
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                        {faq.question?.[locale] || faq.question?.en}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                        {faq.answer?.[locale] || faq.answer?.en}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {settings?.socialLinks && (
              <div className="space-y-8 text-center pt-8 border-t border-border/20">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">{t("socials")}</h3>
                <div className="flex justify-center flex-wrap gap-6">
                  {settings.socialLinks.facebook && (
                    <SocialButton href={settings.socialLinks.facebook} label="Facebook" icon={<Facebook className="w-5 h-5" />} />
                  )}
                  {settings.socialLinks.instagram && (
                    <SocialButton href={settings.socialLinks.instagram} label="Instagram" icon={<Instagram className="w-5 h-5" />} />
                  )}
                  {settings.socialLinks.linkedin && (
                    <SocialButton href={settings.socialLinks.linkedin} label="LinkedIn" icon={<Linkedin className="w-5 h-5" />} />
                  )}
                  {settings.socialLinks.twitter && (
                    <SocialButton href={settings.socialLinks.twitter} label="Twitter" icon={<Twitter className="w-5 h-5" />} />
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function ContactCard({ icon, title, content, actionLabel, onAction, copyAction, copied, t }: { icon: React.ReactNode; title: string; content: string; actionLabel: string; onAction: () => void; copyAction: () => void; copied: boolean; t: (key: string) => string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col group cursor-pointer border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5 hover:border-primary/50 transition-all duration-300 rounded-[2rem]" 
        onClick={onAction}
      >
        <CardHeader className="pb-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-0">
          <p className="text-lg font-medium mb-8 flex-1 break-all text-muted-foreground group-hover:text-foreground transition-colors" dir="ltr">{content}</p>
          <div className="flex items-center justify-between pt-6 border-t border-border/20">
            <span className="text-sm font-bold text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              {actionLabel}
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </span>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all relative border border-border/30"
              onClick={(e) => {
                e.stopPropagation();
                copyAction();
              }}
              title={t("clickToCopy")}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SocialButton({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-background/50 backdrop-blur-sm border-border/40 font-bold")}>
      <span className="mx-auto">{icon}</span>
    </a>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}
