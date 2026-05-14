"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula46NovaLesson } from "./config";

export function Aula46NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula46NovaLesson} />;
}
