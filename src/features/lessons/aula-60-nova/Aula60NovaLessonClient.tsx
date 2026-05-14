"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula60NovaLesson } from "./config";

export function Aula60NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula60NovaLesson} />;
}
