"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula70NovaLesson } from "./config";

export function Aula70NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula70NovaLesson} />;
}
