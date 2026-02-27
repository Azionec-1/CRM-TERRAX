"use client";

import { useMemo, useState } from "react";
import { formatServiceType } from "@/lib/utils";
import type { LeadView } from "@/types";

interface ClientsTableProps {
  initialLeads: LeadView[];
}

export function ClientsTable({ initialLeads }: ClientsTableProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "POTENTIAL">("ALL");

  async function updateStatus(id: string, status: "ACTIVE" | "INACTIVE" | "POTENTIAL") {
    const response = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) return;

    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        (lead.company ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === "ALL" || lead.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [filter, leads, search]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, email o empresa..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
          />
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "ALL" | "ACTIVE" | "INACTIVE" | "POTENTIAL")
            }
            className="rounded-lg border border-neutral-300 px-3 py-2.5 outline-none ring-slate-900 focus:ring-2"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="POTENTIAL">Potenciales</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Alta</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-t border-neutral-200">
                <td className="p-4">
                  <p className="font-medium text-neutral-900">{lead.fullName}</p>
                  <p className="text-xs text-neutral-500">{lead.company || "Sin empresa"}</p>
                </td>
                <td className="p-4">
                  <p className="text-neutral-800">{lead.email}</p>
                  <p className="text-xs text-neutral-500">{lead.phone || "Sin telefono"}</p>
                </td>
                <td className="p-4 text-neutral-700">{formatServiceType(lead.serviceType)}</td>
                <td className="p-4">
                  <select
                    value={lead.status}
                    onChange={(event) =>
                      updateStatus(
                        lead.id,
                        event.target.value as "ACTIVE" | "INACTIVE" | "POTENTIAL",
                      )
                    }
                    className="rounded-lg border border-neutral-300 px-2 py-1.5 text-xs outline-none ring-slate-900 focus:ring-2"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="POTENTIAL">Potencial</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </td>
                <td className="p-4 text-neutral-600">
                  {new Date(lead.createdAt).toLocaleDateString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-neutral-500">
          No hay registros para el filtro seleccionado.
        </div>
      )}

      <p className="text-sm text-neutral-500">
        Total visible: <span className="font-semibold">{filteredLeads.length}</span> leads.
      </p>
    </div>
  );
}
