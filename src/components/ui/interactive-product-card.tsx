"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { TEST_PRODUCT_IMAGES } from '@/lib/test-images';
import Image from 'next/image';
import { Logo } from '@/components/logo';

interface ProductProps {
    product: {
        title: { en: string; ar: string };
        description?: { en: string; ar: string };
        slug: { current: string };
        imageUrl?: string;
        warrantyMonths?: number;
        category?: {
            title: { en: string; ar: string };
            slug: { current: string };
        };
    };
    source?: "products" | "category";
}

const InteractiveProductCard = ({ product, source = "products" }: ProductProps) => {
    const locale = useLocale();
    const t = useTranslations('Common');
    const isRtl = locale === 'ar';
    
    // --- 3D Tilt Effect Logic ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Snappier springs for better responsiveness
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40, bounce: 0 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40, bounce: 0 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const categoryRaw = product.category?.title;
    const categoryTitle = typeof categoryRaw === 'string' ? categoryRaw : (categoryRaw?.[locale as 'en' | 'ar'] || categoryRaw?.en);

    const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;
    
    const titleText = typeof product.title === 'string' ? product.title : (product.title?.[locale as 'en' | 'ar'] || product.title?.en);
    const descText = typeof product.description === 'string' ? product.description : (product.description?.[locale as 'en' | 'ar'] || product.description?.en);

    // Warranty calculation
    const getWarrantyText = (months?: number) => {
        if (!months) return null;
        const years = Math.floor(months / 12);
        
        if (months === 12) {
            return isRtl ? "سنة واحدة" : "1 YEAR";
        }
        if (months === 24) {
            return isRtl ? "سنتان" : "2 YEARS";
        }
        if (months % 12 === 0) {
            return isRtl ? `${years} سنوات` : `${years} YEARS`;
        }
        return isRtl ? `${months} شهر` : `${months} MONTHS`;
    };

    const warrantyText = getWarrantyText(product.warrantyMonths);

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative w-full mx-auto max-w-sm h-[580px] rounded-[2rem] will-change-transform"
        >
            {/* 1. Far Background Layer (Matches footer, but only for the content part) */}
            <div 
                style={{ transform: "translateZ(0px)" }}
                className="absolute inset-x-0 bottom-0 top-32 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-2xl pointer-events-none"
            />

            {/* 2. Edge-to-Edge Image Container (Truly Transparent to WebGL) */}
            <motion.div 
                style={{ transform: "translateZ(80px)" }}
                className="relative h-64 w-full flex items-center justify-center will-change-transform bg-transparent p-4"
            >
                {product.imageUrl || TEST_PRODUCT_IMAGES[product.slug.current] ? (
                    <Image 
                        src={TEST_PRODUCT_IMAGES[product.slug.current] || product.imageUrl || '/placeholder.png'} 
                        alt={titleText}
                        width={400}
                        height={400}
                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                         <Eye className="w-16 h-16 text-zinc-700 opacity-20 animate-pulse" />
                    </div>
                )}
                
                {/* Category Badge - Professional White/Black */}
                {categoryTitle && (
                    <div className="absolute top-12 left-6 z-20" style={{ transform: "translateZ(40px)" }}>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.3)] border border-white">
                            {categoryTitle}
                        </span>
                    </div>
                )}
            </motion.div>

            {/* 3. Black Inner Content Card */}
            <div 
                style={{ transform: "translateZ(100px)", transformStyle: "preserve-3d" }}
                className="absolute inset-x-3 bottom-3 top-64 flex flex-col justify-between p-7 rounded-[1.8rem] bg-black border border-zinc-800 shadow-inner will-change-transform overflow-hidden"
            >

                {/* Background Decor */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Product Info - Single Language Display matching Locale */}
                <div 
                    style={{ transform: "translateZ(60px)" }}
                    className="flex-1 space-y-4 flex flex-col will-change-transform overflow-hidden"
                >
                    <Link href={`/products/${product.category?.slug.current || 'all'}/${product.slug.current}?source=${source}`} className="inline-block group/title">
                        <h3 className="transition-all duration-300">
                            <span className={cn(
                                "text-xl font-black text-white line-clamp-3 leading-tight tracking-tight uppercase",
                                locale === 'ar' && "font-arabic"
                            )}>
                                {titleText}
                            </span>
                            <div className="w-full h-0.5 mt-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
                        </h3>
                    </Link>

                    {descText && (
                        <p className={cn(
                            "text-[11px] text-zinc-400 font-light line-clamp-4 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300",
                            locale === 'ar' && "font-arabic"
                        )}>
                            {descText}
                        </p>
                    )}
                </div>

                {/* Warranty Section - Fixed Position Above Button */}
                <div 
                    style={{ transform: "translateZ(70px)" }}
                    className="mt-auto pt-4"
                >
                    {warrantyText && (
                        <div className="flex items-center gap-2.5 mb-5 text-[10px] font-black tracking-[0.2em] text-[#FFEC00]/90 drop-shadow-[0_0_10px_rgba(255,236,0,0.2)]">
                            <Logo 
                                className="w-5 h-auto brightness-0 invert-[.8] sepia-[1] saturate-[1000%] hue-rotate-[-10deg]" 
                            />
                            <span className="uppercase">{warrantyText}</span>
                        </div>
                    )}

                    {/* Action - Wide Premium Button */}
                    <Link 
                        href={`/products/${product.category?.slug.current || 'all'}/${product.slug.current}?source=${source}`}
                        className="group/btn relative w-full h-12 inline-flex items-center justify-center gap-4 rounded-full bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden"
                    >
                        {/* Rainbow Background Layer */}
                        <div className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                        
                        <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-black">
                            {locale === 'ar' ? "عرض التفاصيل" : "View Details"}
                        </span>
                        <ChevronIcon className="relative z-10 w-3.5 h-3.5 transition-all duration-500 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 group-hover/btn:text-black" />
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-40 blur-2xl transition-opacity duration-500 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 -z-10" />
                    </Link>
                </div>
            </div>

            {/* Premium Rainbow Interactive Spotlight - Restricted to the background plate area */}
            <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 top-32 rounded-[2rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100 overflow-hidden z-0"
                style={{
                    background: useTransform(
                        [mouseXSpring, mouseYSpring],
                        (values: any[]) => {
                             const [px, py] = values as [number, number];
                             return `radial-gradient(circle 500px at calc(50% + ${px * 120}%) calc(50% + ${py * 120}%), 
                                radial-gradient(circle at center, rgba(255, 0, 0, 0.05) 0%, rgba(255, 165, 0, 0.05) 15%, rgba(255, 255, 0, 0.04) 30%, rgba(0, 128, 0, 0.05) 45%, rgba(0, 0, 255, 0.04) 60%, rgba(75, 0, 130, 0.04) 75%, rgba(238, 130, 238, 0.04) 90%, transparent 100%)`
                        }
                    ),
                }}
            />
        </motion.div>
    );
};

export default InteractiveProductCard;