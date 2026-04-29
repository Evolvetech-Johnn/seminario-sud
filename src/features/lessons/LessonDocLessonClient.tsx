"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppHeader } from "@/components/seminario/AppHeader";
import { InputArea } from "@/components/seminario/InputArea";
import { Section } from "@/components/seminario/Section";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useStudentSession } from "@/hooks/useStudentSession";

import type { LessonTemplateDoc } from "./types";

function lessonKey(studentId: string, lessonSlug: string, suffix: string) {
  return `seminario:${studentId}:${lessonSlug}:${suffix}`;
}

function formatLessonDatePtBr(iso?: string) {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function LessonTemplateLessonClient({
  lesson,
  heroImageSrc = "/images/exodo-12-13/memoria%20sagrada.png",
}: {
  lesson: LessonTemplateDoc;
  heroImageSrc?: string;
}) {
  const { session, isHydrated: isSessionHydrated, logout } = useStudentSession();
  const studentId = session?.id ?? "anon";
  const isLoggedIn = isSessionHydrated && Boolean(session);
  const loginHref = `/login?next=${encodeURIComponent(`/aulas/${lesson.slug}`)}`;
  const dateLabel = formatLessonDatePtBr(lesson.date);

  const intro = lesson.sections.find((s) => s.type === "intro") ?? null;
  const application = lesson.sections.find((s) => s.type === "application") ?? null;

  const introResponse = useLocalStorageState(lessonKey(studentId, lesson.slug, "intro"), "", {});
  const notesResponse = useLocalStorageState(lessonKey(studentId, lesson.slug, "notes"), "", {});

  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);

  const canSync = isSessionHydrated && Boolean(session) && introResponse.isHydrated && notesResponse.isHydrated;
  const studentIdForSync = session?.id ?? null;
  const studentNameForSync = session?.name ?? null;

  const answersPayload = useMemo(
    () => ({
      icebreaker: introResponse.state,
      discussionNotes: notesResponse.state,
    }),
    [introResponse.state, notesResponse.state],
  );

  useEffect(() => {
    if (!canSync) return;
    if (hasLoadedFromServer) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/lesson-responses?lessonSlug=${encodeURIComponent(lesson.slug)}&studentId=${encodeURIComponent(studentIdForSync ?? "")}`,
          { signal: controller.signal },
        );
        const json = (await res.json().catch(() => null)) as
          | { ok?: boolean; data?: { answers?: Partial<typeof answersPayload> } | null }
          | null;

        const serverAnswers = json?.data?.answers;
        if (serverAnswers) {
          if (!introResponse.state && typeof serverAnswers.icebreaker === "string") {
            introResponse.setState(serverAnswers.icebreaker);
          }
          if (!notesResponse.state && typeof serverAnswers.discussionNotes === "string") {
            notesResponse.setState(serverAnswers.discussionNotes);
          }
        }
      } catch {
        return;
      } finally {
        setHasLoadedFromServer(true);
      }
    })();

    return () => controller.abort();
  }, [
    canSync,
    hasLoadedFromServer,
    introResponse,
    lesson.slug,
    notesResponse,
    studentIdForSync,
  ]);

  useEffect(() => {
    if (!canSync) return;

    const timeout = window.setTimeout(() => {
      fetch("/api/lesson-responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lessonSlug: lesson.slug,
          studentId: studentIdForSync,
          studentName: studentNameForSync,
          answers: answersPayload,
        }),
      }).catch(() => null);
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [answersPayload, canSync, lesson.slug, studentIdForSync, studentNameForSync]);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader activeHref={`/aulas/${lesson.slug}`} studentName={session?.name ?? null} onLogout={logout} />

      <main>
        <section className="relative">
          <div className="relative h-[52vh] min-h-[380px] w-full">
            <Image
              src={heroImageSrc}
              alt={lesson.title}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/55 to-slate-950/30" />
          </div>

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-6xl items-end px-4 pb-10 sm:px-6 sm:pb-14">
              <div className="w-full max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  {dateLabel ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 ring-1 ring-white/15 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-sud-green" />
                      {dateLabel}
                    </div>
                  ) : null}
                  {lesson.reference ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur">
                      {lesson.reference}
                    </div>
                  ) : null}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {lesson.title}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
                  {lesson.subtitle}
                </p>

                {lesson.sourceUrl ? (
                  <div className="mt-6">
                    <Link
                      href={lesson.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-sm backdrop-blur transition hover:bg-white/15"
                    >
                      Abrir fonte oficial
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="py-10 sm:py-14">
          {isSessionHydrated && !session ? (
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="rounded-3xl border border-slate-200 bg-sud-gray p-5 shadow-sm sm:p-7">
                <div className="text-sm font-semibold text-slate-900">Aula pública</div>
                <div className="mt-1 text-sm text-slate-600">
                  Você pode ver toda a aula. Para registrar suas respostas com seu nome, faça login.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
                  >
                    Entrar para registrar
                  </Link>
                  <div className="text-sm text-slate-600">
                    Dica: use um login consistente e uma senha que você lembre.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {lesson.sections.map((section, idx) => {
            const id = `sec-${idx + 1}-${section.type}`;

            if (section.type === "intro") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="intro" title="Introdução (Começo rápido)" subtitle={intro?.content ?? undefined}>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{section.content}</p>
                      <div className="mt-5">
                        <InputArea
                          label="Sua resposta"
                          value={introResponse.state}
                          onChange={introResponse.setState}
                          placeholder="Responda em 2–5 linhas..."
                          rows={6}
                        />
                      </div>
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "context") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="contexto" title="Contexto escriturístico" subtitle="O que está acontecendo — e como isso aponta para Cristo">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{section.content}</p>
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "learning_block") {
              const isFirstLearning = lesson.sections.filter((s) => s.type === "learning_block").indexOf(section) === 0;
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section
                    id={isFirstLearning ? "aprendizado-1" : "aprendizado-2"}
                    title={isFirstLearning ? "Bloco de aprendizado 1" : "Bloco de aprendizado 2 (Simbolismo / Doutrina)"}
                    subtitle="Leitura, explicação e perguntas para conversar"
                  >
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
                        {section.content}
                      </p>
                      {section.questions.length ? (
                        <div className="mt-5 rounded-2xl bg-sud-gray p-4">
                          <div className="text-sm font-bold text-slate-900">Perguntas</div>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {section.questions.map((q) => (
                              <li key={q}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "activity") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="atividade" title="Atividade interativa" subtitle="Faça isso de um jeito simples e direto">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
                        {section.instructions}
                      </p>
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "principle") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="principio" title="Princípio doutrinário" accent="green">
                    <div className="rounded-3xl border border-sud-green/20 bg-white p-5 shadow-sm ring-1 ring-sud-green/10 sm:p-7">
                      <div className="text-lg font-bold tracking-tight text-slate-900">{section.content}</div>
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "application") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="aplicacao" title="Aplicação pessoal" subtitle="Leve isso para a sua semana">
                    <div className="rounded-3xl border border-slate-200 bg-sud-gray p-5 shadow-sm sm:p-7">
                      {section.questions.length ? (
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                          <div className="text-sm font-bold text-slate-900">Perguntas diretas</div>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {section.questions.map((q) => (
                              <li key={q}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <div className="mt-5">
                        <InputArea
                          label="Minha aplicação / reflexão"
                          value={notesResponse.state}
                          onChange={notesResponse.setState}
                          placeholder="Responda com sinceridade. O que você vai mudar ou praticar?"
                          rows={8}
                          tone="spiritual"
                        />
                      </div>
                    </div>
                  </Section>
                </div>
              );
            }

            if (section.type === "closing") {
              return (
                <div key={id} className="mt-10 sm:mt-14">
                  <Section id="encerramento" title="Encerramento espiritual" subtitle="Foque em Cristo">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{section.content}</p>
                    </div>
                  </Section>
                </div>
              );
            }

            return null;
          })}
        </div>
      </main>
    </div>
  );
}

export const LessonDocLessonClient = LessonTemplateLessonClient;
