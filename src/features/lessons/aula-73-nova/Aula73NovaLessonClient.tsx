"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula73NovaLesson } from "./config";

export function Aula73NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula73NovaLesson} />;
}
