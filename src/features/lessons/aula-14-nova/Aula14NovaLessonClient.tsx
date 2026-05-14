"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula14NovaLesson } from "./config";

export function Aula14NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula14NovaLesson} />;
}
