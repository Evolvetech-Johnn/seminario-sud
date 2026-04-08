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
