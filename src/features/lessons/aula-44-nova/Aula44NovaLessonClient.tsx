"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula44NovaLesson } from "./config";

export function Aula44NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula44NovaLesson} />;
}
