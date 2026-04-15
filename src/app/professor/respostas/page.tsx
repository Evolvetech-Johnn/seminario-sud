import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { AppHeader } from "@/components/seminario/AppHeader";
import { getMongoDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function TeacherResponsesPage() {
  const isAuthed = (await cookies()).get("teacherAuth")?.value === "1";
  if (!isAuthed) {
    redirect("/professor/login?next=/professor/respostas");
  }

  const db = await getMongoDb();
  const docs =
    db
      ? await db
          .collection("lesson_responses")
          .find({}, { projection: { _id: 0 } })
          .sort({ updatedAt: -1 })
          .toArray()
      : [];

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              Painel do professor
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Respostas dos alunos
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Total: {docs?.length ?? 0}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/professor/aulas/exodo-16"
              className="rounded-2xl bg-sud-blue px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
            >
              Gabarito da aula
            </Link>
            <form action="/api/teacher/logout" method="post">
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-sud-gray">
                Sair
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="bg-sud-gray text-slate-700">
              <tr>
                <th className="w-40 px-4 py-3 font-semibold">Aluno</th>
                <th className="w-36 px-4 py-3 font-semibold">Lição</th>
                <th className="px-4 py-3 font-semibold">Quebra de gelo</th>
                <th className="px-4 py-3 font-semibold">Notas</th>
                <th className="w-40 px-4 py-3 font-semibold">Ações</th>
                <th className="w-36 px-4 py-3 font-semibold">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {(docs ?? []).map((d: any, idx: number) => (
                <tr
                  key={`${d.lessonSlug}-${d.studentId}-${idx}`}
                  className="border-t border-slate-200 text-slate-800"
                >
                  <td className="px-4 py-3">
                    {d.studentName || d.studentId}
                  </td>
                  <td className="px-4 py-3">{d.lessonSlug}</td>
                  <td className="truncate px-4 py-3">
                    {d.answers?.icebreaker ?? ""}
                  </td>
                  <td className="truncate px-4 py-3">
                    {d.answers?.discussionNotes ?? ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div>Antes: {d.answers?.actionBefore ?? ""}</div>
                      <div>Durante: {d.answers?.actionDuring ?? ""}</div>
                      <div>Depois: {d.answers?.actionAfter ?? ""}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {d.updatedAt
                      ? new Date(d.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
