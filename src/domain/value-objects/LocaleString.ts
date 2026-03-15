/**
 * Value Object: LocaleString
 * 
 * Represents a multi-language string with English and Arabic translations.
 * Enforces invariants: both locales must be non-empty strings.
 */
export class LocaleString {
  private readonly en: string;
  private readonly ar: string;

  constructor(en: string, ar: string) {
    const normalizedEn = en?.trim() ?? '';
    const normalizedAr = ar?.trim() ?? '';
    
    if (normalizedEn.length === 0) {
      throw new Error('English locale cannot be empty');
    }
    
    if (normalizedAr.length === 0) {
      throw new Error('Arabic locale cannot be empty');
    }
    
    this.en = normalizedEn;
    this.ar = normalizedAr;
  }

  get(locale: 'en' | 'ar'): string {
    return locale === 'en' ? this.en : this.ar;
  }

  toObject(): { en: string; ar: string } {
    return { en: this.en, ar: this.ar };
  }

  toString(locale?: 'en' | 'ar'): string {
    return locale ? this.get(locale) : this.en;
  }

  static fromSanity(obj: { en: string; ar: string }): LocaleString {
    return new LocaleString(obj.en, obj.ar);
  }

  static fromObject(obj: { en: string; ar: string }): LocaleString {
    return new LocaleString(obj.en, obj.ar);
  }
}
