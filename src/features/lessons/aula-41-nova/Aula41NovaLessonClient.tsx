"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula41NovaLesson } from "./config";

export function Aula41NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula41NovaLesson} />;
}
