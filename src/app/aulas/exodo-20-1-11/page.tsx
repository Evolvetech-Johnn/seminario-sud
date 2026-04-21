import { Exodo2011LessonClient } from "@/features/lessons/exodo-20-1-11/Exodo2011LessonClient";
import { exodo2011Lesson } from "@/features/lessons/exodo-20-1-11/config";

export const metadata = {
  title: `Seminário SUD — ${exodo2011Lesson.title}`,
  description: exodo2011Lesson.theme,
};

export default function Exodo2011LessonPage() {
  return <Exodo2011LessonClient />;
}

