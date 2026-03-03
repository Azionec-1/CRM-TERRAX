import { NextResponse } from "next/server";
import { PrismaLeadRepository } from "@/modules/leads/infrastructure/prisma/PrismaLeadRepository";
import { leadStatusSchema } from "@/modules/leads/presentation/validators/lead.schema";
import { prisma } from "@/lib/db";

const leadRepository = new PrismaLeadRepository(prisma);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const result = leadStatusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Estado inválido" }, { status: 400 });
  }

  try {
    const updated = await leadRepository.updateStatus(id, result.data.status);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Lead no encontrado" }, { status: 404 });
  }
}

