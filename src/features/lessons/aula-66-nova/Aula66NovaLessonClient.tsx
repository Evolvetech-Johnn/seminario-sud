"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula66NovaLesson } from "./config";

export function Aula66NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula66NovaLesson} />;
}
