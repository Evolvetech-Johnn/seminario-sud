"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula2Lesson } from "./config";

export function Aula2LessonClient() {
  return <LessonTemplateLessonClient lesson={aula2Lesson} />;
}
