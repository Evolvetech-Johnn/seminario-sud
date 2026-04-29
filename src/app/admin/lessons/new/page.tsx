"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/modules/auth/auth.store";
import { useCreateLesson } from "@/modules/lessons/lessons.api";
import type { LessonContent } from "@/modules/lessons/lessons.types";

function initialContent(): LessonContent {
  return {
    blocks: [
      { type: "intro", text: "" },
      { type: "context", text: "" },
      { type: "learning_block", title: "Bloco 1", content: "", questions: [] },
      { type: "application", questions: [] },
      { type: "closing", text: "" },
    ],
  };
}

export default function NewLessonPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const create = useCreateLesson(accessToken);

  const [lessonNumber, setLessonNumber] = useState(1);
  const [slug, setSlug] = useState("aula-1");
  const [title, setTitle] = useState("Nova aula");
  const [subtitle, setSubtitle] = useState("Subtítulo");

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nova aula</h1>
      <div className="mt-2 text-sm text-slate-600">Crie a aula e depois edite o conteúdo.</div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await create
              .mutateAsync({
                lessonNumber,
                slug,
                title,
                subtitle,
                content: initialContent(),
                published: false,
              })
              .catch(() => null);
            const id = result?.lesson?.id ?? null;
            if (id) router.push(`/admin/lessons/${id}`);
          }}
        >
          <div className="grid gap-2">
            <label htmlFor="lessonNumber" className="text-sm font-semibold text-slate-700">
              Nº da aula
            </label>
            <input
              id="lessonNumber"
              name="lessonNumber"
              type="number"
              value={lessonNumber}
              onChange={(e) => setLessonNumber(Number(e.target.value || 0))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-semibold text-slate-700">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Título
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="subtitle" className="text-sm font-semibold text-slate-700">
              Subtítulo
            </label>
            <input
              id="subtitle"
              name="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={create.isPending || !accessToken}
              className="w-full rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60"
            >
              {create.isPending ? "Criando..." : "Criar aula"}
            </button>
          </div>
        </form>
      </div>

      {create.isError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Falha ao criar aula.
        </div>
      ) : null}
    </div>
  );
}

