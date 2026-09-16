import { BellRing } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import NavData from "@/features/dashboard/components/data";
import { NavGroup } from "@/features/dashboard/components/types";
import { AppLogo } from "@/components/shared/logo/app";
import Link from "next/link";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./dropdown-profile";
import { NavButton, NavDropdown } from "./desktop-nav";
import { getAuthUser, getDashboardArea, getDashboardRole } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import SidebarContainer from "./sidebar-container";

export default async function Header() {
  const authUser = await getAuthUser();
  const dashboardRole = await getDashboardRole();
  const dashboardArea = await getDashboardArea();

  const role = dashboardRole as string;
  const area = dashboardArea as string;

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center justify-between container mx-auto p-4">
        <div className="flex items-center gap-3">
          <SidebarContainer />
          <div className="flex items-center gap-3">
            <Link href={"/dashboard"}>
              <AppLogo width={100} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown
            defaultOpen={false}
            align="center"
            trigger={
              <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
                <BellRing className="size-4" />
              </div>
            }
          />
          <ProfileDropdown
            role={role}
            user={authUser as AuthUser}
            area={area}
            trigger={
              <div
                id="profile-dropdown-trigger"
                className="rounded-full cursor-pointer"
              >
                <Avatar className="size-7 rounded-full">
                  <AvatarFallback>{authUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            }
          />
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* NAVIGATION BAR */}
      <div className="hidden lg:flex items-center justify-start gap-1 px-4 py-2 container mx-auto">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex gap-1">
            {(
              NavData[
                role === "superadmin" ? "superadmin" : "other"
              ] as NavGroup[]
            ).map((item) => {
              if (item.type === "dropdown") {
                return (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    items={item.items}
                  />
                );
              }

              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <NavButton
                      label={item.label}
                      icon={item.icon}
                      href={item.href}
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
