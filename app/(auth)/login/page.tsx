import { Footer } from "@/components/shared/footer/footer";
import LoginForm from "@/features/auth/components/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <>
      <main className="min-h-[calc(100vh-140px)] w-full flex justify-center items-center flex-col gap-10 px-4">
        <LoginForm />
      </main>
      <Footer className="w-full" />
    </>
  );
}
