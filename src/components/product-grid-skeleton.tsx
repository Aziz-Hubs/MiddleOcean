"use client";

import React from 'react';
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
