import { NextResponse } from "next/server";
import { PrismaLeadRepository } from "@/modules/leads/infrastructure/prisma/PrismaLeadRepository";
import { leadNotesSchema } from "@/modules/leads/presentation/validators/lead.schema";
import { prisma } from "@/lib/db";

const leadRepository = new PrismaLeadRepository(prisma);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const result = leadNotesSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Notas inválidas" }, { status: 400 });
  }

  try {
    const notes = result.data.notes?.trim() || null;
    const updated = await leadRepository.updateNotes(id, notes);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Lead no encontrado" }, { status: 404 });
  }
}

