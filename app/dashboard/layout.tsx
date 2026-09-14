import Header from "@/components/dashboard/header";
import { Footer } from "@/components/shared/footer/footer";
import { getAuthUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getAuthUser();

  if (!!user && !user?.role.includes("superadmin")) redirect("/login");
  
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="min-h-[calc(100vh-270px)] pt-6 flex flex-col gap-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
