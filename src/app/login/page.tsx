import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginClient } from "@/app/login/LoginClient";

export const metadata: Metadata = {
  title: "Seminário SUD — Login",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}

