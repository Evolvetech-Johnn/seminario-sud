"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula7NovaLesson } from "./config";

export function Aula7NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula7NovaLesson} />;
}
