"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn(
      "relative aspect-square group rounded-[2rem] overflow-hidden print:overflow-visible w-full",
      "bg-background/40 backdrop-blur-md border border-white/10 print:border-none",
      "flex items-center justify-center print:p-8 print:bg-white"
    )}>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-white/[0.01] print:hidden" />
      
      {src ? (
        <>
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-[2rem] bg-zinc-800/50" />
          )}
          <Image
            src={src}
            alt={alt}
            width={800}
            height={800}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover print:object-contain print:max-w-full print:max-h-full print:w-auto print:h-auto relative z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 print:scale-100 drop-shadow-2xl print:drop-shadow-none",
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Search className="w-16 h-16 text-zinc-700 opacity-20" />
        </div>
      )}
    </div>
  );
}
