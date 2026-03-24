"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface TOCSidebarProps {
  items: { id: string; title: string }[];
  className?: string;
}

export function TOCSidebar({ items, className }: TOCSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const t = useTranslations("Legal");

  useEffect(() => {
    const observers = new Map();

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-20% 0px -75% 0px",
    });

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        observers.set(item.id, element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className={cn("hidden lg:block h-full", className)}>
      <div className="sticky top-24 w-64">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
          {t('tocTitle')}
        </h4>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "group relative flex items-center py-2 text-sm transition-all duration-200",
                    isActive
                      ? "font-medium text-primary's-cyan" // Using project's cyan tone
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="toc-active-indicator"
                      className="absolute inset-s-[-1rem] h-full w-1 rounded-full bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className={cn(
                    "transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                    isActive && "translate-x-1 rtl:-translate-x-1"
                  )}>
                    {item.title}
                  </span>
                </a>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
