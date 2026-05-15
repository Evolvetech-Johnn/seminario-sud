import fs from "fs";
import path from "path";

const lessonsDir = path.join(__dirname, "..", "src", "features", "lessons");
const outputPath = path.join(lessonsDir, "lessonMetas.ts");

async function main() {
  const lessonDirs = fs.readdirSync(lessonsDir).filter((dir) => dir.startsWith("aula-") && dir.includes("-nova"));
  const lessons: any[] = [];

  for (const lessonDir of lessonDirs) {
    const configPath = path.join(lessonsDir, lessonDir, "config.ts");
    if (!fs.existsSync(configPath)) continue;

    const lessonNumberMatch = lessonDir.match(/aula-(\d+)-nova/);
    if (!lessonNumberMatch) continue;

    const lessonNumber = parseInt(lessonNumberMatch[1], 10);
    const modulePath = path.join("..", configPath.replace(".ts", ""));
    const module = await import(modulePath);
    const lessonKey = Object.keys(module)[0];
    const lesson = module[lessonKey];

    lessons.push({
      lessonNumber,
      slug: lesson.slug,
      title: lesson.title,
      subtitle: lesson.subtitle,
      date: lesson.date,
      day: lesson.day,
    });
  }

  lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);

  const content = `import type { LessonItem } from "@/components/seminario/LessonCalendar";

export const lessonMetas: LessonItem[] = [
${lessons.map((l) => `  {
    slug: "${l.slug}",
    title: "${l.title}",
    subtitle: "${l.subtitle}",
    date: "${l.date}",
    day: "${l.day}",
  }`).join(",\n")}
];
`;

  fs.writeFileSync(outputPath, content, "utf8");
  console.log(`Generated ${outputPath} successfully!`);
}

main().catch(console.error);
