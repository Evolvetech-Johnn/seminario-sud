"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula25NovaLesson } from "./config";

export function Aula25NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula25NovaLesson} />;
}
