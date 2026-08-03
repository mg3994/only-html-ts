/**
 * Handles localized number, currency, and date/time formatting.
 * Single Responsibility: Format parameters and primitive values for specific locales.
 */

const RTL_LOCALES = new Set(["ar", "he", "ur", "fa", "ps", "yi"]);

// Globally resolved and exported timezone constant to be accessed by other features in the future.
export const currentTimeZone: string = (() => {
  try {
    if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
  } catch (err) {
    console.error("Failed to resolve timezone on boot", err);
  }
  return "UTC";
})();

// A map of major currencies to their designated formatting locales.
// Handles RTL-script Middle Eastern currencies and South Asian currencies (like INR)
// to enforce proper, localized numbering and digit-grouping conventions (e.g. lakh/crore grouping for INR).
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  // RTL-script currencies
  SAR: "ar-SA", // Saudi Riyal (ر.س.)
  AED: "ar-AE", // UAE Dirham (د.إ.)
  QAR: "ar-QA", // Qatari Riyal (ر.ق.)
  KWD: "ar-KW", // Kuwaiti Dinar (د.ك.)
  OMR: "ar-OM", // Omani Rial (ر.ع.)
  BHD: "ar-BH", // Bahraini Dinar (د.ب.)
  EGP: "ar-EG", // Egyptian Pound (ج.م.)
  JOD: "ar-JO", // Jordanian Dinar (د.أ.)
  LBP: "ar-LB", // Lebanese Pound (ل.ل.)

  // South Asian lakh/crore group convention currencies
  INR: "en-IN", // Indian Rupee (₹) - forces the 2-digit and 3-digit South Asian grouping (e.g. 1,49,999.00)
};

// Map of major timezone patterns to their corresponding local currency codes.
const TIMEZONE_CURRENCY_MAP: Array<{ pattern: string | RegExp; currency: string }> = [
  {
    pattern: /Riyadh|Aden|Baghdad|Kuwait|Bahrain|Qatar|Medinah|Mecca|Jeddah/i,
    currency: "SAR"
  }, // Arabian Peninsulas defaulting to SAR for RTL showcase
  {
    pattern: /Kolkata|Calcutta|Delhi|Mumbai|Bombay|Bangalore|Bengaluru|Chennai|Madras|Hyderabad|Pune|Ahmedabad|IST/i,
    currency: "INR"
  }, // Indian Standard Time
  {
    pattern: /Dubai|AbuDhabi|Muscat/i,
    currency: "AED"
  }, // Gulf Standard Time
  {
    pattern: /Qatar|Bahrain/i,
    currency: "QAR"
  }, // Qatar
  {
    pattern: /^Europe\/|Paris|Berlin|Rome|Madrid|Brussels|Amsterdam|Vienna|Dublin/i,
    currency: "EUR"
  }, // Eurozone
  {
    pattern: /London|Belfast|GMT|BST/i,
    currency: "GBP"
  }, // United Kingdom
  {
    pattern: /^America\/|New_York|Chicago|Los_Angeles|Toronto/i,
    currency: "USD"
  }, // Americas defaulting to USD
];

/**
 * Resolves the browser's default hour12 clock format (true if 12-hour, false if 24-hour).
 */
export function getDefaultHour12(): boolean {
  try {
    const resolved = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions();
    return resolved.hour12 !== false;
  } catch (e) {
    return true;
  }
}

/**
 * Resolves the user's localized currency code based on their browser/runtime timezone settings.
 * Employs robust pattern matching with a fall-safe default to 'USD'.
 */
export function getDefaultCurrency(): string {
  try {
    if (currentTimeZone) {
      for (const mapping of TIMEZONE_CURRENCY_MAP) {
        if (typeof mapping.pattern === "string") {
          if (currentTimeZone.includes(mapping.pattern)) {
            return mapping.currency;
          }
        } else if (mapping.pattern instanceof RegExp) {
          if (mapping.pattern.test(currentTimeZone)) {
            return mapping.currency;
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to detect local currency from timezone, falling back to USD", error);
  }
  return "USD";
}

export function formatValue(val: any, locale: string): string {
  if (val instanceof Date) {
    return formatDate(val, locale);
  }
  if (typeof val === "number") {
    return formatNumber(val, locale);
  }
  return String(val);
}

export function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch (e) {
    return String(value);
  }
}

export function formatCurrency(amount: number, locale: string, currencyCode = "USD"): string {
  try {
    // If the currency has a designated formatting locale (such as ar-SA for SAR or en-IN for INR), force its use
    const effectiveLocale = CURRENCY_LOCALE_MAP[currencyCode] || locale;
    return new Intl.NumberFormat(effectiveLocale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (e) {
    return `${currencyCode} ${amount}`;
  }
}

/**
 * Dynamic preference-aware date-time formatter supporting custom style structures.
 * Completely immune to browser-native TypeErrors caused by mixing dateStyle/timeStyle with components.
 */
export function formatDateWithPreferences(
  date: Date | string,
  locale: string,
  hour12: boolean,
  stylePref: string,
  baseOptions?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);

  // If invalid date object, fallback gracefully
  if (isNaN(d.getTime())) {
    return String(date);
  }

  // Detect if baseOptions or the preference requested custom time parts (hour/minute/second)
  const hasTimeComponents = !!(
    baseOptions?.hour ||
    baseOptions?.minute ||
    baseOptions?.second ||
    (baseOptions && "hour12" in baseOptions)
  );

  // If a standard style preference (short, medium, long, full) is active
  if (["short", "medium", "long", "full"].includes(stylePref)) {
    try {
      let dtfOptions: Intl.DateTimeFormatOptions = {};

      if (hasTimeComponents) {
        // CRITICAL COMPILER BUG FIX: We CANNOT mix dateStyle/timeStyle with granular component options
        // (like hour, minute, second) inside Intl.DateTimeFormat, or browsers raise an immediate TypeError!
        // To satisfy this restriction, we safely map stylePref into standard component equivalents,
        // completely purging dateStyle / timeStyle keys from the merged options.
        if (stylePref === "short") {
          dtfOptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
        } else if (stylePref === "medium") {
          dtfOptions = { day: "numeric", month: "short", year: "numeric" };
        } else if (stylePref === "long") {
          dtfOptions = { day: "numeric", month: "long", year: "numeric" };
        } else if (stylePref === "full") {
          dtfOptions = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
        }

        // Merge remaining custom options from baseOptions, strictly stripping out illegal dateStyle / timeStyle properties
        // and avoiding passing any keys with undefined values to prevent crashes in older webviews.
        if (baseOptions) {
          for (const [key, value] of Object.entries(baseOptions)) {
            if (key !== "dateStyle" && key !== "timeStyle" && value !== undefined) {
              (dtfOptions as any)[key] = value;
            }
          }
        }

        // Force user's preferred hour12 setting
        dtfOptions.hour12 = hour12;
      } else {
        // No custom components, we can safely and cleanly use the high-level dateStyle property
        if (stylePref === "short") dtfOptions.dateStyle = "short";
        else if (stylePref === "medium") dtfOptions.dateStyle = "medium";
        else if (stylePref === "long") dtfOptions.dateStyle = "long";
        else if (stylePref === "full") dtfOptions.dateStyle = "full";
      }

      return new Intl.DateTimeFormat(locale, dtfOptions).format(d);
    } catch (e) {
      console.error("Standard dateStyle formatting failed, falling back", e);
    }
  }

  // Handle custom slash patterns (e.g., DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD) via formatToParts()
  // to perfectly preserve native locale numbers (Arabic glyphs, Devnagari, etc.)
  try {
    const dtfOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: hour12,
    };

    if (hasTimeComponents) {
      dtfOptions.hour = baseOptions?.hour || "2-digit";
      dtfOptions.minute = baseOptions?.minute || "2-digit";
      if (baseOptions?.second) {
        dtfOptions.second = baseOptions.second;
      }
    }

    const partsFormatter = new Intl.DateTimeFormat(locale, dtfOptions);
    const parts = partsFormatter.formatToParts(d);
    const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

    // Construct correct slash string
    let dateStr = "";
    if (stylePref === "MM/DD/YYYY") {
      dateStr = `${partMap.month}/${partMap.day}/${partMap.year}`;
    } else if (stylePref === "YYYY/MM/DD") {
      dateStr = `${partMap.year}/${partMap.month}/${partMap.day}`;
    } else {
      // Default / Fallback format is DD/MM/YYYY
      dateStr = `${partMap.day}/${partMap.month}/${partMap.year}`;
    }

    // Append hour/minute localized pieces if necessary
    if (partMap.hour && partMap.minute) {
      const timeStr = `${partMap.hour}:${partMap.minute}${partMap.dayPeriod ? " " + partMap.dayPeriod : ""}`;
      return RTL_LOCALES.has(locale) ? `${timeStr} ، ${dateStr}` : `${dateStr}, ${timeStr}`;
    }

    return dateStr;
  } catch (error) {
    console.error("Slashes formatting failed, falling back to toDateString()", error);
    try {
      return new Intl.DateTimeFormat(locale, baseOptions).format(d);
    } catch (fallbackError) {
      return d.toDateString();
    }
  }
}

export function formatDate(date: Date | string, locale: string, options?: Intl.DateTimeFormatOptions): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  try {
    // Strip out undefined values to satisfy older browser environments
    const cleanOptions: Intl.DateTimeFormatOptions = {};
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        if (value !== undefined) {
          (cleanOptions as any)[key] = value;
        }
      }
    }
    return new Intl.DateTimeFormat(locale, cleanOptions).format(d);
  } catch (e) {
    console.error("formatDate instantiation failed, falling back to toDateString()", e);
    return d.toDateString();
  }
}

export function getStyleFromIcuString(style: string): Intl.DateTimeFormatOptions {
  const options: Intl.DateTimeFormatOptions = {};
  if (style === "short") {
    options.dateStyle = "short";
  } else if (style === "medium") {
    options.dateStyle = "medium";
  } else if (style === "long") {
    options.dateStyle = "long";
  } else if (style === "full") {
    options.dateStyle = "full";
  }
  return options;
}
