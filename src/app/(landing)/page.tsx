import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import LeadForm from "@/components/landing/LeadForm";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <Building2 className="size-4" />
            Terrax Construcción
          </span>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Controla tus proyectos de construcción con un sistema minimalista y potente
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Centraliza avances, personal, materiales y el cuaderno de obra en un flujo simple.
            Diseñado para jefes de obra, residentes y oficinas técnicas.
          </p>

          <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-neutral-900">Web corporativa existente</h2>
            <p className="mt-1 text-neutral-600">
              Si desea tener más información, ingrese al sitio web oficial presionando el botón.
            </p>
            <Link
              href="https://terrax.pe/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800"
            >
              Ir a la web principal
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <Link
            href="/auth/login"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
          >
            Acceder al CRM
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <LeadForm />
      </section>
    </main>
  );
}

