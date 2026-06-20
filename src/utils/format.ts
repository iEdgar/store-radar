import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/constants/format";

const currencyFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);

/** Formats a monetary amount as currency (no decimals). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Formats a number with locale-aware thousands separators. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
