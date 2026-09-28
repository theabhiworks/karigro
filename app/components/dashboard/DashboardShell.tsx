"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DashboardShellProps = {
  children: ReactNode;
  userName: string;
  role: "CUSTOMER" | "WORKER";
};

export default function DashboardShell({
  children,
  userName,
  role,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        role={role}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="lg:pl-72">
        <Topbar
          userName={userName}
          role={role}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}