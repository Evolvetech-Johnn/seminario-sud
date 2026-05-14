"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula38NovaLesson } from "./config";

export function Aula38NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula38NovaLesson} />;
}
