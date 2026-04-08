"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

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
import { cn } from "@/lib/cn";

import { exodo1213Lesson } from "./config";

type CommitmentPlan = {
  before: string;
  during: string;
  after: string;
};

function lessonKey(suffix: string) {
  return `seminario:${exodo1213Lesson.slug}:${suffix}`;
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

export function Exodo1213LessonClient() {
  const icebreaker = useLocalStorageState(lessonKey("icebreaker"), "", {});
  const discussionNotes = useLocalStorageState(lessonKey("discussionNotes"), "", {});
  const actionBefore = useLocalStorageState(lessonKey("action:before"), "", {});
  const actionDuring = useLocalStorageState(lessonKey("action:during"), "", {});
  const actionAfter = useLocalStorageState(lessonKey("action:after"), "", {});

  const [reflectionShown, setReflectionShown] = useState(false);
  const [saveState, setSaveState] = useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "saved"; savedAt: string }
    | { status: "error" }
  >({ status: "idle" });

  const commitmentPlan: CommitmentPlan = useMemo(
    () => ({
      before: actionBefore.state,
      during: actionDuring.state,
      after: actionAfter.state,
    }),
    [actionAfter.state, actionBefore.state, actionDuring.state],
  );

  const onReflect = useCallback(() => {
    setReflectionShown(true);
    window.setTimeout(() => setReflectionShown(false), 3500);
  }, []);

  const onSaveCommitment = useCallback(async () => {
    setSaveState({ status: "saving" });
    try {
      const res = await fetch("/api/commitment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lessonSlug: exodo1213Lesson.slug,
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
  }, [commitmentPlan]);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader activeHref="/aulas/exodo-12-13" />

      <main>
        <section className="relative">
          <div className="relative h-[64vh] min-h-[420px] w-full">
            <Image
              src={exodo1213Lesson.hero.image.src}
              alt={exodo1213Lesson.hero.image.alt}
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
                  {exodo1213Lesson.theme}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {exodo1213Lesson.title}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
                  {exodo1213Lesson.hero.subtext}
                </p>

                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    “{exodo1213Lesson.hero.quote}”
                  </div>
                  <div className="mt-1 text-sm text-white/80">
                    Lucas 22:19
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-10 sm:py-14">
          <Section
            id="quebra-de-gelo"
            title="Quebra de gelo"
            subtitle="Comece simples: o que é sagrado para você tende a ser aquilo que você escolhe lembrar."
          >
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-sud-gray p-5 sm:grid-cols-[1.2fr_auto] sm:items-end sm:gap-6 sm:p-7">
              <InputArea
                label={exodo1213Lesson.icebreaker.question}
                value={icebreaker.state}
                onChange={icebreaker.setState}
                placeholder={exodo1213Lesson.icebreaker.placeholder}
                rows={4}
              />
              <div className="flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={onReflect}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-sud-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sud-navy focus:outline-none focus:ring-4 focus:ring-sud-blue/25 sm:w-auto"
                >
                  {exodo1213Lesson.icebreaker.cta}
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
              id="pascoa"
              title={exodo1213Lesson.passover.title}
              subtitle={exodo1213Lesson.passover.subtitle}
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-56 w-full sm:h-72">
                    <Image
                      src={exodo1213Lesson.passover.image.src}
                      alt={exodo1213Lesson.passover.image.alt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-sm font-semibold text-slate-700">
                      Objetivo
                    </div>
                    <div className="mt-1 text-base font-bold text-slate-900">
                      Ver Cristo nos símbolos
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Leia Êxodo 12:11–14 e marque palavras que mostrem
                      repetição, lembrança e convênio.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {exodo1213Lesson.passover.cards.map((card) => (
                    <Card
                      key={card.key}
                      title={card.title}
                      description={card.description}
                      icon={<IconByKey icon={card.icon} />}
                    />
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="sacramento"
              title={exodo1213Lesson.sacrament.title}
              subtitle={exodo1213Lesson.sacrament.subtitle}
              accent="green"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {exodo1213Lesson.sacrament.cards.map((card) => (
                    <Card
                      key={card.key}
                      title={card.title}
                      description={card.description}
                      icon={<IconByKey icon={card.icon} />}
                      tone="spiritual"
                    />
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-sud-green/20 bg-white shadow-sm ring-1 ring-sud-green/10">
                  <div className="relative h-56 w-full sm:h-72">
                    <Image
                      src={exodo1213Lesson.sacrament.image.src}
                      alt={exodo1213Lesson.sacrament.image.alt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/5 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-sm font-semibold text-slate-700">
                      Pergunta-guia
                    </div>
                    <div className="mt-1 text-base font-bold text-slate-900">
                      O que significa “lembrar sempre” na prática?
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Pense em uma atitude concreta que você quer levar para a
                      semana. Não precisa ser grande — precisa ser real.
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-10 sm:mt-14">
            <Section
              id="discussao"
              title={exodo1213Lesson.discussion.title}
              subtitle={exodo1213Lesson.discussion.subtitle}
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="text-sm font-semibold text-slate-700">
                    Perguntas
                  </div>
                  <div className="mt-3 space-y-3">
                    {exodo1213Lesson.discussion.questions.map((q) => (
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
              title={exodo1213Lesson.actionPlan.title}
              subtitle={exodo1213Lesson.actionPlan.subtitle}
              accent="green"
            >
              <div className="rounded-3xl border border-sud-green/20 bg-white p-5 shadow-sm ring-1 ring-sud-green/10 sm:p-7">
                <div className="grid gap-4 lg:grid-cols-3">
                  <InputArea
                    label={exodo1213Lesson.actionPlan.fields[0]?.label ?? "Antes"}
                    value={actionBefore.state}
                    onChange={actionBefore.setState}
                    placeholder={
                      exodo1213Lesson.actionPlan.fields[0]?.placeholder ?? ""
                    }
                    rows={6}
                    tone="spiritual"
                  />
                  <InputArea
                    label={
                      exodo1213Lesson.actionPlan.fields[1]?.label ?? "Durante"
                    }
                    value={actionDuring.state}
                    onChange={actionDuring.setState}
                    placeholder={
                      exodo1213Lesson.actionPlan.fields[1]?.placeholder ?? ""
                    }
                    rows={6}
                    tone="spiritual"
                  />
                  <InputArea
                    label={exodo1213Lesson.actionPlan.fields[2]?.label ?? "Depois"}
                    value={actionAfter.state}
                    onChange={actionAfter.setState}
                    placeholder={
                      exodo1213Lesson.actionPlan.fields[2]?.placeholder ?? ""
                    }
                    rows={6}
                    tone="spiritual"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600">
                    Seu compromisso fica salvo neste dispositivo (local).
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
                      disabled={saveState.status === "saving"}
                      className={cn(
                        "inline-flex items-center justify-center rounded-2xl bg-sud-green px-5 py-3 text-sm font-bold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-sud-green/25",
                        saveState.status === "saving"
                          ? "cursor-not-allowed opacity-80"
                          : "hover:bg-emerald-700",
                      )}
                    >
                      {exodo1213Lesson.actionPlan.cta}
                    </button>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-slate-600 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-slate-900">
            Seminário SUD — Aprender, Refletir, Aplicar
          </div>
          <div className="text-slate-600">
            Espaço reservado para futuras aulas
          </div>
        </div>
      </footer>
    </div>
  );
}
