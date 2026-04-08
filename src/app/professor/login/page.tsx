import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/components/seminario/AppHeader";
import { TeacherLoginClient } from "./TeacherLoginClient";

export const metadata: Metadata = {
  title: "Seminário SUD — Acesso do professor",
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function TeacherLoginPage({ searchParams }: Props) {
  if (process.env.TEACHER_AUTOLOGIN === "1") {
    const rawNext = searchParams?.next;
    const nextUrl = typeof rawNext === "string" ? rawNext : "/professor/respostas";
    redirect(`/professor/autologin?next=${encodeURIComponent(nextUrl)}`);
  }

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />
      <Suspense>
        <TeacherLoginClient />
      </Suspense>
    </div>
  );
}
