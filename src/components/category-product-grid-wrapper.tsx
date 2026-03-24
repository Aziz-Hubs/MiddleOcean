import { sanityClient } from "@/sanity/client";
import { productsByCategoryPagedQuery, productsByCategoryCountQuery } from "@/sanity/queries";
import InteractiveProductCard from "@/components/ui/interactive-product-card";
import { ProductPagination } from "@/components/product-pagination";

interface CategoryProductGridWrapperProps {
  slug: string;
  page: number;
  limit: number;
  locale: string;
  categoryTitle: string;
}

export default async function CategoryProductGridWrapper({ 
  slug, 
  page, 
  limit, 
  locale,
  categoryTitle 
}: CategoryProductGridWrapperProps) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const isRtl = locale === "ar";

  const [products, totalCount] = await Promise.all([
    sanityClient.fetch(productsByCategoryPagedQuery, { slug, start, end }),
    sanityClient.fetch(productsByCategoryCountQuery, { slug })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-zinc-400 font-light">
          {isRtl 
            ? `لا توجد منتجات حالياً في فئة ${categoryTitle}.`
            : `No products found in ${categoryTitle} category.`
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: any) => (
          <InteractiveProductCard key={product._id} product={product} source="category" />
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
