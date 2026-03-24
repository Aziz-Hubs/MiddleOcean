import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <div className="pt-24 min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Category Header Skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-10 h-10 rounded-xl bg-zinc-800/20" />
            <Skeleton className="h-10 w-48 bg-zinc-800/20" />
          </div>
          <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/10" />
        </div>

        {/* Product Grid Skeleton - Using the existing component! */}
        <div className="pb-24">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
