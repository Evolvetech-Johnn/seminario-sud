import type { LessonTemplateDoc, LessonSlug } from "@/features/lessons/types";

type LessonLoader = () => Promise<LessonTemplateDoc>;

const lessonLoadersByNumber: Record<number, LessonLoader> = {
  1: async () => (await import("./aula-1/config")).aula1Lesson,
  2: async () => (await import("./aula-2/config")).aula2Lesson,
  3: async () => (await import("./aula-3/config")).aula3Lesson,
  4: async () => (await import("./aula-4/config")).aula4Lesson,
  5: async () => (await import("./aula-5/config")).aula5Lesson,
  6: async () => (await import("./aula-6/config")).aula6Lesson,
  7: async () => (await import("./aula-7/config")).aula7Lesson,
  8: async () => (await import("./aula-8/config")).aula8Lesson,
  9: async () => (await import("./aula-9/config")).aula9Lesson,
  10: async () => (await import("./aula-10/config")).aula10Lesson,
  11: async () => (await import("./aula-11/config")).aula11Lesson,
  12: async () => (await import("./aula-12/config")).aula12Lesson,
  13: async () => (await import("./aula-13/config")).aula13Lesson,
  14: async () => (await import("./aula-14/config")).aula14Lesson,
  15: async () => (await import("./aula-15/config")).aula15Lesson,
  16: async () => (await import("./aula-16/config")).aula16Lesson,
  17: async () => (await import("./aula-17/config")).aula17Lesson,
  18: async () => (await import("./aula-18/config")).aula18Lesson,
  19: async () => (await import("./aula-19/config")).aula19Lesson,
  20: async () => (await import("./aula-20/config")).aula20Lesson,
  21: async () => (await import("./aula-21/config")).aula21Lesson,
  22: async () => (await import("./aula-22/config")).aula22Lesson,
  23: async () => (await import("./aula-23/config")).aula23Lesson,
  24: async () => (await import("./aula-24/config")).aula24Lesson,
  25: async () => (await import("./aula-25/config")).aula25Lesson,
  26: async () => (await import("./aula-26/config")).aula26Lesson,
  27: async () => (await import("./aula-27/config")).aula27Lesson,
  28: async () => (await import("./aula-28/config")).aula28Lesson,
  29: async () => (await import("./aula-29/config")).aula29Lesson,
  30: async () => (await import("./aula-30/config")).aula30Lesson,
  31: async () => (await import("./aula-31/config")).aula31Lesson,
  32: async () => (await import("./aula-32/config")).aula32Lesson,
  33: async () => (await import("./aula-33/config")).aula33Lesson,
  34: async () => (await import("./aula-34/config")).aula34Lesson,
  35: async () => (await import("./aula-35/config")).aula35Lesson,
  36: async () => (await import("./aula-36/config")).aula36Lesson,
  37: async () => (await import("./aula-37/config")).aula37Lesson,
  38: async () => (await import("./aula-38/config")).aula38Lesson,
  39: async () => (await import("./aula-39/config")).aula39Lesson,
  40: async () => (await import("./aula-40/config")).aula40Lesson,
  41: async () => (await import("./aula-41/config")).aula41Lesson,
  42: async () => (await import("./aula-42/config")).aula42Lesson,
  43: async () => (await import("./aula-43/config")).aula43Lesson,
  44: async () => (await import("./aula-44/config")).aula44Lesson,
  45: async () => (await import("./aula-45/config")).aula45Lesson,
  46: async () => (await import("./aula-46/config")).aula46Lesson,
  47: async () => (await import("./aula-47/config")).aula47Lesson,
  48: async () => (await import("./aula-48/config")).aula48Lesson,
  49: async () => (await import("./aula-49/config")).aula49Lesson,
  50: async () => (await import("./aula-50/config")).aula50Lesson,
  51: async () => (await import("./aula-51/config")).aula51Lesson,
  52: async () => (await import("./aula-52/config")).aula52Lesson,
  53: async () => (await import("./aula-53/config")).aula53Lesson,
  54: async () => (await import("./aula-54/config")).aula54Lesson,
  55: async () => (await import("./aula-55/config")).aula55Lesson,
  56: async () => (await import("./aula-56/config")).aula56Lesson,
  57: async () => (await import("./aula-57/config")).aula57Lesson,
  58: async () => (await import("./aula-58/config")).aula58Lesson,
  59: async () => (await import("./aula-59/config")).aula59Lesson,
  60: async () => (await import("./aula-60/config")).aula60Lesson,
  61: async () => (await import("./aula-61/config")).aula61Lesson,
  62: async () => (await import("./aula-62/config")).aula62Lesson,
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
