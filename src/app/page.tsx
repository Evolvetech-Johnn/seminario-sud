import { redirect } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/seminario/AppHeader";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sud-navy via-white to-white" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Seminário SUD
            </h1>
            <p className="mt-4 text-lg text-white/90 sm:text-xl">
              Selecione sua ala para acessar as aulas e atividades
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/login?next=/ala/ala1"
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20 hover:shadow-2xl"
            >
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white">Ala 1</div>
                <div className="mt-2 text-sm text-white/80">
                  Turmas A, B, C
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Clique para fazer login
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition group-hover:bg-white/20" />
            </Link>

            <Link
              href="/login?next=/ala/ala2"
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20 hover:shadow-2xl"
            >
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white">Ala 2</div>
                <div className="mt-2 text-sm text-white/80">
                  Turmas D, E, F
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Clique para fazer login
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition group-hover:bg-white/20" />
            </Link>

            <Link
              href="/login?next=/ala/ala3"
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20 hover:shadow-2xl sm:col-span-2 lg:col-span-1"
            >
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white">Ala 3</div>
                <div className="mt-2 text-sm text-white/80">
                  Turmas G, H, I
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Clique para fazer login
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition group-hover:bg-white/20" />
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/professor/login"
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/60 backdrop-blur transition hover:bg-white"
            >
              Área do Professor
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
