"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula34NovaLesson } from "./config";

export function Aula34NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula34NovaLesson} />;
}
