import { useContext } from "react";
import { I18nContext } from "./I18nContext.tsx";
import { I18nContextType } from "./types.ts";

/**
 * A custom hook to access translation, formatting, and language control features of the i18n system.
 */
export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
