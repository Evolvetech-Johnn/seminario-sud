"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula15NovaLesson } from "./config";

export function Aula15NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula15NovaLesson} />;
}
