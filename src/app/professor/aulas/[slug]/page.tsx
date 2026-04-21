import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AppHeader } from "@/components/seminario/AppHeader";
import { getMongoDb } from "@/lib/mongodb";
import { exodo1213Lesson } from "@/features/lessons/exodo-12-13/config";
import { exodo16Lesson } from "@/features/lessons/exodo-16/config";
import { exodo2011Lesson } from "@/features/lessons/exodo-20-1-11/config";
import { fazerComparacoesLesson } from "@/features/lessons/fazer-comparacoes/config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TeacherLessonAnswerKeyPage({ params }: Props) {
  const isAuthed = (await cookies()).get("teacherAuth")?.value === "1";
  if (!isAuthed) {
    redirect(`/professor/login?next=${encodeURIComponent(`/professor/aulas/${(await params).slug}`)}`);
  }

  const { slug } = await params;

  const lessons = [fazerComparacoesLesson, exodo2011Lesson, exodo16Lesson, exodo1213Lesson];
  const lesson =
    slug === fazerComparacoesLesson.slug
      ? fazerComparacoesLesson
      : slug === exodo2011Lesson.slug
      ? exodo2011Lesson
      : slug === exodo16Lesson.slug
      ? exodo16Lesson
      : slug === exodo1213Lesson.slug
        ? exodo1213Lesson
        : null;
  if (!lesson) notFound();

  const db = await getMongoDb();
  const docs =
    db
      ? await db
          .collection("lesson_responses")
          .find({ lessonSlug: slug }, { projection: { _id: 0 } })
          .sort({ updatedAt: -1 })
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
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{lesson.theme}</p>
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

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-sud-gray px-5 py-4 sm:px-7">
            <div className="text-sm font-semibold text-slate-800">Selecionar aula</div>
            <div className="mt-1 text-sm text-slate-600">
              Troque rapidamente entre os gabaritos disponíveis.
            </div>
          </div>
          <div className="flex flex-wrap gap-2 px-5 py-4 sm:px-7">
            {lessons.map((l) => {
              const active = l.slug === slug;
              return (
                <Link
                  key={l.slug}
                  href={`/professor/aulas/${l.slug}`}
                  className={
                    active
                      ? "rounded-full bg-sud-blue px-4 py-2 text-sm font-bold text-white shadow-sm"
                      : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-sud-gray"
                  }
                >
                  {l.title}
                </Link>
              );
            })}
          </div>
        </div>

        {lesson.referenceMaterial ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700">Material</div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  {lesson.referenceMaterial.title}
                </h2>
              </div>
              <Link
                href={lesson.referenceMaterial.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-sud-blue px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
              >
                Abrir fonte
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {lesson.referenceMaterial.sections.map((s) => (
                <div key={s.title} className="rounded-2xl bg-sud-gray p-5">
                  <div className="text-sm font-bold text-slate-900">{s.title}</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {lesson.referenceMaterial.scriptureStudy ? (
              <div className="mt-6 rounded-2xl bg-sud-gray p-5">
                <div className="text-sm font-bold text-slate-900">
                  {lesson.referenceMaterial.scriptureStudy.title}
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-800">Passagens</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {lesson.referenceMaterial.scriptureStudy.passages.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="mt-4 text-sm font-semibold text-slate-800">Perguntas</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {lesson.referenceMaterial.scriptureStudy.prompts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {lesson.referenceMaterial.sacramentStudy ? (
              <div className="mt-4 rounded-2xl bg-sud-gray p-5">
                <div className="text-sm font-bold text-slate-900">Estudo sobre o sacramento</div>
                <div className="mt-3 text-sm font-semibold text-slate-800">Passagens</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {lesson.referenceMaterial.sacramentStudy.passages.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="mt-4 text-sm font-semibold text-slate-800">Perguntas</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {lesson.referenceMaterial.sacramentStudy.prompts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

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

