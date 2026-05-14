"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula53NovaLesson } from "./config";

export function Aula53NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula53NovaLesson} />;
}
