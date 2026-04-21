import type { LessonConfig } from "@/features/lessons/types";

export const fazerComparacoesLesson: LessonConfig = {
  slug: "fazer-comparacoes",
  title: "Fazer Comparações",
  theme: "Habilidade de estudo: comparar para identificar verdades preciosas",
  hero: {
    quote: "Verdades “claras e sumamente preciosas”",
    subtext:
      "Comparar histórias, ideias e pessoas nas escrituras ajuda a perceber verdades implícitas e tornar o estudo mais significativo. Nesta aula, você vai praticar comparações para aprender sobre Jesus Cristo e aplicar hoje.",
    image: {
      src: "/images/exodo-12-13/memoria%20sagrada.png",
      alt: "Estudo das escrituras",
    },
  },
  icebreaker: {
    question: "Se você comparar açúcar e sal, o que você aprende melhor sobre eles?",
    cta: "Refletir",
    placeholder:
      "Liste 2 semelhanças e 2 diferenças. Depois, escreva como comparar ajuda a entender melhor.",
  },
  passover: {
    title: "Definir: o que é fazer comparações?",
    subtitle:
      "Fazer comparações é notar semelhanças e diferenças para identificar verdades que talvez não veríamos de outra forma.",
    image: {
      src: "/images/exodo-12-13/ultima%20ceia.png",
      alt: "Comparar para compreender",
    },
    cards: [
      {
        key: "similarities",
        title: "Semelhanças",
        description:
          "O que é parecido entre histórias, ideias ou pessoas? Isso destaca padrões e princípios.",
        icon: "repeat",
      },
      {
        key: "differences",
        title: "Diferenças",
        description:
          "O que é diferente? Contrastes costumam revelar motivação, escolhas e consequências.",
        icon: "shield",
      },
      {
        key: "truths",
        title: "Verdades implícitas",
        description:
          "Comparações ajudam a encontrar verdades preciosas sobre Jesus Cristo e sobre como viver hoje.",
        icon: "covenant",
      },
    ],
  },
  sacrament: {
    title: "Exemplificar: Jesus Cristo e Satanás (Moisés 4:1–2)",
    subtitle:
      "Um exemplo poderoso é comparar como Jesus Cristo e Satanás responderam ao Pai Celestial. Pergunte: o que isso ensina sobre caráter, humildade e amor a Deus?",
    image: {
      src: "/images/exodo-12-13/sacramento.png",
      alt: "Escolhas e consequência",
    },
    cards: [
      {
        key: "questions",
        title: "Perguntas-guia",
        description:
          "Semelhanças? Diferenças? O que aprendo? Como isso me ajuda hoje? Como me ajuda a seguir mais o Senhor?",
        icon: "bread",
      },
      {
        key: "christ",
        title: "Cristo: vontade do Pai",
        description:
          "Jesus Cristo busca humildemente cumprir a vontade do Pai e trazer salvação aos filhos de Deus.",
        icon: "water",
      },
      {
        key: "adversary",
        title: "Satanás: glória própria",
        description:
          "Satanás busca honra e glória para si, se rebela e tenta desviar corações do plano do Pai.",
        icon: "shield",
      },
    ],
  },
  discussion: {
    title: "Discussão (mesa redonda)",
    subtitle:
      "Use comparações para tornar o estudo mais claro e aplicar princípios reais na vida.",
    questions: [
      "Qual comparação nas escrituras já te ajudou a entender melhor um princípio?",
      "O que muda no seu estudo quando você procura semelhanças e diferenças?",
      "Que verdade sobre Jesus Cristo você identificou ao comparar Cristo e Satanás?",
    ],
  },
  actionPlan: {
    title: "Praticar (seu plano de comparação)",
    subtitle:
      "Escolha uma comparação para fazer nesta semana e registre a verdade que você quer levar para a vida.",
    fields: [
      {
        key: "before",
        label: "Comparação",
        placeholder:
          "Quais duas histórias/ideias/pessoas você vai comparar? (ex: Moisés 7 vs. Moisés 8, Abraão vs. Ló...)",
      },
      {
        key: "during",
        label: "Verdade encontrada",
        placeholder: "Que verdade implícita você identificou com essa comparação?",
      },
      {
        key: "after",
        label: "Aplicação",
        placeholder: "Como isso vai te ajudar hoje a amar/seguir mais o Senhor?",
      },
    ],
    cta: "Salvar compromisso",
  },
  referenceMaterial: {
    title:
      "Fazer comparações: estabelecer comparações para identificar verdades implícitas (Manual do Professor do Seminário, 2026)",
    sourceUrl:
      "https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/62-scripture-study-skills/625-making-comparisons-to-identify-truths?lang=por",
    sections: [
      {
        title: "Ideia central",
        bullets: [
          "As escrituras contêm verdades “claras e sumamente preciosas”.",
          "Comparar histórias, ideias e pessoas ajuda a identificar verdades implícitas.",
          "Perguntas-guia: semelhanças/diferenças, o que aprendo, como aplicar, como seguir mais o Senhor.",
        ],
      },
      {
        title: "Atividade de abertura",
        bullets: [
          "Comparar açúcar e sal (ou doce e amargo) para perceber semelhanças e diferenças.",
          "Conectar: comparações nas escrituras ajudam a entender e apreciar ensinamentos do Salvador.",
        ],
      },
      {
        title: "Exemplo sugerido",
        bullets: [
          "Comparar as respostas de Jesus Cristo e Satanás (Moisés 4:1–2).",
          "Identificar verdades como: Cristo busca cumprir a vontade do Pai; Satanás busca glória própria.",
        ],
      },
    ],
    scriptureStudy: {
      title: "Estudo sugerido (comparação guiada)",
      passages: ["1 Néfi 13:26", "Moisés 4:1–2"],
      prompts: [
        "Quais semelhanças e diferenças você vê entre Jesus Cristo e Satanás nesse relato?",
        "Que verdade implícita você aprende com essa comparação?",
        "Como o que você aprendeu pode te ajudar hoje?",
        "Como isso pode te ajudar a amar e seguir mais o Senhor?",
      ],
    },
  },
};

