import type { LessonConfig } from "@/features/lessons/types";

export const exodo2011Lesson: LessonConfig = {
  slug: "exodo-20-1-11",
  title: "Deus em Primeiro Lugar",
  theme: "Êxodo 20:1–11 (Os Dez Mandamentos — amar a Deus acima de tudo)",
  hero: {
    quote: "Não terás outros deuses diante de mim",
    subtext:
      "Depois da libertação do Egito, o Senhor convida Israel a fazer convênio e revela mandamentos que ensinam a amar e honrar a Deus acima de qualquer outra coisa.",
    image: {
      src: "/images/exodo-12-13/memoria%20sagrada.png",
      alt: "Mandamentos e convênio",
    },
  },
  icebreaker: {
    question: "O que mais compete por ‘primeiro lugar’ na sua vida hoje?",
    cta: "Refletir",
    placeholder:
      "Ex: estudos, trabalho, amizades, redes sociais, hobbies, preocupações…",
  },
  passover: {
    title: "O grande mandamento e os 4 primeiros (Êxodo 20:1–11)",
    subtitle:
      "Os primeiros mandamentos ensinam a amar a Deus e colocá-Lo em primeiro lugar — não só por regras, mas por relacionamento e lealdade.",
    image: {
      src: "/images/exodo-12-13/ultima%20ceia.png",
      alt: "Amar a Deus acima de tudo",
    },
    cards: [
      {
        key: "no-other-gods",
        title: "Deus acima de tudo",
        description:
          "O Senhor pede exclusividade: nada deve ocupar o lugar que pertence a Ele.",
        icon: "covenant",
      },
      {
        key: "no-idols",
        title: "Cuidado com ídolos",
        description:
          "Ídolos hoje podem ser qualquer coisa que passa a dirigir decisões, identidade e tempo mais do que Deus.",
        icon: "shield",
      },
      {
        key: "name",
        title: "Honrar Seu nome",
        description:
          "Falar e agir com reverência. O nome de Deus também é honrado pelas escolhas que fazemos.",
        icon: "repeat",
      },
    ],
  },
  sacrament: {
    title: "Santificar o sábado (Êxodo 20:8–11)",
    subtitle:
      "O sábado é um treino semanal de prioridade: parar, adorar, lembrar e colocar Deus no centro.",
    image: {
      src: "/images/exodo-12-13/sacramento.png",
      alt: "Adoração e reverência",
    },
    cards: [
      {
        key: "rest",
        title: "Descanso com propósito",
        description:
          "Descanso não é apenas parar — é voltar o coração para Deus e renovar forças espirituais.",
        icon: "water",
      },
      {
        key: "worship",
        title: "Adoração intencional",
        description:
          "O sábado convida a adoração (sacramentos, escrituras, família, serviço) e protege o que é mais importante.",
        icon: "bread",
      },
      {
        key: "first",
        title: "Deus em primeiro lugar",
        description:
          "Quando o Senhor vem primeiro, outras áreas se organizam melhor. Prioridade gera paz.",
        icon: "covenant",
      },
    ],
  },
  discussion: {
    title: "Discussão (mesa redonda)",
    subtitle:
      "Converse sobre como escolhas práticas mostram quem está em primeiro lugar na vida.",
    questions: [
      "O que significa ‘colocar Deus em primeiro lugar’ na prática?",
      "Que ‘ídolos modernos’ competem mais com Deus na sua rotina?",
      "Como o sábado pode te ajudar a reorganizar prioridades?",
    ],
  },
  actionPlan: {
    title: "Plano de ação (o número 1)",
    subtitle:
      "Escolha uma decisão pequena e real para colocar Deus em primeiro lugar nesta semana.",
    fields: [
      {
        key: "before",
        label: "1) Escolha",
        placeholder: "O que você vai fazer para colocar Deus em primeiro lugar?",
      },
      {
        key: "during",
        label: "2) Obstáculo",
        placeholder: "Qual desafio pode aparecer? Como você vai vencê-lo?",
      },
      {
        key: "after",
        label: "3) Bênção",
        placeholder: "Como o Senhor pode te abençoar por essa escolha?",
      },
    ],
    cta: "Salvar compromisso",
  },
  referenceMaterial: {
    title:
      "Êxodo 20:1–11 — Os Dez Mandamentos: amar a Deus e colocá-Lo em primeiro lugar (Manual do Professor do Seminário, 2026)",
    sourceUrl:
      "https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/16-exodus-19-20-24-31-34/162-exodus-20-1-11?lang=por",
    sections: [
      {
        title: "Ideia central",
        bullets: [
          "O Senhor revelou mandamentos para ajudar Seu povo a amá-Lo e honrá-Lo acima de tudo.",
          "Os quatro primeiros mandamentos focam em amar a Deus e colocá-Lo em primeiro lugar.",
          "O sábado pode fortalecer a prioridade espiritual e a adoração intencional.",
        ],
      },
      {
        title: "Abertura (grande mandamento)",
        bullets: [
          "Leia Mateus 22:37–39 e conecte com Êxodo 20:1–11.",
          "Pergunte: como esses mandamentos ajudam a amar a Deus mais do que qualquer outra coisa?",
        ],
      },
      {
        title: "Aplicação",
        bullets: [
          "Convide os alunos a refletir sobre o que compete por ‘primeiro lugar’ na vida.",
          "Peça que escolham uma ação concreta para colocar Deus em primeiro lugar nesta semana.",
        ],
      },
    ],
    scriptureStudy: {
      title: "Estudo sugerido (amar a Deus primeiro)",
      passages: ["Mateus 22:37–39", "Êxodo 20:1–11"],
      prompts: [
        "Quais são os quatro primeiros mandamentos em Êxodo 20:1–11?",
        "Que semelhanças existem entre esses mandamentos e Mateus 22:37–38?",
        "O que significa, de forma prática, colocar Deus em primeiro lugar na sua vida?",
      ],
    },
  },
};

