"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula55NovaLesson } from "./config";

export function Aula55NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula55NovaLesson} />;
}
