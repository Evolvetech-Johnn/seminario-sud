"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula49NovaLesson } from "./config";

export function Aula49NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula49NovaLesson} />;
}
