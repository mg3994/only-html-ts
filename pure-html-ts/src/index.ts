import { I18nManager } from "./i18n/i18nManager.ts";
import { getDefaultCurrency } from "./i18n/arbParser.ts";

// Instantiate the manager
const manager = new I18nManager();

// App Local States
let nameState = "John Doe";
let countState = 1;
let priceAmountState = 1499.99;
let currencyCodeState = getDefaultCurrency();
const todayDate = new Date();

// DOM References
const loaderOverlay = document.getElementById("loader-overlay")!;
const appRoot = document.getElementById("app-root")!;
const localeSelect = document.getElementById("locale-select") as HTMLSelectElement;
const hour12TrueBtn = document.getElementById("hour12-true-btn") as HTMLButtonElement;
const hour12FalseBtn = document.getElementById("hour12-false-btn") as HTMLButtonElement;
const dateStyleSelect = document.getElementById("date-style-select") as HTMLSelectElement;
const infoLocale = document.getElementById("info-locale")!;
const infoDir = document.getElementById("info-dir")!;
const infoLang = document.getElementById("info-lang")!;
const nameInput = document.getElementById("name-input") as HTMLInputElement;
const interpolationOutput = document.getElementById("interpolation-output")!;
const counterDecBtn = document.getElementById("counter-dec-btn") as HTMLButtonElement;
const counterValueText = document.getElementById("counter-value-text")!;
const counterIncBtn = document.getElementById("counter-inc-btn") as HTMLButtonElement;
const presetButtons = document.querySelectorAll(".preset-button") as NodeListOf<HTMLButtonElement>;
const pluralOutput = document.getElementById("plural-output")!;
const pluralCategoryCount = document.getElementById("plural-category-count")!;
const pluralCategoryName = document.getElementById("plural-category-name")!;
const currencySelect = document.getElementById("currency-select") as HTMLSelectElement;
const priceInput = document.getElementById("price-input") as HTMLInputElement;
const financialsTrOutput = document.getElementById("financials-tr-output")!;
const financialsHookOutput = document.getElementById("financials-hook-output")!;
const dateTrOutput = document.getElementById("date-tr-output")!;
const dateShortValue = document.getElementById("date-short-value")!;
const dateMediumValue = document.getElementById("date-medium-value")!;
const dateLongValue = document.getElementById("date-long-value")!;
const dateFullValue = document.getElementById("date-full-value")!;
const fallbackTier2Value = document.getElementById("fallback-tier2-value")!;
const fallbackTier3Value = document.getElementById("fallback-tier3-value")!;
const appTitleText = document.getElementById("app-title-text")!;

// Bind Initial States to Input Fields
nameInput.value = nameState;
priceInput.value = String(priceAmountState);
currencySelect.value = currencyCodeState;

// Re-render function that binds state into DOM elements
function render() {
  if (manager.loading) {
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#f7fafc";
    loaderOverlay.style.display = "flex";
    appRoot.style.display = "none";
    return;
  }

  // Hide loader
  document.body.style.overflow = "";
  document.body.style.backgroundColor = "";
  loaderOverlay.style.display = "none";
  appRoot.style.display = "block";

  // RTL/LTR layout handling
  appRoot.style.direction = manager.isRTL ? "rtl" : "ltr";

  // Translate App Title
  appTitleText.textContent = manager.tr("app_title");

  // Locale Dropdown value
  localeSelect.value = manager.locale;

  // Preferences: Hour12
  if (manager.hour12) {
    hour12TrueBtn.classList.add("active");
    hour12FalseBtn.classList.remove("active");
  } else {
    hour12TrueBtn.classList.remove("active");
    hour12FalseBtn.classList.add("active");
  }

  // Preferences: Date Format
  dateStyleSelect.value = manager.dateStylePref;

  // Info Banner
  infoLocale.textContent = manager.locale;
  infoDir.textContent = manager.isRTL ? "rtl (RTL)" : "ltr (LTR)";
  infoLang.textContent = manager.locale;

  // Card 1: Interpolation
  interpolationOutput.textContent = manager.tr("hello", { name: nameState });

  // Card 2: Pluralization
  counterValueText.textContent = manager.formatNumber(countState);
  pluralOutput.textContent = manager.tr("items_count", { count: countState });
  pluralCategoryCount.textContent = String(countState);
  try {
    pluralCategoryName.textContent = new Intl.PluralRules(manager.locale).select(countState);
  } catch (e) {
    pluralCategoryName.textContent = "unknown";
  }

  // Presets styling
  presetButtons.forEach((btn) => {
    const btnVal = Number(btn.getAttribute("data-val"));
    if (btnVal === countState) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Card 3: Financials
  financialsTrOutput.textContent = manager.tr("price_tag", { amount: priceAmountState, currencyCode: currencyCodeState });
  financialsHookOutput.textContent = manager.formatCurrency(priceAmountState, currencyCodeState);

  // Card 4: DateTime
  dateTrOutput.textContent = manager.tr("date_today", { date: todayDate });
  dateShortValue.textContent = manager.formatDate(todayDate, { dateStyle: "short", hour: "2-digit", minute: "2-digit" });
  dateMediumValue.textContent = manager.formatDate(todayDate, { dateStyle: "medium", hour: "2-digit", minute: "2-digit" });
  dateLongValue.textContent = manager.formatDate(todayDate, { dateStyle: "long", hour: "2-digit", minute: "2-digit" });
  dateFullValue.textContent = manager.formatDate(todayDate, { dateStyle: "full", hour: "2-digit", minute: "2-digit" });

  // Fallbacks
  fallbackTier2Value.textContent = manager.tr("fallback_demo");
  fallbackTier3Value.textContent = manager.tr("non_existent_key" as any);
}

// Subscribe rendering callback
manager.subscribe(render);

// Event Bindings
localeSelect.addEventListener("change", (e) => {
  const selected = (e.target as HTMLSelectElement).value;
  manager.setLocale(selected);
});

hour12TrueBtn.addEventListener("click", () => {
  manager.setHour12(true);
});

hour12FalseBtn.addEventListener("click", () => {
  manager.setHour12(false);
});

dateStyleSelect.addEventListener("change", (e) => {
  const selectedStyle = (e.target as HTMLSelectElement).value;
  manager.setDateStylePref(selectedStyle);
});

nameInput.addEventListener("input", (e) => {
  nameState = (e.target as HTMLInputElement).value;
  render();
});

counterDecBtn.addEventListener("click", () => {
  countState = Math.max(0, countState - 1);
  render();
});

counterIncBtn.addEventListener("click", () => {
  countState++;
  render();
});

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = Number(btn.getAttribute("data-val"));
    countState = val;
    render();
  });
});

currencySelect.addEventListener("change", (e) => {
  currencyCodeState = (e.target as HTMLSelectElement).value;
  render();
});

priceInput.addEventListener("input", (e) => {
  priceAmountState = Number((e.target as HTMLInputElement).value);
  render();
});

// Initialize and boot up the app
manager.init();
