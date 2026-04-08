import type { LessonConfig } from "@/features/lessons/types";

export const exodo1213Lesson: LessonConfig = {
  slug: "exodo-12-13",
  title: "Memória Sagrada",
  theme: "Êxodo 12–13 (Páscoa e Sacramento)",
  hero: {
    quote: "Fazei isto em memória de mim",
    subtext:
      "A memória espiritual não é nostalgia: é um convênio renovado com propósito, repetição e reverência.",
    image: {
      src: "/images/exodo-12-13/hero-ultima-ceia.svg",
      alt: "A Última Ceia (ilustração conceitual)",
    },
  },
  icebreaker: {
    question: "O que você nunca gostaria de esquecer?",
    cta: "Refletir",
    placeholder:
      "Escreva algo simples: uma pessoa, um momento, uma promessa, um sentimento…",
  },
  passover: {
    title: "Páscoa (Êxodo 12–13)",
    subtitle:
      "A Páscoa ensinou Israel a lembrar por meio de sinais e repetição. Em Cristo, o símbolo encontra seu cumprimento.",
    image: {
      src: "/images/exodo-12-13/pascoa-exodo.svg",
      alt: "Páscoa em Êxodo (ilustração conceitual)",
    },
    cards: [
      {
        key: "lamb",
        title: "Cordeiro → Cristo",
        description:
          "O cordeiro perfeito aponta para Jesus Cristo, o Cordeiro de Deus. Ele é o centro da libertação.",
        icon: "lamb",
      },
      {
        key: "blood",
        title: "Sangue → Proteção",
        description:
          "O sinal no umbral ensinou que a salvação vem por meio do convênio e da obediência ao que Deus revela.",
        icon: "shield",
      },
      {
        key: "memory",
        title: "Memória → Repetição",
        description:
          "Deus pede que o povo lembre repetidamente. A repetição reverente forma identidade espiritual.",
        icon: "repeat",
      },
    ],
  },
  sacrament: {
    title: "Sacramento",
    subtitle:
      "O sacramento renova convênios e treina nossa mente a lembrar de Cristo de forma intencional, toda semana.",
    image: {
      src: "/images/exodo-12-13/sacramento.svg",
      alt: "Sacramento (ilustração conceitual)",
    },
    cards: [
      {
        key: "bread",
        title: "Pão → Corpo",
        description:
          "Ao tomarmos o pão, lembramos do corpo de Cristo e do preço de Sua expiação com gratidão.",
        icon: "bread",
      },
      {
        key: "water",
        title: "Água → Sangue",
        description:
          "A água simboliza o sangue derramado. O convite é voltar a Ele e ser purificado de novo.",
        icon: "water",
      },
      {
        key: "covenant",
        title: "Convênio → Lembrar sempre",
        description:
          "O convênio não é automático. Ele se fortalece quando escolhemos lembrar de Cristo em pensamentos e ações.",
        icon: "covenant",
      },
    ],
  },
  discussion: {
    title: "Discussão (mesa redonda)",
    subtitle:
      "Respostas sinceras ajudam a identificar o que nos afasta e o que nos aproxima de Cristo.",
    questions: [
      "Você realmente lembra de Cristo no sacramento?",
      "O que te distrai?",
    ],
  },
  actionPlan: {
    title: "Plano de ação",
    subtitle:
      "Pequenas escolhas antes, durante e depois do sacramento criam um padrão de memória sagrada ao longo do tempo.",
    fields: [
      {
        key: "before",
        label: "Antes",
        placeholder: "O que você pode fazer antes para chegar mais preparado(a)?",
      },
      {
        key: "during",
        label: "Durante",
        placeholder: "Como você vai se concentrar para lembrar de Cristo de verdade?",
      },
      {
        key: "after",
        label: "Depois",
        placeholder: "Que ação concreta você pode fazer para honrar seu convênio?",
      },
    ],
    cta: "Salvar compromisso",
  },
  referenceMaterial: {
    title:
      "Êxodo 12–13, parte 2: “Fazei isto em memória de mim” (Material do Professor do Seminário, 2026)",
    sourceUrl:
      "https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/14-exodus-7-13/143-exodus-12-13-part-2?lang=por",
    sections: [
      {
        title: "Ideia central",
        bullets: [
          "A Páscoa foi instituída para ajudar Israel a lembrar da libertação do Egito.",
          "O sacramento é uma ordenança dada por Jesus Cristo para nos ajudar a lembrar Dele sempre.",
          "Memória espiritual é um convênio renovado com propósito e repetição.",
        ],
      },
      {
        title: "Atividade sugerida (quebra de gelo)",
        bullets: [
          "Mostre um objeto/imagem que te ajude a lembrar de algo importante e peça aos alunos que expliquem o deles.",
          "Perguntas possíveis: “O que ou quem você gostaria de lembrar pelo resto da vida?” e “O que você faz para se lembrar?”",
          "Convite: olhar para uma imagem do Salvador em espírito de oração e registrar sentimentos e motivos para lembrar Dele.",
        ],
      },
      {
        title: "Princípio de doutrina",
        bullets: [
          "Ordenanças como a Páscoa (no passado) e o sacramento (hoje) existem para nos ajudar a lembrar do Pai Celestial e de Jesus Cristo.",
          "Quando escolhemos lembrar, nossa perspectiva muda e a adoração fica mais intencional.",
        ],
      },
    ],
    scriptureStudy: {
      title: "Estudo em trio (Páscoa como memória)",
      passages: ["Êxodo 12:14, 17", "Êxodo 12:25–27", "Êxodo 13:3, 8–10"],
      prompts: [
        "Identifique palavras/frases que mostrem repetição, lembrança e convênio.",
        "O que era preparado e partilhado na ceia para ajudar a lembrar do Senhor?",
        "Como o Senhor pode ter abençoado Israel por guardar essa festa com obediência?",
      ],
    },
    sacramentStudy: {
      passages: ["Lucas 22:13–15, 19–20"],
      prompts: [
        "Qual ordenança o Salvador instituiu naquela ocasião?",
        "Como o sacramento é semelhante à Páscoa? Em que aspectos é diferente?",
        "Que atitudes ajudam você a lembrar de Cristo antes, durante e depois do sacramento?",
      ],
    },
  },
};
