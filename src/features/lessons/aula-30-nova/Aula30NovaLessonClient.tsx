"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula30NovaLesson } from "./config";

export function Aula30NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula30NovaLesson} />;
}
