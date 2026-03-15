/**
 * Entity: Product
 * 
 * Domain entity representing a product in the catalog.
 * Contains business logic for product identification and specifications.
 */
import { Slug } from '../value-objects/Slug';
import { LocaleString } from '../value-objects/LocaleString';
import { ProductSpec } from '../value-objects/ProductSpec';

export class Product {
  private readonly id: string;
  private readonly name: LocaleString;
  private readonly description: LocaleString;
  private readonly slug: Slug;
  private readonly category: string; // References Category ID
  private readonly brand?: string;
  private readonly specifications: ProductSpec[];
  private readonly imageUrl?: string;
  private readonly featured: boolean = false;
  private readonly order: number = 0;

  constructor(
    id: string,
    name: LocaleString,
    description: LocaleString,
    slug: Slug,
    category: string,
    specifications: ProductSpec[],
    brand?: string,
    imageUrl?: string,
    featured?: boolean,
    order?: number
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }
    
    this.id = id;
    this.name = name;
    this.description = description;
    this.slug = slug;
    this.category = category;
    this.brand = brand;
    this.specifications = specifications;
    this.imageUrl = imageUrl;
    this.featured = featured ?? false;
    this.order = order ?? 0;
  }

  getId(): string {
    return this.id;
  }

  getName(locale: 'en' | 'ar' = 'en'): string {
    return this.name.get(locale);
  }

  getDescription(locale: 'en' | 'ar' = 'en'): string {
    return this.description.get(locale);
  }

  getSlug(): Slug {
    return this.slug;
  }

  getCategory(): string {
    return this.category;
  }

  getBrand(): string | undefined {
    return this.brand;
  }

  getSpecifications(): ProductSpec[] {
    return [...this.specifications];
  }

  getImageUrl(): string | undefined {
    return this.imageUrl;
  }

  isFeatured(): boolean {
    return this.featured;
  }

  getOrder(): number {
    return this.order;
  }

  hasImage(): boolean {
    return !!this.imageUrl;
  }

  toObject(): {
    id: string;
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    slug: string;
    category: string;
    brand?: string;
    specifications: { key: string; value: string }[];
    imageUrl?: string;
    featured: boolean;
    order: number;
  } {
    return {
      id: this.id,
      name: this.name.toObject(),
      description: this.description.toObject(),
      slug: this.slug.toString(),
      category: this.category,
      brand: this.brand,
      specifications: this.specifications.map(s => s.toObject()),
      imageUrl: this.imageUrl,
      featured: this.featured,
      order: this.order,
    };
  }

  static fromObject(obj: {
    id: string;
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    slug: string;
    category: string;
    brand?: string;
    specifications: { key: string; value: string }[];
    imageUrl?: string;
    featured?: boolean;
    order?: number;
  }): Product {
    return new Product(
      obj.id,
      LocaleString.fromObject(obj.name),
      LocaleString.fromObject(obj.description),
      Slug.fromString(obj.slug),
      obj.category,
      obj.specifications.map(s => ProductSpec.fromObject(s)),
      obj.brand,
      obj.imageUrl,
      obj.featured,
      obj.order
    );
  }

  static fromSanity(obj: {
    _id: string;
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    slug: { current: string };
    category: string;
    brand?: string;
    specifications?: { key: string; value: string }[];
    image?: string;
    featured?: boolean;
    order?: number;
  }): Product {
    return new Product(
      obj._id,
      LocaleString.fromSanity(obj.title),
      LocaleString.fromSanity(obj.description),
      Slug.fromSanity(obj.slug),
      obj.category,
      (obj.specifications ?? []).map(s => ProductSpec.fromObject(s)),
      obj.brand,
      obj.image,
      obj.featured,
      obj.order
    );
  }
}
