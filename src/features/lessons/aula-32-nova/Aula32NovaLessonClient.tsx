"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula32NovaLesson } from "./config";

export function Aula32NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula32NovaLesson} />;
}
