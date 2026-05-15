"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula63NovaLesson } from "./config";

export function Aula63NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula63NovaLesson} />;
}
