export interface LeadView {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  serviceType: "CONSTRUCTION" | "VIRTUAL_CLASSROOM";
  status: "ACTIVE" | "INACTIVE" | "POTENTIAL";
  createdAt: string;
}
