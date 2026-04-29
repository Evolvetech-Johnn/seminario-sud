import Link from "next/link";

export const metadata = {
  title: "Guia do Aluno | Seminário SUD",
};

export default function GuiaAlunoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-xs font-extrabold uppercase tracking-wide text-sud-navy">Seminário SUD</div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Guia do aluno</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Este guia explica como entrar no sistema como aluno, responder as aulas e registrar presença.
        </p>

        <div className="mt-7 grid gap-6">
          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">1) Entrar como aluno</h2>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>
                Abra a tela de login do aluno: <span className="font-bold">/login</span>.
              </li>
              <li>
                Digite o <span className="font-bold">Usuário</span> e a <span className="font-bold">Senha</span>
                fornecidos pelo professor.
              </li>
              <li>Clique em “Entrar”.</li>
            </ol>
            <div className="mt-2 text-sm font-semibold text-slate-700">
              Importante: use sempre o mesmo usuário e senha criados no sistema.
            </div>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">2) Responder a aula</h2>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Abra a aula do dia pelo botão “Aula de hoje” ou pelo “Sumário”.</li>
              <li>Preencha os campos de resposta da lição.</li>
              <li>O sistema salva automaticamente enquanto você digita.</li>
            </ol>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">3) Registrar presença</h2>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Peça ao professor o seu código individual de presença.</li>
              <li>
                Abra a chamada em <span className="font-bold">/student/attendance</span>.
              </li>
              <li>Digite o código e confirme a presença.</li>
            </ol>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
          >
            Entrar
          </Link>
          <Link
            href="/student/attendance"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Presença
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}

