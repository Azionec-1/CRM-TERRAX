import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(3, "Nombre requerido"),
  email: z.string().email("Email invalido"),
  phone: z.string().min(7, "Telefono invalido").optional().or(z.literal("")),
  company: z.string().optional(),
  message: z.string().max(500).optional(),
  serviceType: z.enum(["CONSTRUCTION", "VIRTUAL_CLASSROOM"]),
});

export const leadStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "POTENTIAL"]),
});

export const leadNotesSchema = z.object({
  notes: z.string().max(2000).optional().or(z.literal("")),
});
