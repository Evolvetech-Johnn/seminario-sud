"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { useAuthStore } from "@/modules/auth/auth.store";
import { LessonEditor } from "@/modules/lessons/LessonEditor";
import { useAdminLesson, useUpdateLesson } from "@/modules/lessons/lessons.api";

export default function EditLessonPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const accessToken = useAuthStore((s) => s.accessToken);

  const lessonQuery = useAdminLesson(accessToken, id);
  const update = useUpdateLesson(accessToken, id);

  const initialValue = useMemo(() => {
    const l = lessonQuery.data?.lesson ?? null;
    if (!l) return null;
    return {
      lessonNumber: l.lessonNumber,
      slug: l.slug,
      title: l.title,
      subtitle: l.subtitle,
      date: l.date,
      reference: l.reference,
      published: l.published,
      content: l.content,
    };
  }, [lessonQuery.data?.lesson]);

  const [draft, setDraft] = useState<typeof initialValue>(null);
  const editorValue = draft ?? initialValue;

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editar aula</h1>
          <div className="mt-2 text-sm text-slate-600">ID: {id}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/lessons"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Voltar
          </Link>
          <button
            type="button"
            disabled={!editorValue || update.isPending}
            onClick={async () => {
              if (!editorValue) return;
              await update
                .mutateAsync({
                  lessonNumber: editorValue.lessonNumber,
                  slug: editorValue.slug,
                  title: editorValue.title,
                  subtitle: editorValue.subtitle,
                  date: editorValue.date,
                  reference: editorValue.reference,
                  published: editorValue.published,
                  content: editorValue.content,
                })
                .catch(() => null);
              setDraft(null);
            }}
            className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60"
          >
            {update.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {lessonQuery.isLoading ? (
        <div className="mt-6 text-sm text-slate-600">Carregando…</div>
      ) : null}

      {lessonQuery.isError ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Falha ao carregar a aula.
        </div>
      ) : null}

      {editorValue && accessToken ? (
        <div className="mt-8">
          <LessonEditor
            value={editorValue}
            accessToken={accessToken}
            lessonId={id}
            onChange={(next) => setDraft(next)}
          />
        </div>
      ) : null}

      {update.isError ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Falha ao salvar.
        </div>
      ) : null}
    </div>
  );
}

