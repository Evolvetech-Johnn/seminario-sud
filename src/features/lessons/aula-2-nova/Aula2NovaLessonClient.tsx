"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula2NovaLesson } from "./config";

export function Aula2NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula2NovaLesson} />;
}
