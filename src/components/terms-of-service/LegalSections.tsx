"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@/components/ui/portable-text";
import { LightbulbIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LegalSectionProps {
  id: string;
  title: string;
  tlDr?: string;
  content: unknown;
  isExpanded?: boolean;
}

import { motion } from "framer-motion";

export function TLDRCard({ content }: { content: string }) {
  const t = useTranslations("Legal");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mb-6 border-none bg-primary/5 dark:bg-primary/10 overflow-hidden relative group">
        <div className="absolute top-0 start-0 h-full w-1 bg-primary" />
        <CardContent className="p-4 pt-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <LightbulbIcon className="size-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                {t('plainEnglish')}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                {content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LegalSection({ id, title, tlDr, content }: LegalSectionProps) {
  return (
    <motion.section 
      id={id} 
      className="scroll-mt-24 mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {tlDr && <TLDRCard content={tlDr} />}

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <PortableText value={content} />
      </div>
    </motion.section>
  );
}

export function DefinitionTooltip({ term, definition }: { term: string; definition: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="cursor-help border-b border-dotted border-primary/50 hover:border-primary transition-colors decoration-2 underline-offset-4">
          {term}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3 feedback-shadow bg-popover text-popover-foreground border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Definition</p>
        <p className="text-sm leading-relaxed">{definition}</p>
      </TooltipContent>
    </Tooltip>
  );
}
