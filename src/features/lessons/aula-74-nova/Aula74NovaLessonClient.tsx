"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula74NovaLesson } from "./config";

export function Aula74NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula74NovaLesson} />;
}
