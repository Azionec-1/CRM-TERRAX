import type { CreateLeadDTO } from "../../application/dto/CreateLeadDTO";
import type { Lead } from "../entities/Lead";
import type { LeadStatus } from "../enums";

export interface LeadRepository {
  create(data: CreateLeadDTO): Promise<Lead>;
  findAll(): Promise<Lead[]>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
  updateNotes(id: string, notes: string | null): Promise<Lead>;
  countByStatus(status: LeadStatus): Promise<number>;
}
