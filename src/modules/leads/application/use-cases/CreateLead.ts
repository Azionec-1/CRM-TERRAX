import type { CreateLeadDTO } from "../dto/CreateLeadDTO";
import type { LeadRepository } from "../../domain/repositories/LeadRepository";

export class CreateLead {
  constructor(private readonly leadRepository: LeadRepository) {}

  execute(input: CreateLeadDTO) {
    return this.leadRepository.create(input);
  }
}
