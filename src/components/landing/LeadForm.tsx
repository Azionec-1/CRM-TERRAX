"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  serviceType: "CONSTRUCTION" | "VIRTUAL_CLASSROOM";
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  serviceType: "CONSTRUCTION",
};

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el formulario.");
      }

      setSuccess("Gracias. Hemos recibido tu consulta.");
      setForm(initialState);
    } catch {
      setError("Error al enviar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-1 text-2xl font-semibold text-neutral-900">Solicita información</h2>
      <p className="mb-5 text-sm text-neutral-600">
        Completa el formulario para que el equipo comercial te contacte.
      </p>

      <div className="space-y-4">
        <input
          required
          placeholder="Nombre completo"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        />
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        />
        <input
          placeholder="Empresa"
          value={form.company}
          onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        />
        <select
          value={form.serviceType}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              serviceType: event.target.value as "CONSTRUCTION" | "VIRTUAL_CLASSROOM",
            }))
          }
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        >
          <option value="CONSTRUCTION">Servicios de construcción</option>
          <option value="VIRTUAL_CLASSROOM">Aula virtual</option>
        </select>
        <textarea
          rows={4}
          placeholder="Cuéntanos tu necesidad"
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>

      {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}

