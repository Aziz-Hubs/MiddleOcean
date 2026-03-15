/**
 * Repository: SanityProductRepository
 * 
 * Implementation of ProductRepository using Sanity CMS as data source.
 * Acts as an adapter between domain layer and infrastructure (Sanity).
 */
import { sanityClient } from '@/sanity/client';
import { Product } from '@/domain/entities/Product';
import { Slug } from '@/domain/value-objects/Slug';
import { ProductRepository } from '@/domain/repositories/ProductRepository';

export class SanityProductRepository implements ProductRepository {
  private static readonly CATEGORY_QUERY = `*[_type == "category"]{ _id }`;
  private static readonly PRODUCT_QUERY = `*[_type == "product"]{
    _id,
    title,
    description,
    slug,
    category,
    brand,
    specifications,
    image,
    featured,
    order
  }`;

  async findAll(): Promise<Product[]> {
    const data = await sanityClient.fetch(SanityProductRepository.PRODUCT_QUERY);

    return data.map((item: any) => Product.fromSanity(item));
  }

  async findById(id: string): Promise<Product | null> {
    const data = await sanityClient.fetch(`*[_type == "product" && _id == $id][0]{...}`, { id });

    if (!data) return null;
    return Product.fromSanity(data);
  }

  async findBySlug(slug: Slug): Promise<Product | null> {
    const data = await sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0]{...}`, { slug: slug.toString() });

    if (!data) return null;
    return Product.fromSanity(data);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const data = await sanityClient.fetch(`*[_type == "product" && category == $categoryId]{...}`, { categoryId });

    return data.map((item: any) => Product.fromSanity(item));
  }

  async findFeatured(count: number = 5): Promise<Product[]> {
    const data = await sanityClient.fetch(`*[_type == "product" && featured == true][0...$count]{...}`, { count });

    return data.map((item: any) => Product.fromSanity(item));
  }
}
