import { AdminShell } from "./AdminShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readTeacherFromSessionToken, TEACHER_SESSION_COOKIE } from "@/lib/teacherSession";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const isAuthed = Boolean(readTeacherFromSessionToken(store.get(TEACHER_SESSION_COOKIE)?.value ?? ""));
  if (!isAuthed) {
    redirect("/professor/login?next=/admin/dashboard");
  }
  return <AdminShell>{children}</AdminShell>;
}
