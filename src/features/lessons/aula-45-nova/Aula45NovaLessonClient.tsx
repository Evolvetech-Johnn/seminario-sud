"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula45NovaLesson } from "./config";

export function Aula45NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula45NovaLesson} />;
}
