"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula23NovaLesson } from "./config";

export function Aula23NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula23NovaLesson} />;
}
