export type TranslationKeys =
  | "app_title"
  | "hello"
  | "items_count"
  | "price_tag"
  | "date_today"
  | "fallback_demo";

export type Locales = "en" | "ar" | "hi";

export interface I18nManagerType {
  locale: Locales;
  messages: Record<string, any>;
  fallbackMessages: Record<string, any>;
  loading: boolean;
  hour12: boolean;
  dateStylePref: string;
  isRTL: boolean;

  init(): Promise<void>;
  setLocale(newLocale: Locales): Promise<void>;
  subscribe(listener: () => void): () => void;
  tr(key: TranslationKeys, params?: Record<string, any>): string;
  formatNumber(value: number): string;
  formatCurrency(amount: number, currencyCode?: string): string;
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string;

  // Custom user clock & date format preferences
  setHour12(preference: boolean): void;
  setDateStylePref(style: string): void;
}
