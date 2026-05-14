"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula43NovaLesson } from "./config";

export function Aula43NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula43NovaLesson} />;
}
