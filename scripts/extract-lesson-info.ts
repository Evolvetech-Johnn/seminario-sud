
import fs from "fs";
import path from "path";

function extractLessonInfo(configPath: string) {
  const content = fs.readFileSync(configPath, "utf8");
  
  const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  const subtitleMatch = content.match(/subtitle:\s*["']([^"']+)["']/);
  const dateMatch = content.match(/date:\s*["']([^"']+)["']/);
  const dayMatch = content.match(/day:\s*["']([^"']+)["']/);

  return {
    slug: slugMatch?.[1] || "",
    title: titleMatch?.[1] || "",
    subtitle: subtitleMatch?.[1] || "",
    date: dateMatch?.[1] || "",
    day: dayMatch?.[1] || "",
  };
}

async function main() {
  const lessonsDir = path.join(__dirname, "..", "src", "features", "lessons");
  const outputPath = path.join(lessonsDir, "lessonMetas.ts");

  const lessons: any[] = [];

  for (let lessonNumber = 1; lessonNumber <= 74; lessonNumber++) {
    let configPath = path.join(lessonsDir, `aula-${lessonNumber}-nova`, "config.ts");
    
    if (!fs.existsSync(configPath)) {
      configPath = path.join(lessonsDir, `aula-${lessonNumber}`, "config.ts");
    }

    if (!fs.existsSync(configPath)) {
      console.warn(`Aula ${lessonNumber} não encontrada!`);
      continue;
    }

    try {
      const info = extractLessonInfo(configPath);
      lessons.push({
        lessonNumber,
        ...info,
      });
    } catch (error) {
      console.warn(`Erro ao extrair info da aula ${lessonNumber}:`, error);
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
