import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatPrice(
  cents: number | null | undefined,
  currency: string = "USD",
  locale: string = "en-US"
) {
  const amount = (cents ?? 0) / 100;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  );
}