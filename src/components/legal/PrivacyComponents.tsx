"use client";

import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, Mail, Phone, Server, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ZeroCollectionHero() {
  const t = useTranslations("PrivacyPolicy");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="text-center mb-20"
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="p-4 bg-primary/10 rounded-full"
          >
            <ShieldCheck className="w-12 h-12 text-primary" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
        {t("pageTitle")}
      </motion.h1>
      
      <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
        <p className="text-xl font-bold text-foreground mb-4">
          {t("heroBadge")}
        </p>
        <p className="text-muted-foreground leading-relaxed text-lg italic">
          "{t("heroSubtitle")}"
        </p>
      </motion.div>
    </motion.section>
  );
}

export function CommunicationGrid() {
  const t = useTranslations("PrivacyPolicy");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const channels = [
    {
      icon: MessageSquare,
      title: t("whatsapp"),
      description: t("whatsappDesc"),
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: t("email"),
      description: t("emailDesc"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: t("phone"),
      description: t("phoneDesc"),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="mb-20"
    >
      <motion.div variants={itemVariants} className="mb-10 text-start">
        <h2 className="text-2xl font-bold mb-4">{t("communicationTitle")}</h2>
        <p className="text-muted-foreground max-w-xl">{t("communicationSubtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {channels.map((channel, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors group">
              <CardContent className="p-6">
                <div className={cn("inline-flex p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform", channel.bg)}>
                  <channel.icon className={cn("w-6 h-6", channel.color)} />
                </div>
                <h3 className="font-bold text-lg mb-2">{channel.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {channel.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground">
        <ExternalLink className={cn("w-4 h-4 mt-0.5 shrink-0", isRtl && "scale-x-100")} />
        <p className="text-start">{t("thirdPartyDisclaimer")}</p>
      </motion.div>
    </motion.section>
  );
}

export function TechnicalDataCard() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={itemVariants}
      className="mb-20"
    >
      <Card className="border-dashed border-2 border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Server className="w-24 h-24" />
        </div>
        <CardContent className="p-8 relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            {t("technicalDataTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("technicalDataDesc")}
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
