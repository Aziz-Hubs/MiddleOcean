import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="pt-24 min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-4 mb-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl border bg-card/50 overflow-hidden space-y-4 p-6 flex flex-col justify-end">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
