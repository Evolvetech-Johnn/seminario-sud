"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula65NovaLesson } from "./config";

export function Aula65NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula65NovaLesson} />;
}
