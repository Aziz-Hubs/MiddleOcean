/**
 * Value Object: ProductSpec
 * 
 * Represents a product specification as a key-value pair.
 * Enforces invariants: non-empty key and non-null value.
 */
export class ProductSpec {
  private readonly key: string;
  private readonly value: string;

  constructor(key: string, value: string) {
    const normalizedKey = key?.trim() ?? '';
    
    if (normalizedKey.length === 0) {
      throw new Error('Specification key cannot be empty');
    }
    
    this.key = normalizedKey;
    this.value = value ?? '';
  }

  getKey(): string {
    return this.key;
  }

  getValue(): string {
    return this.value;
  }

  toObject(): { key: string; value: string } {
    return { key: this.key, value: this.value };
  }

  static fromObject(obj: { key: string; value: string }): ProductSpec {
    return new ProductSpec(obj.key, obj.value);
  }

  static fromSanity(obj: { key: string; value: string }): ProductSpec {
    return new ProductSpec(obj.key, obj.value);
  }
}
