export type LessonContentBlock =
  | { type: "intro"; text: string }
  | { type: "context"; text: string }
  | { type: "learning_block"; title: string; content: string; questions: string[] }
  | { type: "activity"; instructions: string }
  | { type: "principle"; text: string }
  | { type: "application"; questions: string[] }
  | { type: "closing"; text: string }
  | { type: "image"; url: string };

export type LessonContent = { blocks: LessonContentBlock[] };

export type LessonDto = {
  id: string;
  lessonNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string | null;
  reference: string | null;
  content: unknown;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LessonListItemDto = {
  id: string;
  lessonNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string | null;
  reference: string | null;
  published: boolean;
};

