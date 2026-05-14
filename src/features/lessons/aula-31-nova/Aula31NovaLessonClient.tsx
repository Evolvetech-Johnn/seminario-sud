"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula31NovaLesson } from "./config";

export function Aula31NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula31NovaLesson} />;
}
