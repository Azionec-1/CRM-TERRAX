import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  bgColorClass,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${bgColorClass}`}>
          <Icon className={`size-6 ${colorClass}`} />
        </div>
        <span className="text-sm text-neutral-500">{subtitle}</span>
      </div>
      <p className="mb-1 text-sm text-neutral-600">{title}</p>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
