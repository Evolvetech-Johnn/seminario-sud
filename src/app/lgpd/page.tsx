import Link from "next/link";

export const metadata = {
  title: "LGPD e Privacidade | Seminário SUD",
};

export default function LgpdPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">LGPD, Privacidade e Cookies</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Este sistema foi criado para apoiar as aulas do Seminário SUD. Abaixo estão as diretrizes de
          privacidade e uso de cookies aplicadas ao site.
        </p>

        <div className="mt-6 grid gap-5">
          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">1) Dados coletados</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Dados de identificação e contato: nome e, quando informado, email.</li>
              <li>Dados de uso: respostas das lições e presença (quando aplicável).</li>
              <li>Dados técnicos essenciais: cookies necessários para autenticação e navegação.</li>
            </ul>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">2) Finalidade</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Viabilizar login e acesso às áreas de aluno/professor.</li>
              <li>Registrar respostas e acompanhar progresso das lições.</li>
              <li>Gerar e confirmar presença, quando utilizada a chamada.</li>
            </ul>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">3) Base legal</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              O tratamento ocorre para execução das funcionalidades do sistema e para atender interesses
              legítimos ligados à organização das aulas, sempre respeitando os direitos do titular.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">4) Cookies</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Usamos cookies essenciais para manter sessões e autenticação. Cookies não essenciais (por
              exemplo, analytics) só devem ser ativados com seu consentimento.
            </p>
            <div className="text-sm font-semibold">
              <Link href="/lgpd/cookies" className="text-sud-navy underline">
                Ver política de cookies
              </Link>
            </div>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">5) Seus direitos</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Confirmar a existência de tratamento e acessar seus dados.</li>
              <li>Solicitar correção, anonimização, bloqueio ou eliminação, quando aplicável.</li>
              <li>Revogar consentimentos e pedir informações sobre compartilhamento.</li>
            </ul>
          </section>

          <section className="grid gap-2">
            <h2 className="text-base font-bold text-slate-900">6) Contato</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Para solicitações relacionadas à privacidade, entre em contato com a administração do
              Seminário SUD.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-sud-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-sud-navy/90"
          >
            Voltar
          </Link>
          <Link
            href="/lgpd/cookies"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Cookies
          </Link>
        </div>
      </div>
    </main>
  );
}

