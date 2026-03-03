"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@terrax.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      router.push("/crm");
      router.refresh();
    } catch {
      setError("No fue posible iniciar sesión. Verifica email y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <LockKeyhole className="size-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Acceso CRM Terrax</h1>
            <p className="text-sm text-neutral-600">Inicia sesión para gestionar leads.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-70"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}

