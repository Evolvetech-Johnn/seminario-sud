"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula37NovaLesson } from "./config";

export function Aula37NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula37NovaLesson} />;
}
