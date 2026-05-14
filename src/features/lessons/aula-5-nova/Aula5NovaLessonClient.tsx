"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula5NovaLesson } from "./config";

export function Aula5NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula5NovaLesson} />;
}
