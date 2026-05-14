"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula35NovaLesson } from "./config";

export function Aula35NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula35NovaLesson} />;
}
