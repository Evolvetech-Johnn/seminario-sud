"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppHeader } from "@/components/seminario/AppHeader";
import { Card } from "@/components/seminario/Card";
import { InputArea } from "@/components/seminario/InputArea";
import { Section } from "@/components/seminario/Section";
import {
  IconBread,
  IconCovenant,
  IconLamb,
  IconRepeat,
  IconShield,
  IconWater,
} from "@/components/seminario/icons";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useStudentSession } from "@/hooks/useStudentSession";
import { cn } from "@/lib/cn";

import { fazerComparacoesLesson } from "./config";

type CommitmentPlan = {
  before: string;
  during: string;
  after: string;
};

function lessonKey(studentId: string, suffix: string) {
  return `seminario:${studentId}:${fazerComparacoesLesson.slug}:${suffix}`;
}

function IconByKey({ icon }: { icon: string }) {
  switch (icon) {
    case "lamb":
      return <IconLamb />;
    case "shield":
      return <IconShield />;
    case "repeat":
      return <IconRepeat />;
    case "bread":
      return <IconBread />;
    case "water":
      return <IconWater />;
    case "covenant":
      return <IconCovenant />;
    default:
      return null;
  }
}

export function FazerComparacoesLessonClient() {
  const { session, isHydrated: isSessionHydrated, logout } = useStudentSession();
  const studentId = session?.id ?? "anon";
  const isLoggedIn = isSessionHydrated && Boolean(session);
  const loginHref = `/login?next=${encodeURIComponent("/aulas/fazer-comparacoes")}`;

  const icebreaker = useLocalStorageState(lessonKey(studentId, "icebreaker"), "", {});
  const discussionNotes = useLocalStorageState(
    lessonKey(studentId, "discussionNotes"),
    "",
    {},
  );
  const actionBefore = useLocalStorageState(lessonKey(studentId, "action:before"), "", {});
  const actionDuring = useLocalStorageState(lessonKey(studentId, "action:during"), "", {});
  const actionAfter = useLocalStorageState(lessonKey(studentId, "action:after"), "", {});

  const icebreakerValue = icebreaker.state;
  const discussionNotesValue = discussionNotes.state;
  const actionBeforeValue = actionBefore.state;
  const actionDuringValue = actionDuring.state;
  const actionAfterValue = actionAfter.state;

  const setIcebreakerValue = icebreaker.setState;
  const setDiscussionNotesValue = discussionNotes.setState;
  const setActionBeforeValue = actionBefore.setState;
  const setActionDuringValue = actionDuring.setState;
  const setActionAfterValue = actionAfter.setState;

  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const [reflectionShown, setReflectionShown] = useState(false);
  const [saveState, setSaveState] = useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "saved"; savedAt: string }
    | { status: "error" }
  >({ status: "idle" });

  const [rankingState, setRankingState] = useState<
    | { status: "idle" | "loading" }
    | {
        status: "loaded";
        items: Array<{ studentName: string; points: number; filledFields: number }>;
      }
    | { status: "error" }
  >({ status: "idle" });

  const commitmentPlan: CommitmentPlan = useMemo(
    () => ({
      before: actionBeforeValue,
      during: actionDuringValue,
      after: actionAfterValue,
    }),
    [actionAfterValue, actionBeforeValue, actionDuringValue],
  );

  const onReflect = useCallback(() => {
    setReflectionShown(true);
    window.setTimeout(() => setReflectionShown(false), 3500);
  }, []);

  const onSaveCommitment = useCallback(async () => {
    if (!session) return;
    setSaveState({ status: "saving" });
    try {
      const res = await fetch("/api/commitment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lessonSlug: fazerComparacoesLesson.slug,
          studentId: session?.id ?? null,
          studentName: session?.name ?? null,
          plan: commitmentPlan,
        }),
      });

      if (!res.ok) {
        setSaveState({ status: "error" });
        return;
      }

      const data = (await res.json()) as { savedAt?: string };
      const savedAt = data.savedAt ?? new Date().toISOString();
      setSaveState({ status: "saved", savedAt });
      window.setTimeout(() => setSaveState({ status: "idle" }), 3500);
    } catch {
      setSaveState({ status: "error" });
      window.setTimeout(() => setSaveState({ status: "idle" }), 3500);
    }
  }, [commitmentPlan, session]);

  const canSync =
    isSessionHydrated &&
    Boolean(session) &&
    icebreaker.isHydrated &&
    discussionNotes.isHydrated &&
    actionBefore.isHydrated &&
    actionDuring.isHydrated &&
    actionAfter.isHydrated;

  const studentIdForSync = session?.id ?? null;
  const studentNameForSync = session?.name ?? null;

  const answersPayload = useMemo(
    () => ({
      icebreaker: icebreakerValue,
      discussionNotes: discussionNotesValue,
      actionBefore: actionBeforeValue,
      actionDuring: actionDuringValue,
      actionAfter: actionAfterValue,
    }),
    [
      actionAfterValue,
      actionBeforeValue,
      actionDuringValue,
      discussionNotesValue,
      icebreakerValue,
    ],
  );

  useEffect(() => {
    if (!canSync) return;
    if (hasLoadedFromServer) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/lesson-responses?lessonSlug=${encodeURIComponent(fazerComparacoesLesson.slug)}&studentId=${encodeURIComponent(studentIdForSync ?? "")}`,
          { signal: controller.signal },
        );
        const json = (await res.json().catch(() => null)) as
          | { ok?: boolean; data?: { answers?: Partial<typeof answersPayload> } | null }
          | null;

        const serverAnswers = json?.data?.answers;
        if (serverAnswers) {
          if (!icebreakerValue && typeof serverAnswers.icebreaker === "string") {
            setIcebreakerValue(serverAnswers.icebreaker);
          }
          if (
            !discussionNotesValue &&
            typeof serverAnswers.discussionNotes === "string"
          ) {
            setDiscussionNotesValue(serverAnswers.discussionNotes);
          }
          if (!actionBeforeValue && typeof serverAnswers.actionBefore === "string") {
            setActionBeforeValue(serverAnswers.actionBefore);
          }
          if (!actionDuringValue && typeof serverAnswers.actionDuring === "string") {
            setActionDuringValue(serverAnswers.actionDuring);
          }
          if (!actionAfterValue && typeof serverAnswers.actionAfter === "string") {
            setActionAfterValue(serverAnswers.actionAfter);
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
    actionAfterValue,
    actionBeforeValue,
    actionDuringValue,
    canSync,
    discussionNotesValue,
    hasLoadedFromServer,
    icebreakerValue,
    setActionAfterValue,
    setActionBeforeValue,
    setActionDuringValue,
    setDiscussionNotesValue,
    setIcebreakerValue,
    studentIdForSync,
  ]);

  useEffect(() => {
    if (!canSync) return;

    const timeout = window.setTimeout(() => {
      fetch("/api/lesson-responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lessonSlug: fazerComparacoesLesson.slug,
          studentId: studentIdForSync,
          studentName: studentNameForSync,
          answers: answersPayload,
        }),
      }).catch(() => null);
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [answersPayload, canSync, studentIdForSync, studentNameForSync]);

  useEffect(() => {
    setRankingState({ status: "loading" });
    const controller = new AbortController();
    fetch(
      `/api/lesson-responses?lessonSlug=${encodeURIComponent(fazerComparacoesLesson.slug)}&view=ranking`,
      { cache: "no-store", signal: controller.signal },
    )
      .then(async (r) => {
        const j = (await r.json().catch(() => null)) as
          | {
              ok?: boolean;
              data?: {
                items?: Array<{ studentName?: string; points?: number; filledFields?: number }>;
              };
            }
          | null;
        if (!r.ok || !j?.ok) {
          setRankingState({ status: "error" });
          return;
        }
        const items =
          j?.data?.items?.map((it) => ({
            studentName: String(it.studentName ?? "Aluno"),
            points: Number(it.points ?? 0),
            filledFields: Number(it.filledFields ?? 0),
          })) ?? [];
        setRankingState({ status: "loaded", items });
      })
      .catch(() => {
        setRankingState({ status: "error" });
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader
        activeHref="/aulas/fazer-comparacoes"
        studentName={session?.name ?? null}
        onLogout={logout}
      />

      <main>
        <section className="relative">
          <div className="relative h-[64vh] min-h-[420px] w-full">
            <Image
              src={fazerComparacoesLesson.hero.image.src}
              alt={fazerComparacoesLesson.hero.image.alt}
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
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-sud-green" />
                  {fazerComparacoesLesson.theme}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {fazerComparacoesLesson.title}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
                  {fazerComparacoesLesson.hero.subtext}
                </p>

                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    “{fazerComparacoesLesson.hero.quote}”
                  </div>
                  <div className="mt-1 text-sm text-white/80">1 Néfi 13:26</div>
                </div>

                {fazerComparacoesLesson.referenceMaterial ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href="#consulta"
                      className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
                    >
                      Consulta
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
                  Você pode ver toda a aula. Para registrar e sincronizar suas respostas, faça
                  login com seu nome.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
                  >
                    Entrar para registrar
                  </Link>
                  <div className="text-sm text-slate-600">
                    Dica: use seu nome completo para evitar confusão.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Section
            id="quebra-de-gelo"
            title="Quebra de gelo"
            subtitle="Comparar é um jeito simples de enxergar com clareza."
          >
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-sud-gray p-5 sm:grid-cols-[1.2fr_auto] sm:items-end sm:gap-6 sm:p-7">
              <InputArea
                label={fazerComparacoesLesson.icebreaker.question}
                value={icebreaker.state}
                onChange={icebreaker.setState}
                placeholder={fazerComparacoesLesson.icebreaker.placeholder}
                rows={4}
              />
              <div className="flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={onReflect}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25 sm:w-auto"
                >
                  {fazerComparacoesLesson.icebreaker.cta}
                </button>
                <div
                  className={cn(
                    "text-sm text-slate-600 transition-opacity",
                    reflectionShown ? "opacity-100" : "opacity-0",
                  )}
                >
                  Volte a isso no fim da aula e veja o que mudou.
                </div>
              </div>
            </div>
          </Section>

          <div className="mt-10 sm:mt-14">
            <Section
              id="definir"
              title={fazerComparacoesLesson.passover.title}
              subtitle={fazerComparacoesLesson.passover.subtitle}
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-56 w-full sm:h-72">
                    <Image
                      src={fazerComparacoesLesson.passover.image.src}
                      alt={fazerComparacoesLesson.passover.image.alt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-sm font-semibold text-slate-700">Objetivo</div>
                    <div className="mt-1 text-base font-bold text-slate-900">
                      Identificar verdades implícitas
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Use as perguntas-guia para comparar e descobrir verdades preciosas.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {fazerComparacoesLesson.passover.cards.map((card) => (
                    <Card
                      key={card.key}
                      title={card.title}
                      description={card.description}
                      icon={<IconByKey icon={card.icon} />}
                      imageSrc={card.image?.src}
                      imageAlt={card.image?.alt}
                    />
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="exemplo"
              title={fazerComparacoesLesson.sacrament.title}
              subtitle={fazerComparacoesLesson.sacrament.subtitle}
              accent="green"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {fazerComparacoesLesson.sacrament.cards.map((card) => (
                    <Card
                      key={card.key}
                      title={card.title}
                      description={card.description}
                      icon={<IconByKey icon={card.icon} />}
                      imageSrc={card.image?.src}
                      imageAlt={card.image?.alt}
                      tone="spiritual"
                    />
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-sud-green/20 bg-white shadow-sm ring-1 ring-sud-green/10">
                  <div className="relative h-56 w-full sm:h-72">
                    <Image
                      src={fazerComparacoesLesson.sacrament.image.src}
                      alt={fazerComparacoesLesson.sacrament.image.alt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/5 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-sm font-semibold text-slate-700">Pergunta-guia</div>
                    <div className="mt-1 text-base font-bold text-slate-900">
                      Que verdade preciosa você identifica?
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Compare, escreva a verdade e conecte com uma ação real para hoje.
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="discussao"
              title={fazerComparacoesLesson.discussion.title}
              subtitle={fazerComparacoesLesson.discussion.subtitle}
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="text-sm font-semibold text-slate-700">Perguntas</div>
                  <div className="mt-3 space-y-3">
                    {fazerComparacoesLesson.discussion.questions.map((q) => (
                      <div
                        key={q}
                        className="rounded-2xl border border-slate-200 bg-sud-gray px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                      >
                        {q}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-sud-gray p-5 shadow-sm sm:p-7">
                  <InputArea
                    label="Anotações"
                    value={discussionNotes.state}
                    onChange={discussionNotes.setState}
                    placeholder="Escreva o que você percebeu, decidiu ou quer conversar depois…"
                    rows={8}
                  />
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="plano"
              title={fazerComparacoesLesson.actionPlan.title}
              subtitle={fazerComparacoesLesson.actionPlan.subtitle}
              accent="green"
            >
              <div className="rounded-3xl border border-sud-green/20 bg-white p-5 shadow-sm ring-1 ring-sud-green/10 sm:p-7">
                <div className="grid gap-4 lg:grid-cols-3">
                  <InputArea
                    label={fazerComparacoesLesson.actionPlan.fields[0]?.label ?? "Antes"}
                    value={actionBefore.state}
                    onChange={actionBefore.setState}
                    placeholder={fazerComparacoesLesson.actionPlan.fields[0]?.placeholder ?? ""}
                    rows={6}
                    tone="spiritual"
                  />
                  <InputArea
                    label={fazerComparacoesLesson.actionPlan.fields[1]?.label ?? "Durante"}
                    value={actionDuring.state}
                    onChange={actionDuring.setState}
                    placeholder={fazerComparacoesLesson.actionPlan.fields[1]?.placeholder ?? ""}
                    rows={6}
                    tone="spiritual"
                  />
                  <InputArea
                    label={fazerComparacoesLesson.actionPlan.fields[2]?.label ?? "Depois"}
                    value={actionAfter.state}
                    onChange={actionAfter.setState}
                    placeholder={fazerComparacoesLesson.actionPlan.fields[2]?.placeholder ?? ""}
                    rows={6}
                    tone="spiritual"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    {isLoggedIn
                      ? "Suas respostas são registradas automaticamente."
                      : "Você pode fazer um rascunho, mas precisa fazer login para registrar suas respostas."}
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "text-sm font-semibold transition-opacity",
                        saveState.status === "idle" ? "opacity-0" : "opacity-100",
                        saveState.status === "saved"
                          ? "text-sud-green"
                          : saveState.status === "error"
                            ? "text-red-600"
                            : "text-slate-600",
                      )}
                    >
                      {saveState.status === "saving"
                        ? "Salvando…"
                        : saveState.status === "saved"
                          ? "Compromisso salvo"
                          : saveState.status === "error"
                            ? "Falha ao salvar"
                            : ""}
                    </div>
                    <button
                      type="button"
                      onClick={onSaveCommitment}
                      disabled={!isLoggedIn || saveState.status === "saving"}
                      className={cn(
                        "inline-flex items-center justify-center rounded-2xl bg-sud-green px-5 py-3 text-sm font-bold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-sud-green/25",
                        !isLoggedIn || saveState.status === "saving"
                          ? "cursor-not-allowed opacity-80"
                          : "hover:bg-emerald-700",
                      )}
                    >
                      {isLoggedIn ? fazerComparacoesLesson.actionPlan.cta : "Entre para registrar"}
                    </button>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="ranking"
              title="Ranking da turma"
              subtitle="Pontos são calculados pela participação: preencher campos soma pontos, e completar tudo dá bônus."
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                {rankingState.status === "loading" ? (
                  <div className="text-sm font-semibold text-slate-600">Carregando…</div>
                ) : rankingState.status === "error" ? (
                  <div className="text-sm font-semibold text-slate-600">
                    Não foi possível carregar o ranking agora.
                  </div>
                ) : rankingState.status === "loaded" && rankingState.items.length > 0 ? (
                  <ol className="space-y-3">
                    {rankingState.items.map((it, idx) => (
                      <li
                        key={`${it.studentName}-${idx}`}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-sud-gray px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900">
                            {idx + 1}. {it.studentName}
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-600">
                            {Math.min(5, Math.max(0, it.filledFields))}/5 campos
                          </div>
                        </div>
                        <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-200">
                          {it.points} pts
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="text-sm text-slate-600">
                    Ainda não há pontuação registrada para esta aula.
                  </div>
                )}
              </div>
            </Section>
          </div>

          {fazerComparacoesLesson.referenceMaterial ? (
            <div className="mt-10 sm:mt-14">
              <Section
                id="consulta"
                title="Material de consulta"
                subtitle="Resumo do manual do professor (2026) para apoiar o estudo — sem atrapalhar a dinâmica da aula."
              >
                <details className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <summary className="cursor-pointer list-none select-none">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-base font-bold text-slate-900">
                          Abrir resumo e roteiro sugerido
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {fazerComparacoesLesson.referenceMaterial.title}
                        </div>
                      </div>
                      <div className="rounded-full bg-sud-gray px-3 py-2 text-xs font-semibold text-slate-700 transition group-open:bg-white group-open:ring-1 group-open:ring-slate-200">
                        Alternar
                      </div>
                    </div>
                  </summary>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-sud-gray p-5 sm:p-6">
                      <div className="text-sm font-semibold text-slate-700">
                        Resumo (em tópicos)
                      </div>
                      <div className="mt-4 space-y-4">
                        {fazerComparacoesLesson.referenceMaterial.sections.map((section) => (
                          <div key={section.title}>
                            <div className="text-sm font-bold text-slate-900">
                              {section.title}
                            </div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {section.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="text-sm font-semibold text-slate-700">
                        Roteiros de estudo sugeridos
                      </div>

                      {fazerComparacoesLesson.referenceMaterial.scriptureStudy ? (
                        <div className="mt-4">
                          <div className="text-sm font-bold text-slate-900">
                            {fazerComparacoesLesson.referenceMaterial.scriptureStudy.title}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {fazerComparacoesLesson.referenceMaterial.scriptureStudy.passages.map(
                              (p) => (
                                <span
                                  key={p}
                                  className="rounded-full bg-sud-gray px-3 py-1 text-xs font-semibold text-slate-700"
                                >
                                  {p}
                                </span>
                              ),
                            )}
                          </div>
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {fazerComparacoesLesson.referenceMaterial.scriptureStudy.prompts.map(
                              (q) => (
                                <li key={q}>{q}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      ) : null}

                      <div className="mt-6">
                        <a
                          href={fazerComparacoesLesson.referenceMaterial.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl bg-sud-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25"
                        >
                          Abrir fonte oficial
                        </a>
                      </div>
                    </div>
                  </div>
                </details>
              </Section>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-slate-600 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-slate-900">
            Seminário SUD — Aprender, Refletir, Aplicar
          </div>
          <div className="text-slate-600">Espaço reservado para futuras aulas</div>
        </div>
      </footer>
    </div>
  );
}

