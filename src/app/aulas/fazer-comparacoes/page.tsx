import { FazerComparacoesLessonClient } from "@/features/lessons/fazer-comparacoes/FazerComparacoesLessonClient";
import { fazerComparacoesLesson } from "@/features/lessons/fazer-comparacoes/config";

export const metadata = {
  title: `Seminário SUD — ${fazerComparacoesLesson.title}`,
  description: fazerComparacoesLesson.theme,
};

export default function FazerComparacoesLessonPage() {
  return <FazerComparacoesLessonClient />;
}

