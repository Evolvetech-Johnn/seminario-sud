"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula4NovaLesson } from "./config";

export function Aula4NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula4NovaLesson} />;
}
