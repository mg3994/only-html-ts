# Flutter-Style ARB i18n Engine in React 🌐

A lightweight, zero-dependency, production-ready Internationalization (i18n) engine for React applications. This system utilizes official **Flutter-style `.arb` (Application Resource Bundle) JSON files** for translation storage, supports advanced **ICU MessageFormat** (including sophisticated pluralization rules and variable interpolation), and leverages native browser `Intl` APIs for high performance.

---

## 🏗️ Architecture Design

The engine is built on five core architectural building blocks:

```
                  ┌─────────────────────────────────────┐
                  │      src/locales/{locale}.arb       │
                  │  (Translation Resource Bundle JSON)  │
                  └──────────────────┬──────────────────┘
                                     │ (Dynamic Import)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       src/i18n/I18nContext.tsx      │
                  │   (State & Dynamic Module Loader)   │
                  └──────────────────┬──────────────────┘
                                     │ (Exposes Context)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      src/i18n/useTranslation.ts     │
                  │   (Custom React Hook Consumer)      │
                  └──────────────────┬──────────────────┘
                                     │ (Exports tr() & Formatters)
                                     ▼
                  ┌─────────────────────────────────────┐
                  │             React UI Code           │
                  │       (App.tsx Dashboard / Pages)   │
                  └─────────────────────────────────────┘
```

1. **ARB File Format (`src/locales/`)**: Static translation and metadata definition files following official ARB JSON standards.
2. **ICU Parser (`src/i18n/arbParser.ts`)**: A robust, zero-dependency parser that recursively matches nested templates and handles ICU plurals (with numeric literals and category selectors) and value formatting.
3. **React Context (`src/i18n/I18nContext.tsx`)**: Global state provider managing active locale, loaded messages, dynamic import queues, and automatic DOM localization tag/direction rendering.
4. **Custom Hook (`src/i18n/useTranslation.ts`)**: Developer-friendly hook exposing the strictly-typed translation function `tr()` and pre-configured formatters.
5. **Strict TypeScript Typings (`src/i18n/types.ts`)**: Provides strict compiler checks mapping translation keys from the default template (`en.arb`) into a `TranslationKeys` union.

---

## 📁 Directory Structure

```
src/
├── locales/
│   ├── en.arb             # English (US) source translations & metadata
│   ├── ar.arb             # Arabic translations with RTL content
│   └── hi.arb             # Hindi translations
├── i18n/
│   ├── types.ts           # Strict TS Typings & I18n Context Interfaces
│   ├── arbParser.ts       # Zero-dependency ICU / ARB parser module
│   ├── I18nContext.tsx    # React Context Provider with dynamic bundle loaders
│   └── useTranslation.ts  # Custom react consumer hook
└── App.tsx                # Interactive CSS Logical Properties demonstration
```

---

## ⚡ Key Features

*   **Zero Bulky Dependencies**: Avoids bulky third-party libraries (like `i18next` or `react-intl`) by utilizing native browser `Intl` capabilities (`Intl.PluralRules`, `Intl.NumberFormat`, `Intl.DateTimeFormat`).
*   **Asynchronous Dynamic Bundles**: Locales are lazy-loaded via ES dynamic imports (`import()`) so only the active language resource bundle is downloaded, maximizing front-end performance.
*   **Tier-based Fallback Chain**: If a translation key is missing in the active locale (e.g. `ar`), it automatically falls back to `en`. If it is missing in both, it displays the verbatim raw key name.
*   **Automatic RTL & LTR Adaptation**: The context auto-detects language scripts and flips `document.documentElement.dir` (`"rtl"` or `"ltr"`) and updates `document.documentElement.lang`.
*   **Strict Compiler Validation**: Calling `tr("invalid_key")` raises a compile-time TypeScript error, preventing broken translations in production.

---

## 📖 API Reference

### `I18nProvider`
Wraps your application root and manages global localization state.

```tsx
import { I18nProvider } from "./i18n/I18nContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
```

### `useTranslation()` Hook
Returns localization states, locale changers, and pre-scoped formatters.

```typescript
const {
  locale,         // Currently active locale (e.g., "en", "ar")
  setLocale,      // (newLocale: string) => Promise<void>
  isRTL,          // Boolean indicating if language is Right-to-Left
  tr,             // Strict Translation function: tr(key, params)
  formatNumber,   // Scoped general number formatter
  formatCurrency, // Scoped currency formatter
  formatDate      // Scoped date formatter
} = useTranslation();
```
