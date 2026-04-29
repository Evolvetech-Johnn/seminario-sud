import { AdminShell } from "./AdminShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthed = (await cookies()).get("teacherAuth")?.value === "1";
  if (!isAuthed) {
    redirect("/professor/login?next=/admin/dashboard");
  }
  return <AdminShell>{children}</AdminShell>;
}
