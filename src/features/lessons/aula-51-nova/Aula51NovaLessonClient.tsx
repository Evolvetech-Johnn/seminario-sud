"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula51NovaLesson } from "./config";

export function Aula51NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula51NovaLesson} />;
}
