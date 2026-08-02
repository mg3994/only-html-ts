import { Locales, TranslationKeys } from "./types.ts";
import {
  parseArbMessage,
  formatCurrency,
  formatNumber,
  getDefaultHour12,
  formatDateWithPreferences
} from "./arbParser.ts";

const localeLoaders: Record<Locales, () => Promise<any>> = {
  ar: () => import("../locales/ar.arb.json"),
  hi: () => import("../locales/hi.arb.json"),
  en: () => import("../locales/en.arb.json"),
};

export const SUPPORTED_LOCALES = Object.keys(localeLoaders) as Locales[];
export const DEFAULT_LOCALE = (SUPPORTED_LOCALES.includes("en") ? "en" : SUPPORTED_LOCALES[0]) as Locales;

const RTL_LOCALES = new Set(["ar", "he", "ur", "fa", "ps", "yi"]);

const getInitialLocale = (): Locales => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = localStorage.getItem("app_locale");
  if (stored && SUPPORTED_LOCALES.includes(stored as Locales)) {
    return stored as Locales;
  }

  const languages = navigator.languages || [navigator.language];
  for (const lang of languages) {
    const code = lang.split("-")[0].toLowerCase() as Locales;
    if (SUPPORTED_LOCALES.includes(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
};

export type I18nListener = () => void;

export class I18nManager {
  public locale: Locales = DEFAULT_LOCALE;
  public messages: Record<string, any> = {};
  public fallbackMessages: Record<string, any> = {};
  public loading: boolean = true;
  public hour12: boolean = true;
  public dateStylePref: string = "long";

  private listeners: Set<I18nListener> = new Set();

  constructor() {
    this.hour12 = this.getInitialHour12();
    this.dateStylePref = this.getInitialDateStylePref();
  }

  private getInitialHour12(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app_hour12");
      if (stored !== null) return stored === "true";
    }
    return getDefaultHour12();
  }

  private getInitialDateStylePref(): string {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app_date_style");
      if (stored !== null) return stored;
    }
    return "long";
  }

  public subscribe(listener: I18nListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private async loadMessages(loc: Locales): Promise<Record<string, any>> {
    try {
      const loader = localeLoaders[loc] || localeLoaders[DEFAULT_LOCALE];
      const module = await loader();
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load locale bundle for: ${loc}`, error);
      return {};
    }
  }

  public async init() {
    this.loading = true;
    this.notify();

    const initial = getInitialLocale();
    try {
      const [fallbackData, activeData] = await Promise.all([
        this.loadMessages(DEFAULT_LOCALE),
        initial !== DEFAULT_LOCALE ? this.loadMessages(initial) : Promise.resolve(null),
      ]);

      this.fallbackMessages = fallbackData;
      this.messages = activeData || fallbackData;
      this.locale = initial;

      localStorage.setItem("app_locale", initial);
      document.documentElement.lang = initial;
      document.documentElement.dir = RTL_LOCALES.has(initial) ? "rtl" : "ltr";
    } catch (err) {
      console.error("Failed to initialize i18n manager", err);
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  public async setLocale(newLocale: string) {
    const validatedLocale = (SUPPORTED_LOCALES.includes(newLocale as Locales) ? newLocale : DEFAULT_LOCALE) as Locales;

    this.loading = true;
    this.notify();

    try {
      const activeData = await this.loadMessages(validatedLocale);
      this.messages = activeData;
      this.locale = validatedLocale;

      localStorage.setItem("app_locale", validatedLocale);
      document.documentElement.lang = validatedLocale;
      document.documentElement.dir = RTL_LOCALES.has(validatedLocale) ? "rtl" : "ltr";
    } catch (err) {
      console.error(`Failed to change locale to: ${newLocale}`, err);
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  public setHour12(preference: boolean) {
    this.hour12 = preference;
    localStorage.setItem("app_hour12", String(preference));
    this.notify();
  }

  public setDateStylePref(style: string) {
    this.dateStylePref = style;
    localStorage.setItem("app_date_style", style);
    this.notify();
  }

  public get isRTL(): boolean {
    return RTL_LOCALES.has(this.locale);
  }

  public formatNumber(value: number): string {
    return formatNumber(value, this.locale);
  }

  public formatCurrency(amount: number, currencyCode?: string): string {
    return formatCurrency(amount, this.locale, currencyCode);
  }

  public formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    return formatDateWithPreferences(date, this.locale, this.hour12, this.dateStylePref, options);
  }

  public tr(key: TranslationKeys, params?: Record<string, any>): string {
    if (key.startsWith("@") || key.startsWith("@@")) {
      return "";
    }

    const processedParams = params ? { ...params } : {};
    if (params) {
      for (const k of Object.keys(params)) {
        if (params[k] instanceof Date) {
          processedParams[k] = this.formatDate(params[k]);
        }
      }
    }

    if (this.messages && key in this.messages) {
      return parseArbMessage(this.locale, this.messages[key], processedParams);
    }

    if (this.fallbackMessages && key in this.fallbackMessages) {
      return parseArbMessage(DEFAULT_LOCALE, this.fallbackMessages[key], processedParams);
    }

    return key;
  }
}
