"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula29NovaLesson } from "./config";

export function Aula29NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula29NovaLesson} />;
}
