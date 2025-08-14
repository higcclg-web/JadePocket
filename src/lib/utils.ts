import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number in cents to a localized currency string
 * @param cents Amount in cents
 * @param currency Currency code (default: USD)
 * @param locale Locale string (default: en-US)
 */
export function formatPrice(
  cents: number | null | undefined,
  currency: string = "USD",
  locale: string = "en-US"
) {
  const amount = (cents ?? 0) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}