"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula40NovaLesson } from "./config";

export function Aula40NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula40NovaLesson} />;
}
