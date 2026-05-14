"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula59NovaLesson } from "./config";

export function Aula59NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula59NovaLesson} />;
}
