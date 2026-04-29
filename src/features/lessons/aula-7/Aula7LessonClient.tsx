"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula7Lesson } from "./config";

export function Aula7LessonClient() {
  return <LessonTemplateLessonClient lesson={aula7Lesson} />;
}
