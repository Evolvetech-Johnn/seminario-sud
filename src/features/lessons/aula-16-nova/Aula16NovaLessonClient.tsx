"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula16NovaLesson } from "./config";

export function Aula16NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula16NovaLesson} />;
}
