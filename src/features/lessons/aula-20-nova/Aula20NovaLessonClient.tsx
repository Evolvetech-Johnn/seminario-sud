"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula20NovaLesson } from "./config";

export function Aula20NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula20NovaLesson} />;
}
