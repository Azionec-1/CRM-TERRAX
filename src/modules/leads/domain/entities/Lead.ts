import type { LeadServiceType, LeadStatus } from "../enums";

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  serviceType: LeadServiceType;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}
