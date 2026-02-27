import { ClientsTable } from "@/components/crm/ClientsTable";
import { prisma } from "@/lib/db";
import type { LeadView } from "@/types";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  let leads: Awaited<ReturnType<typeof prisma.lead.findMany>> = [];

  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    leads = [];
  }

  const viewData: LeadView[] = leads.map((lead) => ({
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    serviceType: lead.serviceType as "CONSTRUCTION" | "VIRTUAL_CLASSROOM",
    status: lead.status as "ACTIVE" | "INACTIVE" | "POTENTIAL",
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Clientes</h1>
        <p className="text-neutral-600">
          Gestiona leads de la landing y actualiza su estado comercial.
        </p>
      </div>

      <ClientsTable initialLeads={viewData} />
    </div>
  );
}
