import type { ReactNode } from "react";
import { Sidebar } from "@/components/crm/Sidebar";
import { LogoutButton } from "@/components/crm/LogoutButton";

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-neutral-200 bg-white px-6">
          <LogoutButton />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
