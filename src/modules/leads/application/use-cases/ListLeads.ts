import type { LeadRepository } from "../../domain/repositories/LeadRepository";

export class ListLeads {
  constructor(private readonly leadRepository: LeadRepository) {}

  execute() {
    return this.leadRepository.findAll();
  }
}
