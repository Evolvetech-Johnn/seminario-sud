"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula6NovaLesson } from "./config";

export function Aula6NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula6NovaLesson} />;
}
