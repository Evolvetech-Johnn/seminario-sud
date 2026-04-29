import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AppHeader } from "@/components/seminario/AppHeader";
import { getMongoDb } from "@/lib/mongodb";
import { readTeacherFromSessionToken, TEACHER_SESSION_COOKIE } from "@/lib/teacherSession";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: {
    limit?: string;
  };
};

export default async function TeacherLessonAnswerKeyPage({ params, searchParams }: Props) {
  const store = await cookies();
  const isAuthed = Boolean(readTeacherFromSessionToken(store.get(TEACHER_SESSION_COOKIE)?.value ?? ""));
  if (!isAuthed) {
    redirect(`/professor/login?next=${encodeURIComponent(`/professor/aulas/${(await params).slug}`)}`);
  }

  const { slug } = await params;

  const limitParsed = Number(searchParams?.limit);
  const limit = Number.isFinite(limitParsed) && limitParsed > 0 ? Math.min(500, Math.floor(limitParsed)) : 200;

  const db = await getMongoDb();
  const docs =
    db
      ? await db
          .collection("lesson_responses")
          .find({ lessonSlug: slug }, { projection: { _id: 0 } })
          .sort({ updatedAt: -1 })
          .limit(limit)
          .toArray()
      : [];

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-700">Gabarito / Material do professor</div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {slug}
            </h1>
            <p className="mt-2 text-sm text-slate-600">Visualização de respostas por aula</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/professor/respostas"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-sud-gray"
            >
              Ver todas as respostas
            </Link>
            <form action="/api/teacher/logout" method="post">
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-sud-gray">
                Sair
              </button>
            </form>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-sud-gray px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-800">Respostas dos alunos</div>
              <div className="text-xs text-slate-600">Total: {docs?.length ?? 0}</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-left text-sm">
              <thead className="bg-white text-slate-700">
                <tr>
                  <th className="w-40 px-4 py-3 font-semibold">Aluno</th>
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
                    <td className="px-4 py-3">{d.studentName || d.studentId}</td>
                    <td className="truncate px-4 py-3">{d.answers?.icebreaker ?? ""}</td>
                    <td className="truncate px-4 py-3">{d.answers?.discussionNotes ?? ""}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div>Antes: {d.answers?.actionBefore ?? ""}</div>
                        <div>Durante: {d.answers?.actionDuring ?? ""}</div>
                        <div>Depois: {d.answers?.actionAfter ?? ""}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

