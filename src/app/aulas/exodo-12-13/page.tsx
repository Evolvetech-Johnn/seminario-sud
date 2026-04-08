import type { Metadata } from "next";

import { Exodo1213LessonClient } from "@/features/lessons/exodo-12-13/Exodo1213LessonClient";
import { exodo1213Lesson } from "@/features/lessons/exodo-12-13/config";

export const metadata: Metadata = {
  title: `Seminário SUD — ${exodo1213Lesson.title}`,
  description: exodo1213Lesson.theme,
};

export default function Exodo1213Page() {
  return <Exodo1213LessonClient />;
}

