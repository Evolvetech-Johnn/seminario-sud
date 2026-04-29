"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula10Lesson } from "./config";

export function Aula10LessonClient() {
  return <LessonTemplateLessonClient lesson={aula10Lesson} />;
}
