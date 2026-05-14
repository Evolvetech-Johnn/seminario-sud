"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula56NovaLesson } from "./config";

export function Aula56NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula56NovaLesson} />;
}
