export type LgpdConsentValue = "accepted" | "rejected";

export const LGPD_CONSENT_COOKIE = "lgpd_consent";

export function parseLgpdConsentCookie(value: string | undefined | null): LgpdConsentValue | null {
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

