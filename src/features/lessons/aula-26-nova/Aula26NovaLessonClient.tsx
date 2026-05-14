"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula26NovaLesson } from "./config";

export function Aula26NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula26NovaLesson} />;
}
