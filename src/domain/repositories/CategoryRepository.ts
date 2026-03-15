/**
 * Repository: CategoryRepository
 * 
 * Repository interface for Category entity data access.
 * Implements Repository Pattern for domain-layer abstraction.
 */
import { Category } from '../entities/Category';
import { Slug } from '../value-objects/Slug';

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: Slug): Promise<Category | null>;
}
