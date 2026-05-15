
import os
import re
from pathlib import Path

def extract_lesson_info(config_path):
    content = Path(config_path).read_text(encoding='utf-8')
    
    slug = re.search(r'slug:\s*["\']([^"\']+)["\']', content)
    title = re.search(r'title:\s*["\']([^"\']+)["\']', content)
    subtitle = re.search(r'subtitle:\s*["\']([^"\']+)["\']', content)
    date = re.search(r'date:\s*["\']([^"\']+)["\']', content)
    day = re.search(r'day:\s*["\']([^"\']+)["\']', content)
    
    return {
        'slug': slug.group(1) if slug else '',
        'title': title.group(1) if title else '',
        'subtitle': subtitle.group(1) if subtitle else '',
        'date': date.group(1) if date else '',
        'day': day.group(1) if day else ''
    }

def main():
    base_path = Path(__file__).parent.parent / "src" / "features" / "lessons"
    output_path = base_path / "lessonMetas.ts"
    
    lessons = []
    
    for lesson_number in range(1, 75):
        config_path = base_path / f"aula-{lesson_number}-nova" / "config.ts"
        
        if not config_path.exists():
            config_path = base_path / f"aula-{lesson_number}" / "config.ts"
        
        if config_path.exists():
            info = extract_lesson_info(config_path)
            lessons.append((lesson_number, info))
    
    lessons.sort(key=lambda x: x[0])
    
    content = '''import type { LessonItem } from "@/components/seminario/LessonCalendar";

export type LessonMeta = {
  slug: string;
  title: string;
  subtitle: string;
  date?: string;
  day?: "ter" | "qua" | "qui" | "sex";
};

export const allLessonMetas: LessonMeta[] = [
'''.strip() + '\n'
    
    for (num, info) in lessons:
        content += f'  {{\n'
        content += f'    slug: "{info["slug"]}",\n'
        content += f'    title: "{info["title"]}",\n'
        content += f'    subtitle: "{info["subtitle"]}",\n'
        content += f'    date: "{info["date"]}",\n'
        content += f'    day: "{info["day"]}",\n'
        content += '  },\n'
    
    content += '''
];

export function getLessonMetaBySlug(slug: string): LessonMeta | null {
  return allLessonMetas.find((l) => l.slug === slug) ?? null;
}
'''.strip()
    
    output_path.write_text(content, encoding='utf-8')
    print(f"Generated {len(lessons)} lessons to {output_path}")

if __name__ == "__main__":
    main()
