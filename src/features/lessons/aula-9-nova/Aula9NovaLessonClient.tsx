"use client";

import { LessonTemplateLessonClient } from "@/features/lessons/LessonDocLessonClient";

import { aula9NovaLesson } from "./config";

export function Aula9NovaLessonClient() {
  return <LessonTemplateLessonClient lesson={aula9NovaLesson} />;
}
