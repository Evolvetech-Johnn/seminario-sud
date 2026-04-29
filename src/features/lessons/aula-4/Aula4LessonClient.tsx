"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula4Lesson } from "./config";

export function Aula4LessonClient() {
  return <LessonTemplateLessonClient lesson={aula4Lesson} />;
}
