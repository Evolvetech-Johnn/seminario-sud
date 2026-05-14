import type { LessonTemplateDoc, LessonSlug } from "@/features/lessons/types";

type LessonLoader = () => Promise<LessonTemplateDoc>;

const lessonLoadersByNumber: Record<number, LessonLoader> = {
  1: async () => (await import("./aula-1-nova/config")).aula1NovaLesson,
  2: async () => (await import("./aula-2-nova/config")).aula2NovaLesson,
  3: async () => (await import("./aula-3-nova/config")).aula3NovaLesson,
  4: async () => (await import("./aula-4-nova/config")).aula4NovaLesson,
  5: async () => (await import("./aula-5-nova/config")).aula5NovaLesson,
  6: async () => (await import("./aula-6-nova/config")).aula6NovaLesson,
  7: async () => (await import("./aula-7-nova/config")).aula7NovaLesson,
  8: async () => (await import("./aula-8-nova/config")).aula8NovaLesson,
  9: async () => (await import("./aula-9-nova/config")).aula9NovaLesson,
  10: async () => (await import("./aula-10-nova/config")).aula10NovaLesson,
  11: async () => (await import("./aula-11-nova/config")).aula11NovaLesson,
  12: async () => (await import("./aula-12-nova/config")).aula12NovaLesson,
  13: async () => (await import("./aula-13-nova/config")).aula13NovaLesson,
  14: async () => (await import("./aula-14-nova/config")).aula14NovaLesson,
  15: async () => (await import("./aula-15-nova/config")).aula15NovaLesson,
  16: async () => (await import("./aula-16-nova/config")).aula16NovaLesson,
  17: async () => (await import("./aula-17-nova/config")).aula17NovaLesson,
  18: async () => (await import("./aula-18-nova/config")).aula18NovaLesson,
  19: async () => (await import("./aula-19-nova/config")).aula19NovaLesson,
  20: async () => (await import("./aula-20-nova/config")).aula20NovaLesson,
  21: async () => (await import("./aula-21-nova/config")).aula21NovaLesson,
  22: async () => (await import("./aula-22/config")).aula22Lesson,
  23: async () => (await import("./aula-23-nova/config")).aula23NovaLesson,
  24: async () => (await import("./aula-24-nova/config")).aula24NovaLesson,
  25: async () => (await import("./aula-25-nova/config")).aula25NovaLesson,
  26: async () => (await import("./aula-26-nova/config")).aula26NovaLesson,
  27: async () => (await import("./aula-27-nova/config")).aula27NovaLesson,
  28: async () => (await import("./aula-28-nova/config")).aula28NovaLesson,
  29: async () => (await import("./aula-29-nova/config")).aula29NovaLesson,
  30: async () => (await import("./aula-30-nova/config")).aula30NovaLesson,
  31: async () => (await import("./aula-31-nova/config")).aula31NovaLesson,
  32: async () => (await import("./aula-32-nova/config")).aula32NovaLesson,
  33: async () => (await import("./aula-33-nova/config")).aula33NovaLesson,
  34: async () => (await import("./aula-34-nova/config")).aula34NovaLesson,
  35: async () => (await import("./aula-35-nova/config")).aula35NovaLesson,
  36: async () => (await import("./aula-36-nova/config")).aula36NovaLesson,
  37: async () => (await import("./aula-37-nova/config")).aula37NovaLesson,
  38: async () => (await import("./aula-38-nova/config")).aula38NovaLesson,
  39: async () => (await import("./aula-39-nova/config")).aula39NovaLesson,
  40: async () => (await import("./aula-40-nova/config")).aula40NovaLesson,
  41: async () => (await import("./aula-41-nova/config")).aula41NovaLesson,
  42: async () => (await import("./aula-42-nova/config")).aula42NovaLesson,
  43: async () => (await import("./aula-43-nova/config")).aula43NovaLesson,
  44: async () => (await import("./aula-44-nova/config")).aula44NovaLesson,
  45: async () => (await import("./aula-45-nova/config")).aula45NovaLesson,
  46: async () => (await import("./aula-46-nova/config")).aula46NovaLesson,
  47: async () => (await import("./aula-47-nova/config")).aula47NovaLesson,
  48: async () => (await import("./aula-48-nova/config")).aula48NovaLesson,
  49: async () => (await import("./aula-49-nova/config")).aula49NovaLesson,
  50: async () => (await import("./aula-50-nova/config")).aula50NovaLesson,
  51: async () => (await import("./aula-51-nova/config")).aula51NovaLesson,
  52: async () => (await import("./aula-52-nova/config")).aula52NovaLesson,
  53: async () => (await import("./aula-53-nova/config")).aula53NovaLesson,
  54: async () => (await import("./aula-54-nova/config")).aula54NovaLesson,
  55: async () => (await import("./aula-55-nova/config")).aula55NovaLesson,
  56: async () => (await import("./aula-56-nova/config")).aula56NovaLesson,
  57: async () => (await import("./aula-57-nova/config")).aula57NovaLesson,
  58: async () => (await import("./aula-58-nova/config")).aula58NovaLesson,
  59: async () => (await import("./aula-59-nova/config")).aula59NovaLesson,
  60: async () => (await import("./aula-60-nova/config")).aula60NovaLesson,
  61: async () => (await import("./aula-61-nova/config")).aula61NovaLesson,
  62: async () => (await import("./aula-62-nova/config")).aula62NovaLesson,
  63: async () => (await import("./aula-63/config")).aula63Lesson,
  64: async () => (await import("./aula-64/config")).aula64Lesson,
  65: async () => (await import("./aula-65/config")).aula65Lesson,
  66: async () => (await import("./aula-66/config")).aula66Lesson,
  67: async () => (await import("./aula-67/config")).aula67Lesson,
  68: async () => (await import("./aula-68/config")).aula68Lesson,
  69: async () => (await import("./aula-69/config")).aula69Lesson,
  70: async () => (await import("./aula-70/config")).aula70Lesson,
  71: async () => (await import("./aula-71/config")).aula71Lesson,
  72: async () => (await import("./aula-72/config")).aula72Lesson,
  73: async () => (await import("./aula-73/config")).aula73Lesson,
  74: async () => (await import("./aula-74/config")).aula74Lesson,
  75: async () => (await import("./aula-75/config")).aula75Lesson,
  76: async () => (await import("./aula-76/config")).aula76Lesson,
  77: async () => (await import("./aula-77/config")).aula77Lesson,
  78: async () => (await import("./aula-78/config")).aula78Lesson,
};

function parseLessonNumberFromSlug(slug: LessonSlug): number | null {
  const match = /^aula-(\d+)-/.exec(slug);
  if (!match) return null;
  const lessonNumber = Number(match[1]);
  if (!Number.isFinite(lessonNumber)) return null;
  return lessonNumber;
}

export async function getLessonBySlug(
  slug: LessonSlug,
): Promise<LessonTemplateDoc | null> {
  const lessonNumber = parseLessonNumberFromSlug(slug);
  if (!lessonNumber) return null;

  const loader = lessonLoadersByNumber[lessonNumber];
  if (!loader) return null;

  const lesson = await loader();
  if (lesson.slug !== slug) return null;
  return lesson;
}
