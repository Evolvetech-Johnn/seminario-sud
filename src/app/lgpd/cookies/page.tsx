import Link from "next/link";

export const metadata = {
  title: "Política de Cookies | Seminário SUD",
};

export default function CookiesPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Política de Cookies</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Cookies são pequenos arquivos armazenados no seu navegador. Eles ajudam a manter o sistema
          funcionando corretamente e, quando autorizado, podem apoiar métricas e melhorias.
        </p>

        <div className="mt-6 grid gap-5">
          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">Cookies essenciais</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Necessários para autenticação e segurança. Sem eles, áreas de aluno/professor podem não
              funcionar.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">Cookies não essenciais</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Usados para métricas (ex.: analytics) e melhoria de experiência. Só devem ser ativados
              após sua aceitação.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">Preferências</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Você pode aceitar ou rejeitar cookies não essenciais. A qualquer momento, você pode
              revisar suas preferências limpando os cookies do navegador ou usando o botão de
              preferências quando disponível.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/lgpd"
            className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
          >
            Voltar para LGPD
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Ir para o site
          </Link>
        </div>
      </div>
    </main>
  );
}

