"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula3NovaLesson } from "./config";

export function Aula3NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula3NovaLesson} />;
}
