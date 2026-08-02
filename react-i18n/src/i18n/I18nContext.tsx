import React, { createContext, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { I18nContextType, Locales } from "./types.ts";
import {
  parseArbMessage,
  formatCurrency,
  formatNumber,
  formatDate,
  getDefaultHour12,
  formatDateWithPreferences
} from "./arbParser.ts";

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

// A map of supported locale loaders using ES dynamic imports, placing "en" at the end as requested
const localeLoaders: Record<Locales, () => Promise<any>> = {
  ar: () => import("../locales/ar.arb.json"),
  hi: () => import("../locales/hi.arb.json"),
  en: () => import("../locales/en.arb.json"),
};

// Dynamically derive SUPPORTED_LOCALES list from loader registry keys
export const SUPPORTED_LOCALES = Object.keys(localeLoaders) as Locales[];

// Dynamically define DEFAULT_LOCALE fallback (preferring 'en' if supported, otherwise falling back to the first supported locale)
export const DEFAULT_LOCALE = (SUPPORTED_LOCALES.includes("en") ? "en" : SUPPORTED_LOCALES[0]) as Locales;

const RTL_LOCALES = new Set(["ar", "he", "ur", "fa", "ps", "yi"]);

const getInitialLocale = (): Locales => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  // 1. Check local storage
  const stored = localStorage.getItem("app_locale");
  if (stored && SUPPORTED_LOCALES.includes(stored as Locales)) {
    return stored as Locales;
  }

  // 2. Check navigator languages
  const languages = navigator.languages || [navigator.language];
  for (const lang of languages) {
    const code = lang.split("-")[0].toLowerCase() as Locales;
    if (SUPPORTED_LOCALES.includes(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
};

export interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locales>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [fallbackMessages, setFallbackMessages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // States for user clock & date formatting preferences
  const [hour12, setHour12State] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app_hour12");
      if (stored !== null) return stored === "true";
    }
    return getDefaultHour12();
  });

  const [dateStylePref, setDateStylePrefState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app_date_style");
      if (stored !== null) return stored;
    }
    return "long";
  });

  // State Persistence Setters
  const setHour12 = (preference: boolean) => {
    setHour12State(preference);
    localStorage.setItem("app_hour12", String(preference));
  };

  const setDateStylePref = (style: string) => {
    setDateStylePrefState(style);
    localStorage.setItem("app_date_style", style);
  };

  // Helper to load and cache locale messages
  const loadMessages = async (loc: Locales): Promise<Record<string, any>> => {
    try {
      const loader = localeLoaders[loc] || localeLoaders[DEFAULT_LOCALE];
      const module = await loader();
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load locale bundle for: ${loc}`, error);
      return {};
    }
  };

  // Exposed function to change active locale
  const setLocale = async (newLocale: string) => {
    const validatedLocale = (SUPPORTED_LOCALES.includes(newLocale as Locales) ? newLocale : DEFAULT_LOCALE) as Locales;

    setLoading(true);
    try {
      const activeData = await loadMessages(validatedLocale);
      setMessages(activeData);
      setLocaleState(validatedLocale);

      localStorage.setItem("app_locale", validatedLocale);
      document.documentElement.lang = validatedLocale;
      document.documentElement.dir = RTL_LOCALES.has(validatedLocale) ? "rtl" : "ltr";
    } catch (err) {
      console.error(`Failed to change locale to: ${newLocale}`, err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize the translations
  useEffect(() => {
    let active = true;
    async function init() {
      const initial = getInitialLocale();
      try {
        // Load default fallback and initial locale in parallel
        const [fallbackData, activeData] = await Promise.all([
          loadMessages(DEFAULT_LOCALE),
          initial !== DEFAULT_LOCALE ? loadMessages(initial) : Promise.resolve(null),
        ]);

        if (!active) return;

        setFallbackMessages(fallbackData);
        setMessages(activeData || fallbackData);
        setLocaleState(initial);

        localStorage.setItem("app_locale", initial);
        document.documentElement.lang = initial;
        document.documentElement.dir = RTL_LOCALES.has(initial) ? "rtl" : "ltr";
      } catch (err) {
        console.error("Failed to initialize i18n context", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // Effect to target the document body directly for full-screen loading, locking scroll and body styles
  useEffect(() => {
    if (loading && typeof document !== "undefined") {
      const originalOverflow = document.body.style.overflow;
      const originalBg = document.body.style.backgroundColor;

      document.body.style.overflow = "hidden";
      document.body.style.backgroundColor = "#f7fafc";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.backgroundColor = originalBg;
      };
    }
  }, [loading]);

  // Formatters scoped to the current locale, delegating to central formatter module for DRY compliance
  const formatNumberHelper = (value: number): string => {
    return formatNumber(value, locale);
  };

  const formatCurrencyHelper = (amount: number, currencyCode?: string): string => {
    return formatCurrency(amount, locale, currencyCode);
  };

  const formatDateHelper = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    return formatDateWithPreferences(date, locale, hour12, dateStylePref, options);
  };

  // Core tr translation function
  const tr = (key: string, params?: Record<string, any>): string => {
    // Skip metadata lookups
    if (key.startsWith("@") || key.startsWith("@@")) {
      return "";
    }

    // Pre-process any Date parameters dynamically using our preference-aware formatDateHelper!
    const processedParams = params ? { ...params } : {};
    if (params) {
      for (const k of Object.keys(params)) {
        if (params[k] instanceof Date) {
          processedParams[k] = formatDateHelper(params[k]);
        }
      }
    }

    // 1. Attempt to translate using active locale messages
    if (messages && key in messages) {
      return parseArbMessage(locale, messages[key], processedParams);
    }

    // 2. Attempt to fall back to default fallback translation
    if (fallbackMessages && key in fallbackMessages) {
      if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Key "${key}" missing in active locale "${locale}". Falling back to default "${DEFAULT_LOCALE}".`);
      }
      return parseArbMessage(DEFAULT_LOCALE, fallbackMessages[key], processedParams);
    }

    // 3. Raw fallback to the key itself
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Key "${key}" missing in both active "${locale}" and fallback "${DEFAULT_LOCALE}". Rendering raw key verbatim.`);
    }
    return key;
  };

  const isRTL = RTL_LOCALES.has(locale);

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    isRTL,
    tr: tr as any, // Cast to any to align with strictly typed TranslationKeys signature in consumers
    formatNumber: formatNumberHelper,
    formatCurrency: formatCurrencyHelper,
    formatDate: formatDateHelper,

    // Preferences
    hour12,
    setHour12,
    dateStylePref,
    setDateStylePref,
  };

  // Render a beautiful, custom 3D animated SVG Origami folding logo via createPortal directly targeting document.body
  const loaderPortal = loading && typeof document !== "undefined"
    ? createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#4a5568",
          backgroundColor: "#f7fafc",
          zIndex: 999999
        }}>
          <div style={{ width: "200px", height: "200px", marginBottom: "24px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" id="antinna-logo">
              <defs>
                {/* Master Outer Boundary Clip Path */}
                <clipPath id="antinna-smooth-diagonal-boundary">
                  <path d="
                    M 250,105
                    C 210,105 160,45 110,45
                    C 65,45 30,80 30,125
                    C 30,170 30,330 30,375
                    C 30,420 65,455 110,455
                    C 160,455 210,395 250,395
                    C 290,395 340,455 390,455
                    C 435,455 470,420 470,375
                    C 470,330 470,170 470,125
                    C 470,80 435,45 390,45
                    C 340,45 290,105 250,105
                    Z"
                  />
                </clipPath>

                {/* Embedded CSS 3D Origami Folding Styles */}
                <style dangerouslySetInnerHTML={{__html: `
                  #antinna-logo {
                    perspective: 1200px;
                    overflow: visible;
                  }

                  #logo-body {
                    transform-style: preserve-3d;
                  }

                  /* Base transition & animation configuration */
                  .lobe, .facet {
                    transform-box: fill-box;
                    animation-duration: 4.5s;
                    animation-iteration-count: infinite;
                    animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
                    animation-direction: alternate;
                  }

                  /* STAGE 1: Outer Background Lobes (Fold down/up outward) */
                  #lobe-top-left {
                    transform-origin: 250px 105px;
                    animation-name: fold-lobe-tl;
                  }
                  #lobe-top-right {
                    transform-origin: 250px 105px;
                    animation-name: fold-lobe-tr;
                  }
                  #lobe-bottom-left {
                    transform-origin: 250px 395px;
                    animation-name: fold-lobe-bl;
                  }
                  #lobe-bottom-right {
                    transform-origin: 250px 395px;
                    animation-name: fold-lobe-br;
                  }

                  /* STAGE 2: Side Shadow Wings (Book-page fold along outer vertical vertices) */
                  #shadow-left {
                    transform-origin: 140px 250px;
                    animation-name: fold-wing-left;
                    animation-delay: 0.15s;
                  }
                  #shadow-right {
                    transform-origin: 360px 250px;
                    animation-name: fold-wing-right;
                    animation-delay: 0.15s;
                  }

                  /* STAGE 3: Inner Diamond Facets (Diagonal origami crease fold toward center) */
                  #facet-cyan {
                    transform-origin: 250px 250px;
                    animation-name: fold-facet-cyan;
                    animation-delay: 0.3s;
                  }
                  #facet-blue {
                    transform-origin: 250px 250px;
                    animation-name: fold-facet-blue;
                    animation-delay: 0.3s;
                  }
                  #facet-rust {
                    transform-origin: 250px 250px;
                    animation-name: fold-facet-rust;
                    animation-delay: 0.3s;
                  }
                  #facet-orange {
                    transform-origin: 250px 250px;
                    animation-name: fold-facet-orange;
                    animation-delay: 0.3s;
                  }

                  /* --- KEYFRAMES --- */

                  /* Outer Lobes */
                  @keyframes fold-lobe-tl {
                    0%, 15% { transform: rotate3d(1, -1, 0, 0deg) scale(1); opacity: 1; }
                    55%, 100% { transform: rotate3d(1, -1, 0, 110deg) scale(0.2); opacity: 0.2; }
                  }
                  @keyframes fold-lobe-tr {
                    0%, 15% { transform: rotate3d(1, 1, 0, 0deg) scale(1); opacity: 1; }
                    55%, 100% { transform: rotate3d(1, 1, 0, -110deg) scale(0.2); opacity: 0.2; }
                  }
                  @keyframes fold-lobe-bl {
                    0%, 15% { transform: rotate3d(1, 1, 0, 0deg) scale(1); opacity: 1; }
                    55%, 100% { transform: rotate3d(1, 1, 0, 110deg) scale(0.2); opacity: 0.2; }
                  }
                  @keyframes fold-lobe-br {
                    0%, 15% { transform: rotate3d(1, -1, 0, 0deg) scale(1); opacity: 1; }
                    55%, 100% { transform: rotate3d(1, -1, 0, -110deg) scale(0.2); opacity: 0.2; }
                  }

                  /* Side Wings */
                  @keyframes fold-wing-left {
                    0%, 15% { transform: rotateY(0deg); opacity: 1; }
                    55%, 100% { transform: rotateY(-135deg) scale(0.5); opacity: 0.3; }
                  }
                  @keyframes fold-wing-right {
                    0%, 15% { transform: rotateY(0deg); opacity: 1; }
                    55%, 100% { transform: rotateY(135deg) scale(0.5); opacity: 0.3; }
                  }

                  /* Inner Diamond Facets */
                  @keyframes fold-facet-cyan {
                    0%, 15% { transform: rotate3d(-1, 1, 0, 0deg) translateZ(0px); }
                    55%, 100% { transform: rotate3d(-1, 1, 0, 85deg) translateZ(-40px); }
                  }
                  @keyframes fold-facet-blue {
                    0%, 15% { transform: rotate3d(1, 1, 0, 0deg) translateZ(0px); }
                    55%, 100% { transform: rotate3d(1, 1, 0, -85deg) translateZ(-40px); }
                  }
                  @keyframes fold-facet-rust {
                    0%, 15% { transform: rotate3d(1, 1, 0, 0deg) translateZ(0px); }
                    55%, 100% { transform: rotate3d(1, 1, 0, 85deg) translateZ(-40px); }
                  }
                  @keyframes fold-facet-orange {
                    0%, 15% { transform: rotate3d(-1, 1, 0, 0deg) translateZ(0px); }
                    55%, 100% { transform: rotate3d(-1, 1, 0, -85deg) translateZ(-40px); }
                  }
                `}} />
              </defs>

              {/* Main Container Clipped to the Boundary */}
              <g id="logo-body" clipPath="url(#antinna-smooth-diagonal-boundary)">

                {/* LAYER 1: Four Main Quadrant Background Lobes */}
                <g id="outer-lobes">
                  <polygon id="lobe-top-left" className="lobe green" points="0,0 250,0 250,105 140,177.5 30,250 0,250" fill="#23A16D" />
                  <polygon id="lobe-top-right" className="lobe indigo" points="250,0 500,0 500,250 470,250 360,177.5 250,105" fill="#5962A0" />
                  <polygon id="lobe-bottom-left" className="lobe red" points="0,250 30,250 140,322.5 250,395 250,500 0,500" fill="#E03E2E" />
                  <polygon id="lobe-bottom-right" className="lobe amber" points="470,250 500,250 500,500 250,500 250,395 360,322.5" fill="#F19E23" />
                </g>

                {/* LAYER 2: Side Shadow Triangles */}
                <g id="shadow-facets">
                  <polygon id="shadow-left" className="facet shadow" points="30,250 140,177.5 140,322.5" fill="#58538A" />
                  <polygon id="shadow-right" className="facet shadow" points="470,250 360,177.5 360,322.5" fill="#424963" />
                </g>

                {/* LAYER 3: Inner Diamond Facets */}
                <g id="inner-facets">
                  <polygon id="facet-cyan" className="facet cyan" points="250,105 140,177.5 250,250" fill="#2B90D9" />
                  <polygon id="facet-blue" className="facet blue" points="250,105 250,250 360,177.5" fill="#2472B8" />
                  <polygon id="facet-rust" className="facet rust" points="250,250 140,322.5 250,395" fill="#CF3B27" />
                  <polygon id="facet-orange" className="facet orange" points="250,250 250,395 360,322.5" fill="#E55A1F" />
                </g>

                {/* LAYER 4: Center Bowtie / Infinity Core , Transparent core */}
                <g id="white-core">
                  <polygon id="bowtie-left" className="facet bowtie" points="140,177.5 250,250 140,322.5" fill="none" />
                  <polygon id="bowtie-right" className="facet bowtie" points="360,177.5 250,250 360,322.5" fill="none" />
                </g>

              </g>
            </svg>
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#475569", letterSpacing: "0.05em" }}>
            Initializing Localization Engine...
          </div>
        </div>,
        document.body
      )
    : null;

  if (loading) {
    return loaderPortal;
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
