import React, { useState } from "react";
import { I18nProvider } from "./i18n/I18nContext.tsx";
import { useTranslation } from "./i18n/useTranslation.ts";
import { getDefaultCurrency } from "./i18n/arbParser.ts";
import { AppStyles } from "./AppStyles.ts";

/**
 * SRP COMPONENT: Header
 * Displays the application logo, title, and language selector dropdown.
 */
const Header: React.FC = () => {
  const { tr, locale, setLocale } = useTranslation();

  return (
    <header style={AppStyles.header}>
      <div style={AppStyles.headerTitleContainer}>
        <span style={{ fontSize: "2rem" }}>🌐</span>
        <h1 style={AppStyles.headerTitle}>
          {tr("app_title")}
        </h1>
      </div>

      {/* Language Selector */}
      <div style={AppStyles.languageSelectorContainer}>
        <label htmlFor="locale-select" style={AppStyles.preferencesLabel}>
          Language / لغة / भाषा:
        </label>
        <select
          id="locale-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          style={AppStyles.languageSelect}
        >
          <option value="en">English (US)</option>
          <option value="ar">العربية (Arabic)</option>
          <option value="hi">हिन्दी (Hindi)</option>
        </select>
      </div>
    </header>
  );
};

/**
 * SRP COMPONENT: PreferencesCard
 * Manages states and actions for user clock preferences and date styles.
 */
const PreferencesCard: React.FC = () => {
  const { hour12, setHour12, dateStylePref, setDateStylePref } = useTranslation();

  return (
    <div style={AppStyles.preferencesCard}>
      <div style={AppStyles.preferencesTitleContainer}>
        <span style={{ fontSize: "1.5rem" }}>⚙️</span>
        <h3 style={AppStyles.preferencesTitle}>
          User Formatting Preferences:
        </h3>
      </div>

      {/* 12-Hour vs 24-Hour clock switch */}
      <div style={AppStyles.preferencesControlRow}>
        <span style={AppStyles.preferencesLabel}>Time Format:</span>
        <button
          onClick={() => setHour12(true)}
          style={AppStyles.preferencesButton(hour12)}
        >
          12-Hour (AM/PM)
        </button>
        <button
          onClick={() => setHour12(false)}
          style={AppStyles.preferencesButton(!hour12)}
        >
          24-Hour
        </button>
      </div>

      {/* Preferred Date Style Selector */}
      <div style={AppStyles.preferencesControlRow}>
        <label htmlFor="date-style-select" style={AppStyles.preferencesLabel}>
          Date Format:
        </label>
        <select
          id="date-style-select"
          value={dateStylePref}
          onChange={(e) => setDateStylePref(e.target.value)}
          style={AppStyles.preferencesSelect}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY (Slashes)</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY (Slashes)</option>
          <option value="YYYY/MM/DD">YYYY/MM/DD (Slashes)</option>
          <option value="medium">Medium Word-based</option>
          <option value="long">Long Word-based</option>
          <option value="full">Full Word-based (Day Name)</option>
        </select>
      </div>
    </div>
  );
};

/**
 * SRP COMPONENT: InfoBanner
 * Renders active localization metadata from React context.
 */
const InfoBanner: React.FC = () => {
  const { locale, isRTL } = useTranslation();

  return (
    <div style={AppStyles.infoBanner}>
      <div>
        <strong>Active Locale:</strong> <code style={AppStyles.infoBannerCode}>{locale}</code>
      </div>
      <div>
        <strong>HTML Dir:</strong> <code style={AppStyles.infoBannerCode}>{isRTL ? "rtl (RTL)" : "ltr (LTR)"}</code>
      </div>
      <div>
        <strong>HTML Lang:</strong> <code style={AppStyles.infoBannerCode}>{locale}</code>
      </div>
    </div>
  );
};

/**
 * SRP COMPONENT: InterpolationCard
 * Displays variable-interpolated greetings.
 */
interface InterpolationCardProps {
  name: string;
  setName: (val: string) => void;
}
const InterpolationCard: React.FC<InterpolationCardProps> = ({ name, setName }) => {
  const { tr } = useTranslation();

  return (
    <section style={AppStyles.card}>
      <div>
        <div style={AppStyles.cardHeader}>
          <span style={{ fontSize: "1.25rem" }}>👋</span>
          <h2 style={AppStyles.cardTitle}>
            Interpolation & Variables
          </h2>
        </div>
        <p style={AppStyles.cardDescription}>
          Type a name below to see the ARB template <code>"hello": "Hello &#123;name&#125;!"</code> update in real-time.
        </p>

        <div style={AppStyles.inputGroup}>
          <label style={AppStyles.inputLabel}>
            Enter Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={AppStyles.inputText}
          />
        </div>
      </div>

      <div style={AppStyles.outputBox("#3b82f6")}>
        <div style={AppStyles.outputLabel}>
          Interpolated Output:
        </div>
        <div style={AppStyles.outputValue("#1e3a8a", "1.5rem")}>
          {tr("hello", { name })}
        </div>
      </div>
    </section>
  );
};

/**
 * SRP COMPONENT: PluralizationCard
 * Manages live counters and lists standard Plural Selectors.
 */
interface PluralizationCardProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}
const PluralizationCard: React.FC<PluralizationCardProps> = ({ count, setCount }) => {
  const { tr, locale, formatNumber } = useTranslation();

  return (
    <section style={AppStyles.card}>
      <div>
        <div style={AppStyles.cardHeader}>
          <span style={{ fontSize: "1.25rem" }}>🔢</span>
          <h2 style={AppStyles.cardTitle}>
            ICU Pluralization System
          </h2>
        </div>
        <p style={AppStyles.cardDescription}>
          Plural rules differ significantly by language. Arabic supports 6 distinct forms, while Hindi and English support 2. Click options to see plural switching!
        </p>

        {/* Counter Buttons */}
        <div style={AppStyles.counterRow}>
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            style={AppStyles.counterButton("#ef4444", "0 2px 4px rgba(239, 68, 68, 0.2)")}
          >
            -
          </button>
          <div style={AppStyles.counterValue}>
            {formatNumber(count)}
          </div>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={AppStyles.counterButton("#22c55e", "0 2px 4px rgba(34, 197, 94, 0.2)")}
          >
            +
          </button>
        </div>

        {/* Plural Preset Buttons */}
        <div style={AppStyles.presetRow}>
          <span style={AppStyles.presetLabel}>
            Quick presets:
          </span>
          {[0, 1, 2, 5, 11, 100].map((num) => (
            <button
              key={num}
              onClick={() => setCount(num)}
              style={AppStyles.presetButton(count === num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div style={AppStyles.outputBox("#10b981")}>
        <div style={AppStyles.outputLabel}>
          Plural Output:
        </div>
        <div style={AppStyles.outputValue("#065f46")}>
          {tr("items_count", { count })}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "8px", fontStyle: "italic", direction: "ltr" }}>
          Intl Plural Category for {count}: <strong>{new Intl.PluralRules(locale).select(count)}</strong>
        </div>
      </div>
    </section>
  );
};

/**
 * SRP COMPONENT: FinancialsCard
 * Renders currency codes, custom amounts, and localized decimals.
 */
interface FinancialsCardProps {
  priceAmount: number;
  setPriceAmount: (val: number) => void;
  currencyCode: string;
  setCurrencyCode: (val: string) => void;
}
const FinancialsCard: React.FC<FinancialsCardProps> = ({
  priceAmount,
  setPriceAmount,
  currencyCode,
  setCurrencyCode,
}) => {
  const { tr, formatCurrency } = useTranslation();

  return (
    <section style={AppStyles.card}>
      <div>
        <div style={AppStyles.cardHeader}>
          <span style={{ fontSize: "1.25rem" }}>💵</span>
          <h2 style={AppStyles.cardTitle}>
            Currency & Number Formatting
          </h2>
        </div>
        <p style={AppStyles.cardDescription}>
          Formats monetary values in according to the active language standards. Notice localized currency symbols, digit symbols, and placement.
        </p>

        <div style={AppStyles.financialsRow}>
          <div style={AppStyles.financialsCol}>
            <label style={AppStyles.presetLabel}>
              Select Currency:
            </label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              style={AppStyles.inputSelect}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="SAR">SAR (ر.س)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div style={AppStyles.financialsCol}>
            <label style={AppStyles.presetLabel}>
              Input Amount:
            </label>
            <input
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(Number(e.target.value))}
              step="50"
              style={AppStyles.inputNumber}
            />
          </div>
        </div>
      </div>

      <div style={AppStyles.outputBox("#f59e0b")}>
        <div style={AppStyles.outputLabel}>
          Formatted Financials:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>tr() format currency placeholder:</span>
            <div style={AppStyles.outputValue("#b45309")}>
              {tr("price_tag", { amount: priceAmount, currencyCode })}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>hook formatCurrency():</span>
            <div style={AppStyles.outputValue("#b45309")}>
              {formatCurrency(priceAmount, currencyCode)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * SRP COMPONENT: DateTimeCard
 * Renders on-the-fly formatted dates across all styles.
 */
interface DateTimeCardProps {
  today: Date;
}
const DateTimeCard: React.FC<DateTimeCardProps> = ({ today }) => {
  const { tr, isRTL, formatDate } = useTranslation();

  return (
    <section style={AppStyles.card}>
      <div>
        <div style={AppStyles.cardHeader}>
          <span style={{ fontSize: "1.25rem" }}>📅</span>
          <h2 style={AppStyles.cardTitle}>
            DateTime Localizers
          </h2>
        </div>
        <p style={AppStyles.cardDescription}>
          Showcases localized Date and Time formatting. Observe how days and months are fully translated in Arabic and Hindi.
        </p>
      </div>

      <div style={AppStyles.outputBox("#8b5cf6")}>
        {/* Isolated translation line */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={AppStyles.outputLabel}>
            tr() with auto-formatted Date param:
          </div>
          <div style={AppStyles.outputValue("#6d28d9", "1.1rem")}>
            {tr("date_today", { date: today })}
          </div>
        </div>

        {/* Isolated formatted styles list */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "12px" }}>
          <div style={AppStyles.outputLabel}>
            hook formatDate() styles:
          </div>
          <div style={AppStyles.dateTimeStylesList}>
            <div style={AppStyles.dateTimeStyleRow}>
              <span style={AppStyles.dateTimeStyleLabel}>Short:</span>
              <span style={AppStyles.dateTimeStyleValue(isRTL)}>{formatDate(today, { dateStyle: "short", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div style={AppStyles.dateTimeStyleRow}>
              <span style={AppStyles.dateTimeStyleLabel}>Medium:</span>
              <span style={AppStyles.dateTimeStyleValue(isRTL)}>{formatDate(today, { dateStyle: "medium", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div style={AppStyles.dateTimeStyleRow}>
              <span style={AppStyles.dateTimeStyleLabel}>Long:</span>
              <span style={AppStyles.dateTimeStyleValue(isRTL)}>{formatDate(today, { dateStyle: "long", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div style={AppStyles.dateTimeStyleRow}>
              <span style={AppStyles.dateTimeStyleLabel}>Full:</span>
              <span style={AppStyles.dateTimeStyleValue(isRTL)}>{formatDate(today, { dateStyle: "full", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * SRP COMPONENT: ResiliencyFooter
 * Explains multi-tier fallback sequences.
 */
const ResiliencyFooter: React.FC = () => {
  const { tr } = useTranslation();

  return (
    <footer style={AppStyles.footer}>
      <div style={AppStyles.footerHeader}>
        <span style={{ fontSize: "1.2rem" }}>🛡️</span>
        <h3 style={AppStyles.footerTitle}>
          Fallback Capability & Resiliency
        </h3>
      </div>

      <p style={AppStyles.footerDescription}>
        The system employs a strict tier-based fallback sequence:
        <code> Active Locale translation &rarr; Fallback (English) translation &rarr; Verbatim Key Name</code>.
      </p>

      <div style={AppStyles.footerGrid}>
        {/* Tier 2 fallback */}
        <div style={AppStyles.footerCard("#fffbeb", "#fef3c7")}>
          <div style={AppStyles.footerCardLabel("#b45309")}>
            Tier 2: Key Missing in Active, Fallback to English (<code>"fallback_demo"</code>):
          </div>
          <div style={AppStyles.footerCardValue}>
            {tr("fallback_demo")}
          </div>
        </div>

        {/* Tier 3 fallback */}
        <div style={AppStyles.footerCard("#fef2f2", "#fee2e2")}>
          <div style={AppStyles.footerCardLabel("#b91c1c")}>
            Tier 3: Key Missing in Both, Verbatim Raw Key (<code>"non_existent_key"</code>):
          </div>
          <div style={AppStyles.footerCardValue}>
            {tr("non_existent_key" as any)}
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * ORCHESTRATOR COMPONENT: AppContent
 * Directs structure, layouts, and holds consolidated states.
 */
function AppContent() {
  const { isRTL } = useTranslation();

  const [name, setName] = useState("John Doe");
  const [count, setCount] = useState(1);
  const [priceAmount, setPriceAmount] = useState(1499.99);
  const [currencyCode, setCurrencyCode] = useState(() => getDefaultCurrency());

  const today = new Date();

  return (
    <div style={AppStyles.container(isRTL)}>
      <div style={AppStyles.wrapper}>
        <Header />
        <PreferencesCard />
        <InfoBanner />

        {/* Dashboard Grid */}
        <div style={AppStyles.grid}>
          <InterpolationCard name={name} setName={setName} />
          <PluralizationCard count={count} setCount={setCount} />
          <FinancialsCard
            priceAmount={priceAmount}
            setPriceAmount={setPriceAmount}
            currencyCode={currencyCode}
            setCurrencyCode={setCurrencyCode}
          />
          <DateTimeCard today={today} />
        </div>

        <ResiliencyFooter />
      </div>
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};
