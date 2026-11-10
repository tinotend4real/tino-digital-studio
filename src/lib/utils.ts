export function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);
}

export function formatMoney(pence: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

// "12.50" -> 1250. Returns null if it isn't a valid non-negative amount.
export function parsePounds(input: string): number | null {
  const n = Number(input.replace(/[£,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

// Date for <input type="date"> (yyyy-mm-dd)
export function dateInput(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export function parseDate(input: string): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Number of line-item rows in the quote builder form
export const QUOTE_ROWS = 8;

export function invoiceNumber(n: number): string {
  return `INV-${String(n).padStart(4, "0")}`;
}

export function quoteNumber(n: number): string {
  return `Q-${String(n).padStart(4, "0")}`;
}

export function label(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
