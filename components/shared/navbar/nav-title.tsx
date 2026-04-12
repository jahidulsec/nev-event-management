"use client";

import React from "react";
import { TextAlignStart } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthUser, AuthUserRole } from "@/types/auth-user";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LogoFull } from "../logo/company";
import { navlist } from "@/lib/data";
import { ProfileButton } from "../button/profile-button";
import RoleSelect from "./role-select";
import { AppLogo } from "../logo/app";

export default function NavTitle({
  role,
  user,
}: {
  role: AuthUserRole;
  user: AuthUser;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      <Button
        size={"icon"}
        variant={"ghost"}
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <TextAlignStart /> <span className="sr-only">Menu</span>
      </Button>
      <AppLogo width={120} height={100} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="min-h-svh h-full">
          <SheetHeader>
            <AppLogo width={80} height={100} />

            <SheetTitle className="sr-only">Nevian</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-3 px-6">
              {navlist[role as "ao"].map((item) => (
                <li key={item.title} className="w-full">
                  <Button
                    variant={pathname === item.url ? "outline" : "ghost"}
                    size={"lg"}
                    className={cn(
                      "justify-start rounded-full shadow-none text-left font-medium w-full",
                    )}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon
                        className={`transition-all duration-300 fill-primary/40 text-primary/90 
                    `}
                      />
                      {item.title}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex sm:hidden p-6">
            <RoleSelect role={role} user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
