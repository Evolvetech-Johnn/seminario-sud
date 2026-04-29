import { AdminShell } from "./AdminShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTeacherSession } from "@/lib/server/teacherAuth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await cookies();
  const isAuthed = Boolean(await getTeacherSession());
  if (!isAuthed) {
    redirect("/professor/login?next=/admin/dashboard");
  }
  return <AdminShell>{children}</AdminShell>;
}
