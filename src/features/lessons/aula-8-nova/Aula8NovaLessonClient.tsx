"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula8NovaLesson } from "./config";

export function Aula8NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula8NovaLesson} />;
}
