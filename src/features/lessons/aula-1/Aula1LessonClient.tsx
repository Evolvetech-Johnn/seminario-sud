"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula1Lesson } from "./config";

export function Aula1LessonClient() {
  return <LessonTemplateLessonClient lesson={aula1Lesson} />;
}
