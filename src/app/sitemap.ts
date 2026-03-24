import { MetadataRoute } from 'next';
import { sanityClient } from '@/sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Fetch dynamic slugs using accurate GROQ
  const products: Array<{ slug: string; catSlug: string; _updatedAt: string }> = await sanityClient.fetch(`*[_type == "product" && defined(slug.current)][]{ "slug": slug.current, "catSlug": category->slug.current, _updatedAt }`);
  const categories: Array<{ slug: string; _updatedAt: string }> = await sanityClient.fetch(`*[_type == "category" && defined(slug.current)][]{ "slug": slug.current, _updatedAt }`);
  
  // Static Routes corresponding to locales
  const locales = ['en', 'ar'];
  const routes = ['', '/about', '/contact', '/terms-of-service', '/privacy-policy'];
  
  const staticPaths = routes.flatMap(route => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}${route}`])
        )
      }
    }))
  );

  // Dynamic Product Routes
  const productPaths = products.flatMap((product) => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/products/${product.catSlug || 'all'}/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/products/${product.catSlug || 'all'}/${product.slug}`])
        )
      }
    }))
  );

  // Dynamic Category Routes
  const categoryPaths = categories.flatMap((category) => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/products/${category.slug}`,
      lastModified: new Date(category._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/products/${category.slug}`])
        )
      }
    }))
  );

  return [...staticPaths, ...categoryPaths, ...productPaths];
}
