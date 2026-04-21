import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Bem-vindo, {session.user?.name ?? "Aluno"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Você está autenticado via NextAuth.
      </p>
    </div>
  );
}

