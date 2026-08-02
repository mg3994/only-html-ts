/**
 * Manages ICU Plural options parsing and matching resolution.
 * Single Responsibility: Categorizing and matching numeric counts to correct translation phrases.
 */

import { findMatchingBrace } from "./parserUtils.ts";

/**
 * Parses options of an ICU plural block (e.g. "=0 {No items} other {{count} items}")
 * into key-value pairs of key -> nested template string.
 */
export function parsePluralOptions(optionsStr: string): Record<string, string> {
  const options: Record<string, string> = {};
  let i = 0;
  const s = optionsStr.trim();
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) {
      i++;
    }
    if (i >= s.length) break;

    const keyStart = i;
    while (i < s.length && s[i] !== "{" && !/\s/.test(s[i])) {
      i++;
    }
    const key = s.substring(keyStart, i).trim();

    while (i < s.length && s[i] !== "{") {
      i++;
    }
    if (i >= s.length) break;

    const braceStart = i;
    const braceEnd = findMatchingBrace(s, braceStart);
    if (braceEnd === -1) {
      break;
    }

    const text = s.substring(braceStart + 1, braceEnd);
    options[key] = text;
    i = braceEnd + 1;
  }
  return options;
}

/**
 * Selects the correct plural string block option based on exact values and standard plural categories.
 */
export function resolvePluralOption(
  locale: string,
  value: number,
  optionsStr: string
): string | null {
  const options = parsePluralOptions(optionsStr);

  // 1. Match literal exact keys (e.g. =0, =1)
  const exactKey = `=${value}`;
  if (exactKey in options) {
    return options[exactKey];
  }

  // 2. Match standard plural rules category (zero, one, two, few, many, other)
  const pluralRules = new Intl.PluralRules(locale);
  const category = pluralRules.select(value);
  if (category in options) {
    return options[category];
  }

  // 3. Fallback to "other"
  if ("other" in options) {
    return options["other"];
  }

  return null;
}
