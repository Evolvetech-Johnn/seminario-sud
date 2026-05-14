"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula13NovaLesson } from "./config";

export function Aula13NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula13NovaLesson} />;
}
