import { sanityClient } from "@/sanity/client";
import { allProductsPagedQuery, productsCountQuery } from "@/sanity/queries";
import InteractiveProductCard from "@/components/ui/interactive-product-card";
import { ProductPagination } from "@/components/product-pagination";

interface ProductGridWrapperProps {
  page: number;
  limit: number;
  locale: string;
}

export default async function ProductGridWrapper({ page, limit, locale }: ProductGridWrapperProps) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const isRtl = locale === "ar";

  const [products, totalCount] = await Promise.all([
    sanityClient.fetch(allProductsPagedQuery, { start, end }),
    sanityClient.fetch(productsCountQuery)
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-zinc-400 font-light">
          {isRtl ? "لا توجد منتجات حالياً." : "No products found."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: any) => (
          <InteractiveProductCard key={product._id} product={product} source="products" />
        ))}
      </div>
      
      <ProductPagination 
        totalPages={totalPages}
        currentPage={page}
        locale={locale}
      />
    </>
  );
}
