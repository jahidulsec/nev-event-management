"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { navlist } from "@/lib/data";
import { AuthUserRole } from "@/types/auth-user";
import { Button } from "@/components/ui/button";

export default function NavMenu({ role }: { role: AuthUserRole }) {
  const pathname = usePathname();

  const dashboardUrl = "/dashboard";

  const isActive = (url: string) =>
    pathname === dashboardUrl
      ? pathname === url
      : url !== dashboardUrl && pathname.includes(url);

  return (
    <>
      <nav className="hidden lg:block">
        <ul className="flex items-center gap-3">
          {navlist[role as "ao"].map((item) => (
            <li key={item.title}>
              <Button
                variant={"outline"}
                size={"sm"}
                className={cn(
                  "rounded-full shadow-none text-xs font-medium",
                  isActive(item.url)
                    ? "border-primary bg-primary/5 font-semibold"
                    : "gap-0",
                )}
                asChild
              >
                <Link href={item.url}>
                  <item.icon
                    className={`transition-all duration-300 fill-secondary/10 text-secondary/70 
                        ${isActive(item.url) ? "max-w-10" : "max-w-0"}
                    `}
                  />
                  {item.title}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
