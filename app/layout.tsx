import type { Metadata } from "next";
import "./globals.css";
import ProgressProviders from "@/providers/progress-provider";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const inter = localFont({
  src: "./fonts/inter.ttf",
  variable: "--font-inter",
  declarations: [{ prop: "font-feature-settings", value: "'ss01'" }],
});
export const metadata: Metadata = {
  title: "SWiFT - Event Management App",
  description: "An event management system by Nevian LifeScience PLC",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-inter`}>
        <ProgressProviders>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </ProgressProviders>
      </body>
    </html>
  );
}
