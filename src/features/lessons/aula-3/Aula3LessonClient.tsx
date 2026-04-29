"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula3Lesson } from "./config";

export function Aula3LessonClient() {
  return <LessonTemplateLessonClient lesson={aula3Lesson} />;
}
