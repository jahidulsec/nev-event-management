"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppLogo } from "@/components/shared/logo/app";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function SidebarContainer() {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger id="mobile-sidebar-trigger" className="lg:hidden" asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="overflow-auto w-75!">
        <SheetTitle className="sr-only">customizer</SheetTitle>
        <Link href="#" className="p-4 sticky top-0 bg-background z-10">
          <AppLogo width={120} />
        </Link>
        <Sidebar onLinkClick={() => setSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
