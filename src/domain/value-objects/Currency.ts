/**
 * Value Object: Currency
 * 
 * Represents monetary amounts with ISO 4217 currency codes.
 * Supports common currencies used in the region (SAR, AED, USD, EUR).
 */
export class Currency {
  private static readonly VALID_CURRENCIES = ['SAR', 'AED', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
  private static readonly DEFAULT_CURRENCY = 'SAR';
  
  private readonly code: typeof Currency.VALID_CURRENCIES[number];
  private readonly amount: number;

  constructor(amount: number, code: typeof Currency.VALID_CURRENCIES[number] = Currency.DEFAULT_CURRENCY) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    
    if (!Currency.VALID_CURRENCIES.includes(code as typeof Currency.VALID_CURRENCIES[number])) {
      throw new Error(`Invalid currency code: ${code}. Must be one of: ${Currency.VALID_CURRENCIES.join(', ')}`);
    }
    
    this.code = code;
    this.amount = amount;
  }

  getCode(): string {
    return this.code;
  }

  getAmount(): number {
    return this.amount;
  }

  format(locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.code,
    }).format(this.amount);
  }

  static fromSanity(obj: { amount?: number; currency?: string }): Currency {
    const code = (obj.currency?.toUpperCase() as typeof Currency.VALID_CURRENCIES[number] | undefined) ?? Currency.DEFAULT_CURRENCY;
    const amount = obj.amount ?? 0;
    return new Currency(amount, code);
  }

  static fromObject(obj: { amount: number; currency: string }): Currency {
    const code = obj.currency.toUpperCase() as typeof Currency.VALID_CURRENCIES[number];
    return new Currency(obj.amount, code);
  }

  static sar(amount: number): Currency {
    return new Currency(amount, 'SAR');
  }

  static aed(amount: number): Currency {
    return new Currency(amount, 'AED');
  }

  static usd(amount: number): Currency {
    return new Currency(amount, 'USD');
  }
}
