"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula42NovaLesson } from "./config";

export function Aula42NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula42NovaLesson} />;
}
