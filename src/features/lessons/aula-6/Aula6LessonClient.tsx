"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula6Lesson } from "./config";

export function Aula6LessonClient() {
  return <LessonTemplateLessonClient lesson={aula6Lesson} />;
}
