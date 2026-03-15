/**
 * Repository: SanityCategoryRepository
 * 
 * Implementation of CategoryRepository using Sanity CMS as data source.
 * Acts as an adapter between domain layer and infrastructure (Sanity).
 */
import { sanityClient } from '@/sanity/client';
import { Category } from '@/domain/entities/Category';
import { Slug } from '@/domain/value-objects/Slug';
import { CategoryRepository } from '@/domain/repositories/CategoryRepository';

export class SanityCategoryRepository implements CategoryRepository {
  private static readonly QUERY = `*[_type == "category"]{
    _id,
    title,
    description,
    icon,
    slug,
    image,
    order
  }`;

  async findAll(): Promise<Category[]> {
    const data = await sanityClient.fetch(CategoriesQuery);

    return data.map((item: any) => Category.fromSanity(item));
  }

  async findById(id: string): Promise<Category | null> {
    const data = await sanityClient.fetch(`*[_type == "category" && _id == $id][0]{
      _id,
      title,
      description,
      icon,
      slug,
      image,
      order
    }`, { id });

    if (!data) return null;
    return Category.fromSanity(data);
  }

  async findBySlug(slug: Slug): Promise<Category | null> {
    const data = await sanityClient.fetch(`*[_type == "category" && slug.current == $slug][0]{
      _id,
      title,
      description,
      icon,
      slug,
      image,
      order
    }`, { slug: slug.toString() });

    if (!data) return null;
    return Category.fromSanity(data);
  }
}

// Separate constant for query reuse
const CategoriesQuery = `*[_type == "category"]{
  _id,
  title,
  description,
  icon,
  slug,
  image,
  order
}`;
