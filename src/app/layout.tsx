import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";
import { Providers } from "./Providers";
import { CookieConsentBanner } from "@/components/seminario/CookieConsentBanner";
import { LGPD_CONSENT_COOKIE, parseLgpdConsentCookie } from "@/lib/lgpd";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seminário SUD",
  description: "Aulas interativas de quarta-feira",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const consent = parseLgpdConsentCookie(cookieStore.get(LGPD_CONSENT_COOKIE)?.value);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <CookieConsentBanner initialConsent={consent} />
        </Providers>
      </body>
    </html>
  );
}

