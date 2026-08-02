# Example: Basic i18n Integration in React

This guide demonstrates how to perform a minimal integration of our ARB localization engine into a standard React components tree.

---

## 1. Setup Locale Bundle Files

Create a default language bundle in `src/locales/en.arb`:

```json
{
  "@@locale": "en",
  "app_title": "My Awesome App",
  "hello": "Hello {name}!",
  "@hello": {
    "placeholders": {
      "name": {}
    }
  }
}
```

---

## 2. Initialize Types

Declare all supported keys in `src/i18n/types.ts`:

```typescript
export type TranslationKeys = "app_title" | "hello";
export type Locales = "en" | "ar" | "hi";

export interface I18nContextType {
  locale: string;
  setLocale: (newLocale: string) => Promise<void>;
  isRTL: boolean;
  tr: (key: TranslationKeys, params?: Record<string, any>) => string;
  formatNumber: (value: number) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}
```

---

## 3. Bootstrap Provider

Wrap your main React application entrypoint with the `I18nProvider` from `src/i18n/I18nContext.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { I18nProvider } from "./i18n/I18nContext";
import { Dashboard } from "./Dashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <Dashboard />
    </I18nProvider>
  </React.StrictMode>
);
```

---

## 4. Consume Translations in Components

Use the custom `useTranslation` hook inside your layout or dashboard components:

```tsx
import React, { useState } from "react";
import { useTranslation } from "./i18n/useTranslation";

export const Dashboard: React.FC = () => {
  const { tr, locale, setLocale, isRTL } = useTranslation();
  const [username, setUsername] = useState("Jane");

  return (
    <div style={{ padding: "20px", direction: isRTL ? "rtl" : "ltr" }}>
      {/* Title */}
      <h1>{tr("app_title")}</h1>

      {/* Dynamic Interpolation */}
      <p>{tr("hello", { name: username })}</p>

      {/* Input to alter interpolation state */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Language Switching buttons */}
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => setLocale("en")}>English</button>
        <button onClick={() => setLocale("ar")}>العربية</button>
        <button onClick={() => setLocale("hi")}>हिन्दी</button>
      </div>
    </div>
  );
};
```
