"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula68NovaLesson } from "./config";

export function Aula68NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula68NovaLesson} />;
}
