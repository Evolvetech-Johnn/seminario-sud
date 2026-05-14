"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula61NovaLesson } from "./config";

export function Aula61NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula61NovaLesson} />;
}
