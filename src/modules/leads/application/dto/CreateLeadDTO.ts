import type { LeadServiceType } from "../../domain/enums";

export interface CreateLeadDTO {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  serviceType: LeadServiceType;
}
