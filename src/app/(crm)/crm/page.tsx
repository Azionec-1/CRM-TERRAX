import { Building2, UserCheck, UserRoundX, Users } from "lucide-react";
import { StatCard } from "@/components/crm/StatCard";
import { prisma } from "@/lib/db";
import { formatServiceType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CrmDashboardPage() {
  let total = 0;
  let active = 0;
  let inactive = 0;
  let potential = 0;
  let recent: Array<{
    id: string;
    fullName: string;
    email: string;
    serviceType: string;
    status: string;
    createdAt: Date;
  }> = [];

  try {
    [total, active, inactive, potential, recent] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "ACTIVE" } }),
      prisma.lead.count({ where: { status: "INACTIVE" } }),
      prisma.lead.count({ where: { status: "POTENTIAL" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);
  } catch {
    recent = [];
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Resumen de captacion y estado de clientes Terrax.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de leads"
          value={total}
          subtitle="Base consolidada"
          icon={Users}
          colorClass="text-blue-600"
          bgColorClass="bg-blue-50"
        />
        <StatCard
          title="Clientes activos"
          value={active}
          subtitle="En gestion comercial"
          icon={UserCheck}
          colorClass="text-green-600"
          bgColorClass="bg-green-50"
        />
        <StatCard
          title="Clientes potenciales"
          value={potential}
          subtitle="Nuevas oportunidades"
          icon={Building2}
          colorClass="text-orange-600"
          bgColorClass="bg-orange-50"
        />
        <StatCard
          title="Clientes inactivos"
          value={inactive}
          subtitle="Sin avance reciente"
          icon={UserRoundX}
          colorClass="text-neutral-600"
          bgColorClass="bg-neutral-200"
        />
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-5">
          <h2 className="text-lg font-semibold text-neutral-900">Leads recientes</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {recent.length === 0 && (
            <p className="p-5 text-neutral-500">Aun no hay leads registrados desde la landing.</p>
          )}
          {recent.map((lead) => (
            <div key={lead.id} className="grid gap-3 p-5 md:grid-cols-5">
              <p className="font-medium text-neutral-900">{lead.fullName}</p>
              <p className="text-neutral-700">{lead.email}</p>
              <p className="text-neutral-700">{formatServiceType(lead.serviceType)}</p>
              <p className="text-neutral-700">{lead.status}</p>
              <p className="text-neutral-500">
                {new Date(lead.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
