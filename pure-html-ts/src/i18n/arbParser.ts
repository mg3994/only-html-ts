/**
 * Unified Facade for the i18n parsing and formatting system.
 * Delegating specific responsibilities to decoupled SOLID modular core subsystems.
 */

export {
  findMatchingBrace,
  splitByCommaOutsideBraces
} from "./core/parserUtils.ts";

export {
  parsePluralOptions,
  resolvePluralOption
} from "./core/pluralResolver.ts";

export {
  formatValue,
  formatNumber,
  formatCurrency,
  formatDate,
  getStyleFromIcuString,
  getDefaultCurrency,
  currentTimeZone,
  getDefaultHour12,
  formatDateWithPreferences
} from "./core/formatter.ts";

export {
  evaluateBlock,
  parseArbMessage
} from "./core/parser.ts";
