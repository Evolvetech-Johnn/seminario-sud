"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula71NovaLesson } from "./config";

export function Aula71NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula71NovaLesson} />;
}
