"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula33NovaLesson } from "./config";

export function Aula33NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula33NovaLesson} />;
}
