"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  cyan: { base: 180, spread: 200 },
};

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  glowColor = "cyan",
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  glowColor?: keyof typeof glowColorMap;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices that support hover (desktop)
    if (!window.matchMedia("(hover: hover)").matches) return;

    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const spotlightStyles = {
    "--base": base,
    "--spread": spread,
    "--radius": "0",
    "--border": "2",
    "--backdrop": "rgba(255, 255, 255, 0.01)",
    "--backup-border": "var(--backdrop)",
    "--size": "250",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    // Base spotlight gradient
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) 100% 70% / 0.08), transparent
    )`,
    backgroundAttachment: "fixed",
    position: "relative" as const,
  } as React.CSSProperties;

  const beforeAfterStyles = `
    .bento-glow::before,
    .bento-glow::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: 0;
      border: var(--border-size) solid transparent;
      border-radius: inherit;
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      z-index: 45;
    }

    .inner-glow {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: inherit;
      filter: blur(calc(var(--border-size) * 15));
      background: none;
      pointer-events: none;
      z-index: 40;
    }
    
    .inner-glow::before {
      content: "";
      position: absolute;
      inset: -20px;
      border: 20px solid transparent;
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) 100% 50% / 0.15), transparent 100%
      );
      background-attachment: fixed;
      border-radius: inherit;
    }
    
    .bento-glow::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) 100% 50% / 0.2), transparent 100%
      );
    }
    
    .bento-glow::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        rgba(255, 255, 255, 0.1), transparent 100%
      );
    }

    @media (hover: none) {
      .bento-glow::before, .bento-glow::after {
        display: none !important;
      }
    }
  `;

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative col-span-3 flex flex-col overflow-hidden rounded-none m-0 p-0 bento-glow",
        "cursor-pointer border-none shadow-none",
        className,
      )}
      style={spotlightStyles}
    >
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div className="inner-glow" />
      {background}
    <div className="pointer-events-none z-30 flex absolute top-4 start-4 transform-gpu flex-col gap-1 transition-all duration-300 group-hover:-translate-y-1">
      <Icon className="h-8 w-8 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-90 dark:text-neutral-300" />
      <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tighter">
        {name}
      </h3>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-30 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <p className="max-w-lg text-base text-neutral-400 font-medium">
        {description}
      </p>
    </div>
    <div className="pointer-events-none absolute inset-0 z-20 transform-gpu transition-all duration-300 group-hover:bg-black/20" />
    <Link href={href} className="absolute inset-0 z-50" aria-label={name} />
    </div>
  );
};
