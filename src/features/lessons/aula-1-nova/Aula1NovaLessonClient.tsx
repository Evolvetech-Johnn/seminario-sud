"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula1NovaLesson } from "./config";

export function Aula1NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula1NovaLesson} />;
}
