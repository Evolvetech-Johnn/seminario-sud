import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMongoDb } from "@/lib/mongodb";
import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";
import { getLessonMetaBySlug } from "@/features/lessons/lessonMetas";
import { getLessonBySlug } from "@/features/lessons/lessonRegistry";

import type { LessonTemplateDoc } from "@/features/lessons/types";

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

async function getCustomAlaLessonBySlug(slug: string): Promise<LessonTemplateDoc | null> {
  const db = await getMongoDb();
  if (!db) return null;

  const doc = await db
    .collection("ala_lessons")
    .findOne({ slug }, { projection: { _id: 0 } });
  if (!doc) return null;

  const sections = Array.isArray(doc.content)
    ? doc.content
    : Array.isArray(doc.content?.sections)
    ? doc.content.sections
    : null;
  if (!sections) return null;

  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle ?? "",
    date: doc.date ?? undefined,
    day: doc.day ?? undefined,
    reference: doc.reference ?? undefined,
    sourceUrl: doc.sourceUrl ?? undefined,
    sections,
  };
}


export default async function AulaPage({ params }: Props) {
  const { slug } = await params;
  const customLesson = await getCustomAlaLessonBySlug(slug);
  if (customLesson) {
    return <LessonTemplateLessonClient lesson={customLesson} />;
  }

  const lesson = (await getLessonBySlug(slug)) ?? null;
  if (!lesson) notFound();
  return <LessonTemplateLessonClient lesson={lesson} />;
}
