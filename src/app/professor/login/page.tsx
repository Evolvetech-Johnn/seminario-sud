import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Seminário SUD — Acesso do professor",
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function TeacherLoginPage({ searchParams }: Props) {
  const rawNext = searchParams?.next;
  const nextUrl = typeof rawNext === "string" ? rawNext : "/professor/respostas";
  redirect(`/professor/autologin?next=${encodeURIComponent(nextUrl)}`);
}
