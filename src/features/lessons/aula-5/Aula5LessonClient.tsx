"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula5Lesson } from "./config";

export function Aula5LessonClient() {
  return <LessonTemplateLessonClient lesson={aula5Lesson} />;
}
