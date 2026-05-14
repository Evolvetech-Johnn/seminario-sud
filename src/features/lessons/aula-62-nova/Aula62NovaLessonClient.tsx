"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula62NovaLesson } from "./config";

export function Aula62NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula62NovaLesson} />;
}
