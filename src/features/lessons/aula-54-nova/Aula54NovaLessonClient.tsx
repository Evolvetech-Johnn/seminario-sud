"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula54NovaLesson } from "./config";

export function Aula54NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula54NovaLesson} />;
}
