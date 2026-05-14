"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula28NovaLesson } from "./config";

export function Aula28NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula28NovaLesson} />;
}
