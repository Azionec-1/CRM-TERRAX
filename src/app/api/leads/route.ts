import { NextResponse } from "next/server";
import { CreateLead } from "@/modules/leads/application/use-cases/CreateLead";
import { ListLeads } from "@/modules/leads/application/use-cases/ListLeads";
import { PrismaLeadRepository } from "@/modules/leads/infrastructure/prisma/PrismaLeadRepository";
import { leadSchema } from "@/modules/leads/presentation/validators/lead.schema";
import { prisma } from "@/lib/db";

const leadRepository = new PrismaLeadRepository(prisma);

export async function POST(request: Request) {
  const body = await request.json();
  const result = leadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Datos invalidos", error: result.error.flatten() },
      { status: 400 },
    );
  }

  const createLead = new CreateLead(leadRepository);
  const created = await createLead.execute({
    ...result.data,
    phone: result.data.phone || undefined,
    company: result.data.company || undefined,
    message: result.data.message || undefined,
  });

  return NextResponse.json(created, { status: 201 });
}

export async function GET() {
  const listLeads = new ListLeads(leadRepository);
  const leads = await listLeads.execute();
  return NextResponse.json(leads);
}
