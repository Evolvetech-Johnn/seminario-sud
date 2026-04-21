import Image from "next/image";

import { getAulaBySlug } from "@/modules/aulas/aulas.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AulaPage({ params }: Props) {
  const { slug } = await params;
  const aula = await getAulaBySlug(slug);

  if (!aula) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Aula não encontrada
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {aula.title}
      </h1>
      <p className="mt-2 text-slate-600">{aula.description}</p>
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <Image
          src={aula.image}
          alt={aula.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
    </div>
  );
}

