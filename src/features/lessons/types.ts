export type LessonSlug = string;

export type LessonCard = {
  key: string;
  title: string;
  description: string;
  icon: "lamb" | "shield" | "repeat" | "bread" | "water" | "covenant";
  image?: {
    src: string;
    alt: string;
  };
};

export type LessonConfig = {
  slug: LessonSlug;
  title: string;
  theme: string;
  scheduledAt?: string;
  hero: {
    quote: string;
    subtext: string;
    image: {
      src: string;
      alt: string;
    };
  };
  icebreaker: {
    question: string;
    cta: string;
    placeholder: string;
  };
  passover: {
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    cards: LessonCard[];
  };
  sacrament: {
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    cards: LessonCard[];
  };
  discussion: {
    title: string;
    subtitle: string;
    questions: string[];
  };
  actionPlan: {
    title: string;
    subtitle: string;
    fields: Array<{
      key: "before" | "during" | "after";
      label: string;
      placeholder: string;
    }>;
    cta: string;
  };
  referenceMaterial?: {
    title: string;
    sourceUrl: string;
    sections: Array<{
      title: string;
      bullets: string[];
    }>;
    scriptureStudy?: {
      title: string;
      passages: string[];
      prompts: string[];
    };
    sacramentStudy?: {
      passages: string[];
      prompts: string[];
    };
  };
};

export type LessonDocSection =
  | {
      id: string;
      type: "metadata";
      title: string;
      items: {
        numeroDaAula: number;
        dataFormatada: string;
        referenciaDoCalendario: string;
        tema: string;
      };
    }
  | {
      id: string;
      type: "hero";
      title: string;
      headline: string;
      subheadline: string;
      imageSuggestion: { alt: string; keywords: string[] };
    }
  | {
      id: string;
      type: "icebreaker";
      title: string;
      prompt: string;
      studentResponse: { type: "text"; placeholder: string };
    }
  | {
      id: string;
      type: "scripture-context";
      title: string;
      summary: string;
      suggestedPassages?: string[];
      microInsight?: string;
    }
  | {
      id: string;
      type: "doctrine";
      title: string;
      principles: string[];
      connectionToChrist: string;
    }
  | {
      id: string;
      type: "discussion";
      title: string;
      instructions?: string;
      questions: string[];
    }
  | {
      id: string;
      type: "reflection";
      title: string;
      prompt: string;
      studentResponse: { type: "text"; placeholder: string };
    }
  | {
      id: string;
      type: "action-plan";
      title: string;
      before: { title: string; items: string[] };
      during: { title: string; items: string[] };
      after: { title: string; items: string[] };
    }
  | { id: string; type: "cta"; title: string; text: string };

export type LessonDoc = {
  id: string;
  title: string;
  slug: LessonSlug;
  date: string;
  day: string;
  theme: string;
  sections: LessonDocSection[];
  referenceMaterial?: LessonConfig["referenceMaterial"];
};

export type LessonTemplateSection =
  | {
      type: "intro";
      content: string;
    }
  | {
      type: "context";
      content: string;
    }
  | {
      type: "learning_block";
      content: string;
      questions: string[];
    }
  | {
      type: "activity";
      instructions: string;
    }
  | {
      type: "principle";
      content: string;
    }
  | {
      type: "application";
      questions: string[];
    }
  | {
      type: "closing";
      content: string;
    };

export type LessonTemplateDoc = {
  slug: LessonSlug;
  title: string;
  subtitle: string;
  date?: string;
  day?: "ter" | "qua" | "qui" | "sex";
  reference?: string;
  sourceUrl?: string;
  sections: LessonTemplateSection[];
};
