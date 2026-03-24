"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, delayChildren = 0 }: { children: ReactNode; delayChildren?: number }) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.1 }}
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, delay = 0, direction = "up" }: { children: ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
