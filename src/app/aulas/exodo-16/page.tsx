import { Exodo16LessonClient } from "@/features/lessons/exodo-16/Exodo16LessonClient";
import { exodo16Lesson } from "@/features/lessons/exodo-16/config";

export const metadata = {
  title: `Seminário SUD — ${exodo16Lesson.title}`,
  description: exodo16Lesson.theme,
};

export default function Exodo16LessonPage() {
  return <Exodo16LessonClient />;
}

