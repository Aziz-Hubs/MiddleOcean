"use client";

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ProductCardSkeleton = () => {
  return (
    <div className="relative w-full mx-auto max-w-sm h-[580px] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-md">
      {/* 1. Image Area Skeleton */}
      <div className="relative h-64 w-full flex items-center justify-center p-4">
        <Skeleton className="w-48 h-48 rounded-2xl bg-zinc-800/50" />
        
        {/* Category Badge Skeleton */}
        <div className="absolute top-12 left-6">
          <Skeleton className="w-20 h-6 rounded-full bg-zinc-800/80" />
        </div>
      </div>

      {/* 2. Content Card Skeleton */}
      <div className="absolute inset-x-3 bottom-3 top-64 flex flex-col p-7 rounded-[1.8rem] bg-black/40 border border-zinc-800/50 shadow-inner">
        {/* Logo Placeholder (Top Right) */}
        <div className="absolute top-6 right-7">
          <Skeleton className="w-12 h-3 bg-zinc-800/40" />
        </div>

        {/* Title Area */}
        <div className="flex-1 space-y-4 flex flex-col overflow-hidden">
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-6 bg-zinc-800/60" />
            <Skeleton className="w-1/2 h-6 bg-zinc-800/60" />
            {/* Rainbow Strip Placeholder */}
            <div className="w-full h-0.5 mt-2 bg-zinc-800/40" />
          </div>

          {/* Description Area */}
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-3 bg-zinc-800/30" />
            <Skeleton className="w-full h-3 bg-zinc-800/30" />
            <Skeleton className="w-5/6 h-3 bg-zinc-800/30" />
            <Skeleton className="w-4/6 h-3 bg-zinc-800/30" />
          </div>
        </div>

        {/* Warranty Section */}
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2.5 mb-5">
            <Skeleton className="size-4 rounded-sm bg-zinc-800/50" />
            <Skeleton className="w-24 h-3 bg-zinc-800/50" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="w-full h-12 rounded-full bg-zinc-800/60" />
        </div>
      </div>

      {/* Subtle Shimmer Overlay (Optional, as Skeleton has pulse) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};
