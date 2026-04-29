"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula9Lesson } from "./config";

export function Aula9LessonClient() {
  return <LessonTemplateLessonClient lesson={aula9Lesson} />;
}
