// Fixed locale so server-rendered and client-rendered dates always match —
// the host OS/browser default locale can differ (e.g. Windows server locale
// vs. browser locale), which otherwise causes React hydration mismatches.
const DATE_LOCALE = "en-US";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALE, { year: "numeric", month: "short", day: "numeric" });
}
