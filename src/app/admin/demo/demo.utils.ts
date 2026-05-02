export async function adminFetch<T>(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, cache: "no-store" });
  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) throw new Error(json?.error ?? `HTTP_${res.status}`);
  return json as T;
}

export function formatPercent(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 }).format(
    clamped,
  );
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    date,
  );
}

export function safeString(v: unknown) {
  if (typeof v === "string") return v;
  if (!v) return "";
  return String(v);
}

