/**
 * Utility functions for structural parsing and token splitting.
 * Houses shared lexing and brace balancing operations.
 */

/**
 * Finds the index of the matching closing brace for an opening brace at startIdx.
 * Properly accounts for nested braces.
 */
export function findMatchingBrace(text: string, startIdx: number): number {
  let depth = 0;
  for (let i = startIdx; i < text.length; i++) {
    if (text[i] === "{") {
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Splits a string by comma, but only when the comma is at depth 0 (outside of braces).
 */
export function splitByCommaOutsideBraces(str: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "{") {
      depth++;
      current += char;
    } else if (char === "}") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}
