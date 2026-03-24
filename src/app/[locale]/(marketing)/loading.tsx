import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-12 sm:pb-16 lg:pb-24">
      {/* Hero Skeleton */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden border-b bg-slate-950/5">
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <Skeleton className="h-14 w-[300px] sm:w-[500px] mb-6 rounded-full" />
          <Skeleton className="h-4 w-[250px] sm:w-[400px] mb-8" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-[180px] rounded-full" />
            <Skeleton className="h-12 w-[180px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Partners Skeleton */}
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center gap-8">
          <Skeleton className="h-6 w-48" />
          <div className="flex flex-wrap justify-center gap-12 opacity-50">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-32" />
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
          <Skeleton className="md:col-span-2 md:row-span-2 rounded-3xl" />
          <Skeleton className="md:col-span-2 rounded-3xl" />
          <Skeleton className="rounded-3xl" />
          <Skeleton className="rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
