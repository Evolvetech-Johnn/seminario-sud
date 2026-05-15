"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula72NovaLesson } from "./config";

export function Aula72NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula72NovaLesson} />;
}
