"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula17NovaLesson } from "./config";

export function Aula17NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula17NovaLesson} />;
}
