import { Calendars, FileLock, Layout, Pill, Stethoscope, Users2 } from "lucide-react";

export const navlist = {
  superadmin: [
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard",
      icon: Layout,
    },
    {
      id: 2,
      title: "Events",
      url: "/events",
      icon: Calendars,
    },
    {
      id: 3,
      title: "Permissions",
      url: "/permission",
      icon: FileLock,
    },
    {
      id: 4,
      title: "Doctors",
      url: "/doctors",
      icon: Stethoscope,
    },
    {
      id: 5,
      title: "Products",
      url: "/products",
      icon: Pill,
    },
    {
      id: 6,
      title: "Employees",
      url: "/employees",
      icon: Users2,
    },
  ],
};
