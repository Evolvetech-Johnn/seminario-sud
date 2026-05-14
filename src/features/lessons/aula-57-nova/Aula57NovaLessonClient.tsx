"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula57NovaLesson } from "./config";

export function Aula57NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula57NovaLesson} />;
}
