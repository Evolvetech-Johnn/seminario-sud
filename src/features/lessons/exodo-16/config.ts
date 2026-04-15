import type { LessonConfig } from "@/features/lessons/types";

export const exodo16Lesson: LessonConfig = {
  slug: "exodo-16",
  title: "O Pão de Cada Dia",
  theme: "Êxodo 16 (Maná e confiar no Senhor diariamente)",
  hero: {
    quote: "Eu sou o pão da vida",
    subtext:
      "O Senhor ensina Seu povo a confiar Nele um dia de cada vez. Assim como o maná sustentou Israel no deserto, Jesus Cristo sustenta nossa vida espiritual diariamente.",
    image: {
      src: "/images/exodo-16/mana%20caiu%20do%20ceu.png",
      alt: "O pão de cada dia",
    },
  },
  icebreaker: {
    question: "O que seu corpo precisa todos os dias para funcionar bem?",
    cta: "Refletir",
    placeholder:
      "Ex: comida, água, descanso… Agora pense: o que seu espírito precisa diariamente?",
  },
  passover: {
    title: "Maná (Êxodo 16)",
    subtitle:
      "O maná ensinou Israel a depender do Senhor diariamente, com obediência e gratidão.",
    image: {
      src: "/images/exodo-12-13/pacoa%20de%20exodo.png",
      alt: "Pão no deserto (ilustração)",
    },
    cards: [
      {
        key: "daily",
        title: "Provisão diária",
        description:
          "O Senhor supriu o necessário para cada dia. A confiança é construída pela constância, não pela pressa.",
        icon: "bread",
      },
      {
        key: "gather",
        title: "Recolher e agir",
        description:
          "O milagre vinha do Senhor, mas o povo ainda precisava levantar, recolher e seguir instruções simples.",
        icon: "repeat",
      },
      {
        key: "sabbath",
        title: "Sábado e reverência",
        description:
          "A provisão incluía descanso e adoração. O Senhor ensina que a vida espiritual tem ritmo e prioridade.",
        icon: "covenant",
      },
    ],
  },
  sacrament: {
    title: "Cristo, o Pão da Vida (João 6)",
    subtitle:
      "Jesus Cristo é a fonte de nutrição espiritual real. Quando voltamos a Ele diariamente, recebemos força, direção e paz.",
    image: {
      src: "/images/exodo-12-13/ultima%20ceia.png",
      alt: "Cristo e o pão",
    },
    cards: [
      {
        key: "christ",
        title: "Pão do céu → Cristo",
        description:
          "O maná apontava para algo maior. Cristo oferece vida eterna e alimento espiritual que permanece.",
        icon: "bread",
      },
      {
        key: "need",
        title: "Fome espiritual é real",
        description:
          "Assim como a fome e a sede nos lembram do corpo, a alma também precisa de cuidado diário e intencional.",
        icon: "water",
      },
      {
        key: "trust",
        title: "Confiar um dia de cada vez",
        description:
          "A fé cresce quando escolhemos receber o que o Senhor dá hoje e seguimos com esperança pelo amanhã.",
        icon: "shield",
      },
    ],
  },
  discussion: {
    title: "Discussão (mesa redonda)",
    subtitle:
      "Conversas sinceras ajudam a perceber o que nos alimenta espiritualmente e o que nos distrai.",
    questions: [
      "Por que é fácil ignorar nossas necessidades espirituais?",
      "O que pode te ajudar a confiar mais no Senhor diariamente?",
      "Que padrão de “maná” (constância) você quer construir nesta semana?",
    ],
  },
  actionPlan: {
    title: "Plano de ação (nutrição diária)",
    subtitle:
      "Escolha atitudes pequenas e reais para receber nutrição espiritual do Senhor todos os dias.",
    fields: [
      {
        key: "before",
        label: "Manhã",
        placeholder: "Qual é um hábito simples para começar seu dia com o Senhor?",
      },
      {
        key: "during",
        label: "Durante o dia",
        placeholder:
          "Como você pode lembrar de Cristo em meio às tarefas, escola e família?",
      },
      {
        key: "after",
        label: "Noite",
        placeholder:
          "O que você pode fazer antes de dormir para agradecer e ajustar o coração?",
      },
    ],
    cta: "Salvar compromisso",
  },
  referenceMaterial: {
    title: "Êxodo 16: O pão de cada dia (Manual do Professor do Seminário, 2026)",
    sourceUrl:
      "https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/15-exodus-14-18/153-exodus-16?lang=por",
    sections: [
      {
        title: "Objetivo da lição",
        bullets: [
          "Ajudar os alunos a confiar no Senhor diariamente.",
          "Relacionar a nutrição física diária à necessidade de nutrição espiritual diária.",
        ],
      },
      {
        title: "Ideias de abertura",
        bullets: [
          "Converse sobre necessidades diárias (comida, água, descanso).",
          "Pergunte por que é fácil esquecer necessidades espirituais.",
          "Convide os alunos a identificar algo que podem fazer todos os dias para cuidar do espírito.",
        ],
      },
      {
        title: "Maná e aplicação",
        bullets: [
          "Identifique como o Senhor supriu as necessidades de Israel em Êxodo 16.",
          "Compare o maná com Cristo como o Pão da Vida (João 6).",
          "Destaque a verdade: ao confiar no Senhor diariamente, recebemos a nutrição espiritual de que precisamos.",
        ],
      },
    ],
    scriptureStudy: {
      title: "Estudo sugerido (maná e Cristo)",
      passages: ["Êxodo 16:2–4, 11–15", "Êxodo 16:14–31, 35", "João 6:31–35, 47–51"],
      prompts: [
        "Como o Senhor supriu as necessidades do povo? O que Ele pediu que eles fizessem?",
        "Que detalhes sobre o maná ensinam princípios de constância e fé?",
        "De que maneira o maná é semelhante a Jesus Cristo? O que Cristo oferece que é maior?",
        "Como você pode receber nutrição espiritual do Senhor todos os dias?",
      ],
    },
  },
};

