"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula10NovaLesson } from "./config";

export function Aula10NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula10NovaLesson} />;
}
