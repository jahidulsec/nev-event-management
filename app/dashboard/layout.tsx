import { Footer } from "@/components/shared/footer/footer";
import AppNav from "@/components/shared/navbar/app-nav";
import { getAuthUser } from "@/lib/dal";
import NotificationProvider from "@/providers/notification-provider";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const authUser = await getAuthUser();

  if (!authUser) redirect("/login");

  return (
    <div className="relative">
      <NotificationProvider userId={authUser.workAreaCode}>
        <AppNav />
        <main className="min-h-[calc(100vh-120px)] pt-6 flex flex-col gap-6">
          {children}
        </main>
        <Footer />
      </NotificationProvider>
    </div>
  );
}
