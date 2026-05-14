"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula24NovaLesson } from "./config";

export function Aula24NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula24NovaLesson} />;
}
