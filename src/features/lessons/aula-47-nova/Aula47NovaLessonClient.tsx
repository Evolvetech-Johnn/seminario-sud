"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula47NovaLesson } from "./config";

export function Aula47NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula47NovaLesson} />;
}
