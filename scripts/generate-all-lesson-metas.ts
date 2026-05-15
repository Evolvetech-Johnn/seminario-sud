
import fs from "fs";
import path from "path";

async function main() {
  const lessonsDir = path.join(__dirname, "..", "src", "features", "lessons");
  const outputPath = path.join(lessonsDir, "lessonMetas.ts");

  const lessons: any[] = [];

  for (let lessonNumber = 1; lessonNumber <= 74; lessonNumber++) {
    let lessonDir = path.join(lessonsDir, `aula-${lessonNumber}-nova`);
    let configPath = path.join(lessonDir, "config.ts");
    
    if (!fs.existsSync(configPath)) {
      lessonDir = path.join(lessonsDir, `aula-${lessonNumber}`);
      configPath = path.join(lessonDir, "config.ts");
    }

    if (!fs.existsSync(configPath)) {
      console.warn(`Aula ${lessonNumber} não encontrada!`);
      continue;
    }

    try {
      const modulePath = path.relative(__dirname, configPath).replace(".ts", "");
      const module = await import(`./${modulePath}`);
      const lessonKeys = Object.keys(module);
      if (lessonKeys.length === 0) continue;
      
      const lesson = module[lessonKeys[0]];
      lessons.push({
        lessonNumber,
        slug: lesson.slug,
        title: lesson.title,
        subtitle: lesson.subtitle,
        date: lesson.date,
        day: lesson.day,
      });
    } catch (error) {
      console.warn(`Erro ao importar aula ${lessonNumber}:`, error);
    }
  }

  lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);

  const content = `import type { LessonItem } from "@/components/seminario/LessonCalendar";

export type LessonMeta = {
  slug: string;
  title: string;
  subtitle: string;
  date?: string;
  day?: "ter" | "qua" | "qui" | "sex";
};

export const allLessonMetas: LessonMeta[] = [
${lessons.map((l) => `  {
    slug: "${l.slug}",
    title: "${l.title}",
    subtitle: "${l.subtitle}",
    date: "${l.date}",
    day: "${l.day}",
  }`).join(",\n")}
];

export function getLessonMetaBySlug(slug: string): LessonMeta | null {
  return allLessonMetas.find((l) => l.slug === slug) ?? null;
}
`;

  fs.writeFileSync(outputPath, content, "utf8");
  console.log(`Generated ${outputPath} successfully with ${lessons.length} lessons!`);
}

main().catch(console.error);
