export function formatServiceType(serviceType: string) {
  return serviceType === "CONSTRUCTION" ? "Servicios de construccion" : "Aula virtual";
}

export function formatLeadStatus(status: string) {
  if (status === "ACTIVE") return "Activo";
  if (status === "INACTIVE") return "Inactivo";
  return "Potencial";
}
