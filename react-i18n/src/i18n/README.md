# Internal i18n Architecture Design & Patterns

This directory contains the underlying implementation of the React Internationalization (i18n) Engine. It was designed under strict **SOLID**, **DRY**, and **Clean Architecture** principles to maximize extensibility and modularity.

---

## 🛠️ Code Design Patterns Applied

### 1. The Facade Pattern
*   **File**: `src/i18n/arbParser.ts`
*   **Purpose**: Acts as a high-level, single entry-point interface for the parsing subsystem. It decouples external files (like context providers, hooks, and views) from the underlying parser modules. By exporting core functions from the subsystems, we maintain a clean and backward-compatible public interface while keeping the subsystem design modular.

### 2. Separation of Concerns (Single Responsibility Principle)
The parser logic has been split into four highly cohesive modules within `src/i18n/core/`:
*   **`parserUtils.ts`**: Focuses entirely on structural lexing and string manipulation, such as counting brace depths and splitting by dynamic commas outside bracket boundaries.
*   **`formatter.ts`**: Houses all locale-aware formatting calculations for dates, times, currencies, and digits using native browser `Intl` APIs.
*   **`pluralResolver.ts`**: Governs category resolution (e.g. mapping counts to rules like `few` or `many` in Arabic) using browser `Intl.PluralRules` selectors.
*   **`parser.ts`**: Combines formatters, plural resolvers, and utility methods to orchestrate the recursive evaluation of the entire translation template block.

### 3. Open/Closed Principle
By separating formatters and resolvers, the parsing system is open for extensions (e.g., adding gender selectors, custom timezone formatting, or custom ICU operations) but closed for modifications in the core brace scanning loop.

---

## 🚀 Native Performance Design

All formatters (`Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.PluralRules`) are lightweight and created on-demand according to active settings, keeping memory profiles exceptionally flat without any third-party overhead.
