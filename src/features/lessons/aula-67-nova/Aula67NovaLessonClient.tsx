"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula67NovaLesson } from "./config";

export function Aula67NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula67NovaLesson} />;
}
