"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula39NovaLesson } from "./config";

export function Aula39NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula39NovaLesson} />;
}
