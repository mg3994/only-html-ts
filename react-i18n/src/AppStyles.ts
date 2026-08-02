import { CSSProperties } from "react";

/**
 * Strongly typed style definitions for the App dashboard presentation layer.
 * Enforces strict Separation of Concerns (SoC) by decoupling styles from component structure.
 */
export const AppStyles = {
  container: (isRTL: boolean): CSSProperties => ({
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    color: "#1e293b",
    direction: isRTL ? "rtl" : "ltr",
    textAlign: "start",
    padding: "24px",
    transition: "all 0.3s ease",
  }),

  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  } as CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "16px 24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  } as CSSProperties,

  headerTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as CSSProperties,

  headerTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
    color: "#0f172a",
  } as CSSProperties,

  languageSelectorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    direction: "ltr",
  } as CSSProperties,

  languageSelect: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#1e293b",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  } as CSSProperties,

  preferencesCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px 24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    marginBottom: "24px",
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "center",
  } as CSSProperties,

  preferencesTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as CSSProperties,

  preferencesTitle: {
    fontSize: "1.05rem",
    fontWeight: "700",
    margin: 0,
  } as CSSProperties,

  preferencesControlRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    direction: "ltr",
  } as CSSProperties,

  preferencesLabel: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#64748b",
  } as CSSProperties,

  preferencesButton: (active: boolean): CSSProperties => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: active ? "#3b82f6" : "#ffffff",
    color: active ? "#ffffff" : "#475569",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
  }),

  preferencesSelect: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#1e293b",
    cursor: "pointer",
  } as CSSProperties,

  infoBanner: {
    backgroundColor: "#e2e8f0",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "0.875rem",
    marginBottom: "24px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    fontWeight: "500",
    color: "#475569",
    direction: "ltr",
  } as CSSProperties,

  infoBannerCode: {
    backgroundColor: "#ffffff",
    padding: "2px 6px",
    borderRadius: "4px",
  } as CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  } as CSSProperties,

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  } as CSSProperties,

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  } as CSSProperties,

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    margin: 0,
    color: "#334155",
  } as CSSProperties,

  cardDescription: {
    color: "#64748b",
    fontSize: "0.95rem",
    margin: "0 0 20px 0",
  } as CSSProperties,

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  } as CSSProperties,

  inputLabel: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#64748b",
  } as CSSProperties,

  inputText: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    color: "#1e293b",
    width: "100%",
    boxSizing: "border-box",
  } as CSSProperties,

  inputSelect: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
  } as CSSProperties,

  inputNumber: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  } as CSSProperties,

  outputBox: (borderColor: string): CSSProperties => ({
    marginTop: "24px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    borderInlineStart: `4px solid ${borderColor}`,
  }),

  outputLabel: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "6px",
  } as CSSProperties,

  outputValue: (color: string, fontSize = "1.25rem"): CSSProperties => ({
    fontSize: fontSize,
    fontWeight: "700",
    color: color,
  }),

  counterRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "16px",
    direction: "ltr",
  } as CSSProperties,

  counterButton: (bg: string, shadow: string): CSSProperties => ({
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: bg,
    color: "white",
    fontWeight: "600",
    fontSize: "1.25rem",
    cursor: "pointer",
    flex: 1,
    boxShadow: shadow,
  }),

  counterValue: {
    fontSize: "1.5rem",
    fontWeight: "800",
    minWidth: "60px",
    textAlign: "center",
  } as CSSProperties,

  presetRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "16px",
  } as CSSProperties,

  presetLabel: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748b",
    width: "100%",
    marginBottom: "4px",
  } as CSSProperties,

  presetButton: (active: boolean): CSSProperties => ({
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: active ? "#3b82f6" : "#ffffff",
    color: active ? "#ffffff" : "#475569",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
  }),

  financialsRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    direction: "ltr",
  } as CSSProperties,

  financialsCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  } as CSSProperties,

  dateTimeStylesList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "0.95rem",
    color: "#4c1d95",
  } as CSSProperties,

  dateTimeStyleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    direction: "ltr",
  } as CSSProperties,

  dateTimeStyleLabel: {
    fontWeight: "700",
    color: "#475569",
  } as CSSProperties,

  dateTimeStyleValue: (isRTL: boolean): CSSProperties => ({
    direction: isRTL ? "rtl" : "ltr",
    fontWeight: "600",
  }),

  footer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  } as CSSProperties,

  footerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as CSSProperties,

  footerTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    margin: 0,
  } as CSSProperties,

  footerDescription: {
    margin: 0,
    color: "#475569",
    fontSize: "0.9rem",
  } as CSSProperties,

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginTop: "4px",
  } as CSSProperties,

  footerCard: (bg: string, border: string): CSSProperties => ({
    backgroundColor: bg,
    padding: "12px 16px",
    borderRadius: "8px",
    border: `1px solid ${border}`,
  }),

  footerCardLabel: (color: string): CSSProperties => ({
    fontSize: "0.75rem",
    fontWeight: "700",
    color: color,
    marginBottom: "4px",
  }),

  footerCardValue: {
    fontWeight: "600",
    fontSize: "0.95rem",
  } as CSSProperties,
};
