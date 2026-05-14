"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula58NovaLesson } from "./config";

export function Aula58NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula58NovaLesson} />;
}
