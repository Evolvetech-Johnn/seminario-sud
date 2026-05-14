"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula12NovaLesson } from "./config";

export function Aula12NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula12NovaLesson} />;
}
