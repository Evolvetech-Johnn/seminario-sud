"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula18NovaLesson } from "./config";

export function Aula18NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula18NovaLesson} />;
}
