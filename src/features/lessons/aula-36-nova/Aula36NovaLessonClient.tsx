"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula36NovaLesson } from "./config";

export function Aula36NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula36NovaLesson} />;
}
