import type { Metadata } from "next";
import { Suspense } from "react";
import { AppHeader } from "@/components/seminario/AppHeader";
import { TeacherLoginClient } from "./TeacherLoginClient";

export const metadata: Metadata = {
  title: "Seminário SUD — Acesso do professor",
};

export default function TeacherLoginPage() {
  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />
      <Suspense>
        <TeacherLoginClient />
      </Suspense>
    </div>
  );
}
