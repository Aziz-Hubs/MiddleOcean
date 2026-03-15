/**
 * Repository: ProductRepository
 * 
 * Repository interface for Product entity data access.
 * Implements Repository Pattern for domain-layer abstraction.
 */
import { Product } from '../entities/Product';
import { Slug } from '../value-objects/Slug';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: Slug): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findFeatured(count?: number): Promise<Product[]>;
}
