"use client";

import React from "react";
import { TextAlignStart } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthUserRole } from "@/types/auth-user";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LogoFull } from "../logo/logo";
import { navlist } from "@/lib/data";

export default function NavTitle({ role }: { role: AuthUserRole[] }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      <Button
        size={"icon"}
        variant={"ghost"}
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <TextAlignStart /> <span className="sr-only">Menu</span>
      </Button>
      <LogoFull width={120} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="min-h-svh h-full">
          <SheetHeader>
            <LogoFull width={100} />
            <SheetTitle className="sr-only">Nevian</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-3 px-6">
              {navlist["superadmin"].map((item) => (
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
