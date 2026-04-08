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
};
