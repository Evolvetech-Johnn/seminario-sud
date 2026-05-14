"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula48NovaLesson } from "./config";

export function Aula48NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula48NovaLesson} />;
}
