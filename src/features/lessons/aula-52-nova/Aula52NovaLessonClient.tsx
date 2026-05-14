"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula52NovaLesson } from "./config";

export function Aula52NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula52NovaLesson} />;
}
