import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeadServiceType, LeadStatus } from "@prisma/client";

export interface DevLead {
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

const dirPath = path.join(process.cwd(), ".tmp");
const filePath = path.join(dirPath, "dev-leads.json");

async function ensureStoreFile() {
  await mkdir(dirPath, { recursive: true });
  try {
    await readFile(filePath, "utf-8");
  } catch {
    await writeFile(filePath, "[]", "utf-8");
  }
}

function parseLead(raw: Omit<DevLead, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }) {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

async function readLeads() {
  await ensureStoreFile();
  const content = await readFile(filePath, "utf-8");
  const parsed = JSON.parse(content) as Array<
    Omit<DevLead, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }
  >;
  return parsed.map(parseLead);
}

async function writeLeads(leads: DevLead[]) {
  await ensureStoreFile();
  await writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
}

export async function createDevLead(input: {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  serviceType: LeadServiceType;
}) {
  const leads = await readLeads();
  const now = new Date();
  const newLead: DevLead = {
    id: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone || null,
    company: input.company || null,
    message: input.message || null,
    serviceType: input.serviceType,
    status: "POTENTIAL",
    createdAt: now,
    updatedAt: now,
  };
  leads.unshift(newLead);
  await writeLeads(leads);
  return newLead;
}

export async function listDevLeads() {
  const leads = await readLeads();
  return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function countDevLeadsByStatus(status: LeadStatus) {
  const leads = await listDevLeads();
  return leads.filter((lead) => lead.status === status).length;
}

export async function updateDevLeadStatus(id: string, status: LeadStatus) {
  const leads = await listDevLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) return null;
  leads[index] = { ...leads[index], status, updatedAt: new Date() };
  await writeLeads(leads);
  return leads[index];
}
