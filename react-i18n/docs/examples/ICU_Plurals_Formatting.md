# Example: Advanced ICU Plurals & Localized Formatters

This guide covers how the ARB i18n Engine parses complex ICU plural syntaxes and applies locale-aware numeric, currency, and date formatting.

---

## 1. Defining Complex Plurals in `.arb`

Pluralization rules vary heavily by country. The engine utilizes browser `Intl.PluralRules` to map numbers to language-specific standard category selectors: `zero`, `one`, `two`, `few`, `many`, and `other`.

### English (`en.arb`)
English has 2 states: `one` and `other`. We can also use exact matches like `=0` to handle custom zero-count texts:
```json
{
  "items_count": "{count, plural, =0 {You have no items} =1 {You have 1 item} other {You have {count} items}}"
}
```

### Arabic (`ar.arb`)
Arabic is a grammatically rich language with 6 distinct plural states. To handle this correctly, define all 6 keys in the ICU block:
```json
{
  "items_count": "{count, plural, =0 {ليس لديك أي عناصر} =1 {لديك عنصر واحد} =2 {لديك عنصران} few {لديك {count} عناصر} many {لديك {count} عنصراً} other {لديك {count} عنصر}}"
}
```

---

## 2. Dynamic Currency Formatting

The custom `tr()` function has built-in support for ICU-style number formats, and the hook provides a custom formatting utility as well.

### Standard `tr()` Placeholders with Formatting
In your `.arb` templates, you can declare type metadata:

```json
{
  "price_tag": "Total: {amount, number, currency}"
}
```

The engine parses the format metadata and uses the dynamic `currencyCode` passed in params (or defaults to `USD`):

```typescript
// Triggers currency formatter scoped to the active locale
tr("price_tag", { amount: 12500.5, currencyCode: "EUR" });
// English: Total: €12,500.50
// Arabic: Total: ١٢٬٥٠٠٫٥٠ م.
```

### Using the Scoped `formatCurrency` utility
You can also format currency explicitly in code:

```tsx
const { formatCurrency } = useTranslation();

<div>{formatCurrency(999.99, "SAR")}</div>
// English: SAR 999.99
// Arabic: ٩٩٩٫٩٩ ر.س. 
```

---

## 3. Localized Date Formatting

Similarly, dates can be formatted both within templates or explicitly inside components.

### Inline Template Formatting
Declare date metadata inside the template string:

```json
{
  "date_today": "Today is {date, date, full}"
}
```

Ensure a real `Date` object is passed into the parameters:

```typescript
tr("date_today", { date: new Date() });
// English: Today is Thursday, March 6, 2025
// Arabic: اليوم هو الخميس، ٦ مارس ٢٠٢٥
```

### Script-level `formatDate` Custom Styles
You can pass standard `Intl.DateTimeFormatOptions` to the `formatDate` helper:

```typescript
const { formatDate } = useTranslation();

const customDate = formatDate(new Date(), {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric"
});
```
