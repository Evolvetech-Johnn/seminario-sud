"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/seminario/AppHeader";
import { useStudentSession } from "@/hooks/useStudentSession";

type AlaLesson = {
  id: string;
  title: string;
  description: string;
  slug: string;
  ala: string;
  order: number;
  isActive: boolean;
  isToday?: boolean;
};

type AlaConfig = {
  name: string;
  description: string;
  turmas: string[];
};

const ALA_CONFIGS: Record<string, AlaConfig> = {
  ala1: {
    name: "Ala 1",
    description: "Turmas A, B, C",
    turmas: ["A", "B", "C"],
  },
  ala2: {
    name: "Ala 2",
    description: "Turmas D, E, F",
    turmas: ["D", "E", "F"],
  },
  ala3: {
    name: "Ala 3",
    description: "Turmas G, H, I",
    turmas: ["G", "H", "I"],
  },
};

export default function AlaPage({ params }: { params: { alaId: string } }) {
  const router = useRouter();
  const { session, isHydrated } = useStudentSession();
  const [lessons, setLessons] = useState<AlaLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const alaConfig = ALA_CONFIGS[params.alaId];

  useEffect(() => {
    if (!isHydrated) return;

    if (!alaConfig) {
      setLoading(false);
      return;
    }

    if (!session) {
      setLoading(false);
      return;
    }

    if (session.ala !== params.alaId) {
      router.replace(`/ala/${session.ala}`);
      return;
    }

    const loadLessons = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/ala-lessons?ala=${params.alaId}`);
        if (res.ok) {
          const data = await res.json();
          setLessons(data.lessons || []);
        }
      } catch (error) {
        console.error("Erro ao carregar aulas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [alaConfig, isHydrated, params.alaId, router, session]);

  if (!isHydrated) {
    return (
      <div className="min-h-dvh bg-white">
        <AppHeader />
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sud-blue mx-auto"></div>
            <p className="mt-4 text-slate-600">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!alaConfig) {
    return (
      <div className="min-h-dvh bg-white">
        <AppHeader />
        <main className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Ala não encontrada</h1>
            <p className="mt-2 text-slate-600">A ala solicitada não existe.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sud-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-sud-blue/90"
            >
              Voltar ao início
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-dvh bg-white">
        <AppHeader />
        <main className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sud-navy via-white to-white" />
          <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-8 rounded-3xl border border-white/20 bg-white/80 p-10 shadow-xl ring-1 ring-slate-200/50 backdrop-blur text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {alaConfig.name}
              </h1>
              <p className="mt-3 text-lg text-slate-700">{alaConfig.description}</p>
              <p className="mt-3 text-sm text-slate-600">
                Esta é a página pública da {alaConfig.name}. Somente estudantes desta ala podem entrar e ver o conteúdo completo.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={`/login?next=/ala/${params.alaId}`}
                  className="rounded-full bg-sud-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-sud-navy"
                >
                  Fazer login na {alaConfig.name}
                </Link>
                <Link
                  href="/login?mode=setPassword"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Esqueci a senha
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sud-navy via-white to-white" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {alaConfig.name}
            </h1>
            <p className="mt-2 text-lg text-white/90">
              {alaConfig.description} • Turma {session.turma}
            </p>
            <p className="mt-2 text-sm text-white/80">
              Bem-vindo(a), {session.name}
            </p>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
            >
              ← Voltar às alas
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
            >
              Meu progresso →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sud-blue mx-auto"></div>
                <p className="mt-4 text-slate-600">Carregando aulas...</p>
              </div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-xl ring-1 ring-slate-200/50 backdrop-blur">
                <h2 className="text-xl font-semibold text-slate-900">Nenhuma aula disponível</h2>
                <p className="mt-2 text-slate-600">
                  As aulas para sua ala ainda não foram configuradas pelo professor.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lessons
                .filter((lesson) => lesson.isActive)
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/aulas/${lesson.slug}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl ring-1 ring-slate-200/50 backdrop-blur transition hover:bg-white hover:shadow-2xl"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sud-blue transition">
                          {lesson.title}
                        </h3>
                        {lesson.isToday && (
                          <span className="inline-flex items-center rounded-full bg-sud-blue px-2 py-1 text-xs font-semibold text-white">
                            Aula de Hoje
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {lesson.description}
                      </p>
                      {!lesson.isToday && (
                        <div className="mt-4 text-xs text-slate-500">
                          Aula {lesson.order}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
