/**
 * Value Object: Slug
 * 
 * Represents a URL-safe identifier for products and categories.
 * Enforces invariants: non-empty, lowercase alphanumeric with hyphens.
 */
export class Slug {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }
    
    const normalized = value.toLowerCase().trim();
    
    // Validate: only lowercase letters, numbers, and hyphens
    if (!/^[a-z0-9-]+$/.test(normalized)) {
      throw new Error(`Invalid slug format: "${value}". Must be lowercase alphanumeric with hyphens.`);
    }
    
    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }

  toDOM(): string {
    // Convert slug to display-friendly format (replace hyphens with spaces)
    return this.value.replace(/-/g, ' ');
  }

  equals(other: Slug): boolean {
    return this.value === other.toString();
  }

  static fromString(value: string): Slug {
    return new Slug(value);
  }

  static fromSanity(obj: { current: string }): Slug {
    return new Slug(obj.current);
  }
}
