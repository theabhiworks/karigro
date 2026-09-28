import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import CustomerProfileForm from "./CustomerProfileForm";

export default async function CustomerProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect("/dashboard/worker");
  }

  return (
    <DashboardShell userName={session.name} role="CUSTOMER">
      <CustomerProfileForm
        initialName={session.name}
        initialEmail={session.email}
      />
    </DashboardShell>
  );
}