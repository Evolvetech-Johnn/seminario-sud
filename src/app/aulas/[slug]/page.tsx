import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";
import { getLessonMetaBySlug } from "@/features/lessons/lessonMetas";
import { getLessonBySlug } from "@/features/lessons/lessonRegistry";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lessonMeta = getLessonMetaBySlug(slug);
  if (!lessonMeta) return { title: "Seminário SUD — Aula não encontrada" };
  return {
    title: `Seminário SUD — ${lessonMeta.title}`,
    description: lessonMeta.subtitle,
  };
}

export default async function AulaPage({ params }: Props) {
  const { slug } = await params;
  const lesson = (await getLessonBySlug(slug)) ?? null;
  if (!lesson) notFound();
  return <LessonTemplateLessonClient lesson={lesson} />;
}
