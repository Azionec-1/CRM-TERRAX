import type { PrismaClient } from "@prisma/client";
import type { CreateLeadDTO } from "../../application/dto/CreateLeadDTO";
import type { LeadRepository } from "../../domain/repositories/LeadRepository";
import type { LeadStatus } from "../../domain/enums";
import type { Lead } from "../../domain/entities/Lead";

export class PrismaLeadRepository implements LeadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateLeadDTO): Promise<Lead> {
    const created = await this.prisma.lead.create({
      data: {
        ...data,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
      },
    });
    return created as Lead;
  }

  async findAll(): Promise<Lead[]> {
    const leads = await this.prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return leads as Lead[];
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const updated = await this.prisma.lead.update({
      where: { id },
      data: { status },
    });
    return updated as Lead;
  }

  countByStatus(status: LeadStatus): Promise<number> {
    return this.prisma.lead.count({
      where: { status },
    });
  }
}
