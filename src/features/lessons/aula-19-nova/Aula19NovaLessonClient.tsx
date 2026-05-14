"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula19NovaLesson } from "./config";

export function Aula19NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula19NovaLesson} />;
}
