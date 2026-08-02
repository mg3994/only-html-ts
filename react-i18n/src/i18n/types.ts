export type TranslationKeys =
  | "app_title"
  | "hello"
  | "items_count"
  | "price_tag"
  | "date_today"
  | "fallback_demo";

export type Locales = "en" | "ar" | "hi";

export interface I18nContextType {
  locale: string;
  setLocale: (newLocale: string) => Promise<void>;
  isRTL: boolean;
  tr: (key: TranslationKeys, params?: Record<string, any>) => string;
  formatNumber: (value: number) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;

  // Custom user clock & date format preferences
  hour12: boolean;
  setHour12: (preference: boolean) => void;
  dateStylePref: string;
  setDateStylePref: (style: string) => void;
}
