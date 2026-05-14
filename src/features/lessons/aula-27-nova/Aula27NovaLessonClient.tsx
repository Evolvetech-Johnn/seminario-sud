"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula27NovaLesson } from "./config";

export function Aula27NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula27NovaLesson} />;
}
