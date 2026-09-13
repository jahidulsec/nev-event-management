import type { Metadata } from "next";
import "./globals.css";
import ProgressProviders from "@/providers/progress-provider";
import { Outfit, Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppMetaData } from "@/lib/data";

const outfit = Outfit({
  subsets: ["latin"], variable: "--font-sans"
})

const raleway = Raleway({
  subsets: ["latin"], variable: "--font-heading"
})


export const metadata: Metadata = {
  title: {
    default: `${AppMetaData.title} - Event Management App`,
    template: `%s - ${AppMetaData.title}`,
  },
  description: AppMetaData.desc,
  creator: "Impala Intech LTD.",
  publisher: "Nevian Lifescience PLC",
  openGraph: {
    title: {
      default: `${AppMetaData.title} - Event Management App`,
      template: `%s - ${AppMetaData.title}`,
    },
    description: AppMetaData.desc,
    siteName: AppMetaData.title,
    images: [
      {
        url: "/logo/nevian.png",
        width: 1200,
        height: 630,
        alt: AppMetaData.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${raleway.variable} antialiased font-sans`}>
        <ProgressProviders>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </ProgressProviders>
      </body>
    </html>
  );
}
