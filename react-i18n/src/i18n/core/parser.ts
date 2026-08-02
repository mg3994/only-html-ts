/**
 * Core ICU MessageFormat engine.
 * Single Responsibility: Orchestrating translation template scanning and evaluating blocks.
 */

import { findMatchingBrace, splitByCommaOutsideBraces } from "./parserUtils.ts";
import { formatValue, getStyleFromIcuString, formatCurrency, formatDate } from "./formatter.ts";
import { resolvePluralOption } from "./pluralResolver.ts";

// Maximum number of compiled translation strings to store in memory
const MAX_CACHE_SIZE = 1000;

// High-performance translation cache store
const translationCache = new Map<string, string>();

/**
 * Generates a stable unique hash key for a translation template call.
 */
function getCacheKey(locale: string, message: string, params: Record<string, any>): string {
  // Use a simple, fast stringification of parameters. For dates, use their ISO values.
  const serializedParams = JSON.stringify(params, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
  return `${locale}:${message}:${serializedParams}`;
}

/**
 * Evaluates the parsed block content.
 * e.g., "name" or "count, plural, ... " or "amount, number, currency"
 */
export function evaluateBlock(
  content: string,
  params: Record<string, any>,
  locale: string
): string {
  const parts = splitByCommaOutsideBraces(content);
  if (parts.length === 0) return "";

  const variableName = parts[0];
  const val = params[variableName];

  // If parameter is not supplied, return the fallback placeholder representation
  if (val === undefined) {
    return `{${content}}`;
  }

  // Simple replacement: {name}
  if (parts.length === 1) {
    return formatValue(val, locale);
  }

  const type = parts[1];

  // ICU Plural handling: {count, plural, ...}
  if (type === "plural") {
    const optionsStr = parts[2] || "";
    const selectedTextOption = resolvePluralOption(locale, Number(val), optionsStr);

    if (selectedTextOption !== null) {
      return parseArbMessage(locale, selectedTextOption, params);
    }
    return "";
  }

  // ICU Number formatting: {amount, number, currency} or {count, number}
  if (type === "number") {
    const style = parts[2];
    if (style === "currency") {
      const currencyCode = params.currencyCode || "USD";
      return formatCurrency(Number(val), locale, currencyCode);
    }
    return formatValue(Number(val), locale);
  }

  // ICU Date formatting: {dateVal, date, short|medium|long|full}
  if (type === "date") {
    const style = parts[2];
    const formattingOptions = getStyleFromIcuString(style);
    return formatDate(val, locale, formattingOptions);
  }

  // Fallback to basic stringification
  return formatValue(val, locale);
}

/**
 * Parses an ARB translation template string and performs interpolation and ICU Plural evaluation.
 * Results are cached globally with a size-bounded, high-performance Map to guarantee O(1) repeat rendering.
 */
export function parseArbMessage(
  locale: string,
  message: string,
  params: Record<string, any> = {}
): string {
  const cacheKey = getCacheKey(locale, message, params);

  // 1. O(1) Cache hit
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey) as string;
  }

  // 2. Parse and evaluate the translation message
  let result = "";
  let i = 0;
  while (i < message.length) {
    const char = message[i];
    if (char === "{") {
      const endIdx = findMatchingBrace(message, i);
      if (endIdx === -1) {
        result += char;
        i++;
      } else {
        const blockContent = message.substring(i + 1, endIdx);
        result += evaluateBlock(blockContent, params, locale);
        i = endIdx + 1;
      }
    } else {
      result += char;
      i++;
    }
  }

  // 3. Size-bounded Cache Eviction to prevent memory leaks in single-page apps
  if (translationCache.size >= MAX_CACHE_SIZE) {
    // Evict the oldest key (FIFO queue via native Map iterator)
    const oldestKey = translationCache.keys().next().value;
    if (oldestKey !== undefined) {
      translationCache.delete(oldestKey);
    }
  }

  // 4. Save to Cache
  translationCache.set(cacheKey, result);

  return result;
}
