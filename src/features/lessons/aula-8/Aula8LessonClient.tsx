"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula8Lesson } from "./config";

export function Aula8LessonClient() {
  return <LessonTemplateLessonClient lesson={aula8Lesson} />;
}
