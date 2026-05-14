"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula11NovaLesson } from "./config";

export function Aula11NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula11NovaLesson} />;
}
