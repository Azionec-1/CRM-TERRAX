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
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  async function updateStatus(id: string, status: "ACTIVE" | "INACTIVE" | "POTENTIAL") {
    const response = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) return;

    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  function openDetail(lead: LeadView) {
    setSelectedLeadId(lead.id);
    setDraftNote(lead.notes ?? "");
    setNoteError(null);
  }

  function closeDetail() {
    setSelectedLeadId(null);
    setDraftNote("");
    setNoteError(null);
  }

  async function saveNote() {
    if (!selectedLeadId) return;
    setSavingNote(true);
    setNoteError(null);

    try {
      const response = await fetch(`/api/leads/${selectedLeadId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: draftNote }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar");
      }

      const updatedLead = (await response.json()) as LeadView;
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updatedLead.id ? { ...lead, notes: updatedLead.notes } : lead)),
      );
      setDraftNote(updatedLead.notes ?? "");
      closeDetail();
    } catch {
      setNoteError("No se pudo guardar la nota. Intenta nuevamente.");
    } finally {
      setSavingNote(false);
    }
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

  const selectedLead = selectedLeadId ? leads.find((lead) => lead.id === selectedLeadId) ?? null : null;

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
              <th className="p-4">Acciones</th>
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
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => openDetail(lead)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Ver detalle
                  </button>
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

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Detalle de consulta</h3>
                <p className="text-sm text-neutral-600">{selectedLead.fullName}</p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Consulta enviada
                </p>
                <p className="text-sm text-neutral-700">
                  {selectedLead.message?.trim() || "Este cliente no envio descripcion en el formulario."}
                </p>
              </div>

              <div>
                <label htmlFor="lead-note" className="mb-1 block text-sm font-medium text-neutral-800">
                  Notas internas
                </label>
                <textarea
                  id="lead-note"
                  rows={5}
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Escribe seguimiento comercial, acuerdos o tareas pendientes..."
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-slate-900 focus:ring-2"
                />
                {noteError && <p className="mt-1 text-xs text-red-600">{noteError}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveNote}
                  disabled={savingNote}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {savingNote ? "Guardando..." : "Guardar nota"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
