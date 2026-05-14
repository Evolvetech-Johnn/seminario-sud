"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula50NovaLesson } from "./config";

export function Aula50NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula50NovaLesson} />;
}
