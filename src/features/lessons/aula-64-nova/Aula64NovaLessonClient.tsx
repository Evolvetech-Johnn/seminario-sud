"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula64NovaLesson } from "./config";

export function Aula64NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula64NovaLesson} />;
}
