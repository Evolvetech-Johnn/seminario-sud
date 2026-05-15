"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula69NovaLesson } from "./config";

export function Aula69NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula69NovaLesson} />;
}
