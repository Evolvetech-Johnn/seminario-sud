"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { API_BASE_URL } from "@/modules/api/http";
import { uploadLessonImage } from "@/modules/media/media.api";
import type { LessonContent, LessonContentBlock } from "./lessons.types";

function parseQuestions(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function formatQuestions(questions: string[]) {
  return questions.join("\n");
}

function defaultContent(): LessonContent {
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

function coerceContent(input: unknown): LessonContent {
  if (typeof input !== "object" || input === null) return defaultContent();
  const blocks = (input as any).blocks;
  if (!Array.isArray(blocks)) return defaultContent();
  return { blocks: blocks as LessonContentBlock[] };
}

type LessonEditorValue = {
  lessonNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string | null;
  reference: string | null;
  published: boolean;
  content: unknown;
};

export function LessonEditor({
  value,
  onChange,
  accessToken,
  lessonId,
}: {
  value: LessonEditorValue;
  onChange: (next: LessonEditorValue) => void;
  accessToken: string;
  lessonId?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const content = useMemo(() => coerceContent(value.content), [value.content]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="lessonNumber" className="text-sm font-semibold text-slate-700">
              Nº da aula
            </label>
            <input
              id="lessonNumber"
              name="lessonNumber"
              type="number"
              value={value.lessonNumber}
              onChange={(e) =>
                onChange({
                  ...value,
                  lessonNumber: Number(e.target.value || 0),
                })
              }
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
              value={value.slug}
              onChange={(e) => onChange({ ...value, slug: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Título
            </label>
            <input
              id="title"
              name="title"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="subtitle" className="text-sm font-semibold text-slate-700">
              Subtítulo
            </label>
            <input
              id="subtitle"
              name="subtitle"
              value={value.subtitle}
              onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-semibold text-slate-700">
              Data (ISO)
            </label>
            <input
              id="date"
              name="date"
              value={value.date ?? ""}
              onChange={(e) => onChange({ ...value, date: e.target.value || null })}
              placeholder="2026-04-29T00:00:00.000Z"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="reference" className="text-sm font-semibold text-slate-700">
              Referência
            </label>
            <input
              id="reference"
              name="reference"
              value={value.reference ?? ""}
              onChange={(e) => onChange({ ...value, reference: e.target.value || null })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={value.published}
              onChange={(e) => onChange({ ...value, published: e.target.checked })}
            />
            Publicada
          </label>

          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            <button
              type="button"
              disabled={isUploading}
              onClick={async () => {
                if (!lessonId) return;
                const el = fileInputRef.current;
                if (!el) return;
                el.value = "";
                el.click();

                const handleChange = async () => {
                  const file = el.files?.[0] ?? null;
                  el.removeEventListener("change", handleChange);
                  if (!file) return;

                  setIsUploading(true);
                  try {
                    const result = await uploadLessonImage({
                      apiBaseUrl: API_BASE_URL,
                      accessToken,
                      file,
                      lessonId,
                      type: "image",
                    });

                    const next: LessonContent = {
                      blocks: [...content.blocks, { type: "image", url: result.media.url }],
                    };
                    onChange({ ...value, content: next });
                  } finally {
                    setIsUploading(false);
                  }
                };

                el.addEventListener("change", handleChange);
              }}
              className={cn(
                "rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90 disabled:opacity-60",
                !lessonId && "opacity-50",
              )}
            >
              {isUploading ? "Enviando..." : "Adicionar imagem"}
            </button>
            {!lessonId ? (
              <div className="text-xs font-semibold text-slate-500">Salve a aula para habilitar upload.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-base font-bold text-slate-900">Conteúdo</div>
            <div className="mt-1 text-sm text-slate-600">JSON estruturado (blocos).</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next: LessonContent = { blocks: [...content.blocks, { type: "intro", text: "" }] };
                onChange({ ...value, content: next });
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              + Intro
            </button>
            <button
              type="button"
              onClick={() => {
                const next: LessonContent = { blocks: [...content.blocks, { type: "context", text: "" }] };
                onChange({ ...value, content: next });
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              + Contexto
            </button>
            <button
              type="button"
              onClick={() => {
                const next: LessonContent = {
                  blocks: [
                    ...content.blocks,
                    { type: "learning_block", title: "Bloco", content: "", questions: [] },
                  ],
                };
                onChange({ ...value, content: next });
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              + Bloco
            </button>
            <button
              type="button"
              onClick={() => {
                const next: LessonContent = { blocks: [...content.blocks, { type: "application", questions: [] }] };
                onChange({ ...value, content: next });
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              + Aplicação
            </button>
            <button
              type="button"
              onClick={() => {
                const next: LessonContent = { blocks: [...content.blocks, { type: "closing", text: "" }] };
                onChange({ ...value, content: next });
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              + Encerramento
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {content.blocks.map((block, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                  {block.type}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextBlocks = content.blocks.filter((_, i) => i !== idx);
                      onChange({ ...value, content: { blocks: nextBlocks } });
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Remover
                  </button>
                </div>
              </div>

              {block.type === "intro" || block.type === "context" || block.type === "principle" || block.type === "closing" ? (
                <textarea
                  value={block.text}
                  onChange={(e) => {
                    const nextBlocks = [...content.blocks];
                    nextBlocks[idx] = { ...block, text: e.target.value };
                    onChange({ ...value, content: { blocks: nextBlocks } });
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
                  rows={5}
                />
              ) : null}

              {block.type === "learning_block" ? (
                <div className="mt-3 grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700">Título do bloco</label>
                    <input
                      value={block.title}
                      onChange={(e) => {
                        const nextBlocks = [...content.blocks];
                        nextBlocks[idx] = { ...block, title: e.target.value };
                        onChange({ ...value, content: { blocks: nextBlocks } });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700">Conteúdo</label>
                    <textarea
                      value={block.content}
                      onChange={(e) => {
                        const nextBlocks = [...content.blocks];
                        nextBlocks[idx] = { ...block, content: e.target.value };
                        onChange({ ...value, content: { blocks: nextBlocks } });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
                      rows={5}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700">Perguntas (1 por linha)</label>
                    <textarea
                      value={formatQuestions(block.questions)}
                      onChange={(e) => {
                        const nextBlocks = [...content.blocks];
                        nextBlocks[idx] = { ...block, questions: parseQuestions(e.target.value) };
                        onChange({ ...value, content: { blocks: nextBlocks } });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
                      rows={4}
                    />
                  </div>
                </div>
              ) : null}

              {block.type === "activity" ? (
                <textarea
                  value={block.instructions}
                  onChange={(e) => {
                    const nextBlocks = [...content.blocks];
                    nextBlocks[idx] = { ...block, instructions: e.target.value };
                    onChange({ ...value, content: { blocks: nextBlocks } });
                  }}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
                  rows={6}
                />
              ) : null}

              {block.type === "application" ? (
                <div className="mt-3 grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">Perguntas (1 por linha)</label>
                  <textarea
                    value={formatQuestions(block.questions)}
                    onChange={(e) => {
                      const nextBlocks = [...content.blocks];
                      nextBlocks[idx] = { ...block, questions: parseQuestions(e.target.value) };
                      onChange({ ...value, content: { blocks: nextBlocks } });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
                    rows={4}
                  />
                </div>
              ) : null}

              {block.type === "image" ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={block.url} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="border-t border-slate-200 px-4 py-3">
                    <div className="truncate text-xs font-semibold text-slate-600">{block.url}</div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

