"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

type AlaLesson = {
  id: string;
  ala: string;
  title: string;
  subtitle: string;
  content: any;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type Ala = "ala1" | "ala2" | "ala3";

export default function AdminAlaLessonsPage() {
  const [selectedAla, setSelectedAla] = useState<Ala>("ala1");
  const [lessons, setLessons] = useState<AlaLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    content: "",
  });

  const loadLessons = async (ala: Ala) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ala-lessons?ala=${ala}`);
      const json = await res.json();
      if (json.ok) {
        setLessons(json.data);
      }
    } catch (err) {
      console.error("Erro ao carregar aulas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons(selectedAla);
  }, [selectedAla]);

  const handleEdit = (lesson: AlaLesson) => {
    setEditingId(lesson.id);
    setEditForm({
      title: lesson.title,
      subtitle: lesson.subtitle,
      content: JSON.stringify(lesson.content, null, 2),
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const content = JSON.parse(editForm.content);
      const res = await fetch("/api/admin/ala-lessons", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: editForm.title,
          subtitle: editForm.subtitle,
          content,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        await loadLessons(selectedAla);
        setEditingId(null);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const content = JSON.parse(editForm.content);
      const res = await fetch("/api/admin/ala-lessons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ala: selectedAla,
          title: editForm.title,
          subtitle: editForm.subtitle,
          content,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        await loadLessons(selectedAla);
        setEditForm({ title: "", subtitle: "", content: "" });
      }
    } catch (err) {
      console.error("Erro ao criar:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return;

    try {
      const res = await fetch(`/api/admin/ala-lessons?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.ok) {
        await loadLessons(selectedAla);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Aulas por Ala</h1>
          <div className="mt-2 text-sm text-slate-600">
            Gerencie aulas específicas para cada ala.
          </div>
        </div>
        <Link
          href="/admin"
          className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
        >
          Voltar ao Admin
        </Link>
      </div>

      <div className="mt-6">
        <div className="inline-flex rounded-full bg-sud-gray p-1 ring-1 ring-slate-200">
          {(["ala1", "ala2", "ala3"] as const).map((ala) => (
            <button
              key={ala}
              type="button"
              onClick={() => setSelectedAla(ala)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition",
                selectedAla === ala ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/70",
              )}
            >
              {ala.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Aulas de {selectedAla.toUpperCase()}</h2>
          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Carregando...</div>
          ) : (
            <div className="mt-4 space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900">{lesson.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{lesson.subtitle}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(lesson)}
                        className="rounded-lg bg-sud-blue px-3 py-1 text-xs font-bold text-white transition hover:bg-sud-navy"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(lesson.id)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Nenhuma aula criada para esta ala ainda.
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {editingId ? "Editar Aula" : "Criar Nova Aula"}
          </h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="text-sm font-semibold text-slate-700">Título</div>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                placeholder="Ex: Introdução ao Velho Testamento"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-slate-700">Subtítulo</div>
              <input
                value={editForm.subtitle}
                onChange={(e) => setEditForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-300"
                placeholder="Ex: Visão geral e propósito"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold text-slate-700">Conteúdo (JSON)</div>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                rows={20}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-mono outline-none focus:border-slate-300"
                placeholder={`{
  "sections": [
    {
      "type": "intro",
      "content": "Introdução da aula..."
    },
    {
      "type": "learning_block",
      "content": "Bloco de aprendizagem...",
      "questions": ["Pergunta 1?", "Pergunta 2?"]
    }
  ]
}`}
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={editingId ? handleSave : handleCreate}
                className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
              >
                {editingId ? "Salvar Alterações" : "Criar Aula"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditForm({ title: "", subtitle: "", content: "" });
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}