/**
 * Entity: Category
 * 
 * Domain entity representing a product category.
 * Contains business logic for category identification and display.
 */
import { Slug } from '../value-objects/Slug';
import { LocaleString } from '../value-objects/LocaleString';
import { CategoryIcon } from '../value-objects/CategoryIcon';

export class Category {
  private readonly id: string;
  private readonly name: LocaleString;
  private readonly description: LocaleString;
  private readonly icon: CategoryIcon;
  private readonly slug: Slug;
  private readonly imageUrl?: string;
  private readonly order: number = 0;

  constructor(
    id: string,
    name: LocaleString,
    description: LocaleString,
    icon: CategoryIcon,
    slug: Slug,
    imageUrl?: string,
    order?: number
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Category ID cannot be empty');
    }
    
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.slug = slug;
    this.imageUrl = imageUrl;
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

  getIcon(): CategoryIcon {
    return this.icon;
  }

  getSlug(): Slug {
    return this.slug;
  }

  getImageUrl(): string | undefined {
    return this.imageUrl;
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
    icon: string;
    slug: string;
    imageUrl?: string;
    order: number;
  } {
    return {
      id: this.id,
      name: this.name.toObject(),
      description: this.description.toObject(),
      icon: this.icon.toString(),
      slug: this.slug.toString(),
      imageUrl: this.imageUrl,
      order: this.order,
    };
  }

  static fromObject(obj: {
    id: string;
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    icon: string;
    slug: string;
    imageUrl?: string;
    order?: number;
  }): Category {
    return new Category(
      obj.id,
      LocaleString.fromObject(obj.name),
      LocaleString.fromObject(obj.description),
      CategoryIcon.fromString(obj.icon),
      Slug.fromString(obj.slug),
      obj.imageUrl,
      obj.order
    );
  }

  static fromSanity(obj: {
    _id: string;
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    icon: string;
    slug: { current: string };
    image?: string;
    order?: number;
  }): Category {
    return new Category(
      obj._id,
      LocaleString.fromSanity(obj.title),
      LocaleString.fromSanity(obj.description),
      CategoryIcon.fromSanity(obj.icon),
      Slug.fromSanity(obj.slug),
      obj.image,
      obj.order
    );
  }
}
