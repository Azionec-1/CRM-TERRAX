"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Menu, Users, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm/clients", label: "Clientes", icon: Users },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} border-r border-neutral-200 bg-white transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        {open ? (
          <>
            <div className="flex items-center gap-2">
              <Building2 className="size-8 text-emerald-700" />
              <span className="text-xl font-bold text-neutral-900">TERRAX</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-neutral-100"
            >
              <X className="size-5 text-neutral-600" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto rounded p-1 hover:bg-neutral-100"
          >
            <Menu className="size-5 text-neutral-600" />
          </button>
        )}
      </div>

      <nav className="space-y-1 px-3 py-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/crm" ? pathname === "/crm" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              {open && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
